import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    console.log("🔄 AuthContext Init:", {
      hasSavedUser: !!savedUser,
      hasToken: !!token,
      savedUserRole: savedUser ? JSON.parse(savedUser)?.role : "none"
    }); // Debug
    
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        console.log("✅ AuthContext: User loaded from storage", { role: user.role, email: user.email }); // Debug
        setUser(user);
      } catch (err) {
        console.error("❌ AuthContext: Error parsing saved user", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/users/register", {
        name,
        email,
        password,
        role: "student"
      });
      
      const { token, user: userData } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔐 LOGIN ATTEMPT:", { email }); // Debug: login start
      
      const res = await API.post("/users/login", { email, password });
      
      console.log("✅ LOGIN SUCCESS - Response:", res.data); // Debug: full response
      
      const { token, user: userData } = res.data;
      
      if (!token || !userData) {
        console.error("❌ LOGIN ERROR: Missing token or user data", { hasToken: !!token, hasUser: !!userData });
        throw new Error("Invalid response from server");
      }
      
      console.log("📝 STORING USER:", { id: userData._id, email: userData.email, role: userData.role }); // Debug: what we're storing
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      console.log("✅ AUTH CONTEXT UPDATED - User role:", userData.role); // Debug: context updated
      
      return { success: true, data: userData };
    } catch (err) {
      console.error("❌ LOGIN ERROR CAUGHT:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        fullError: err.message,
        responseData: err.response?.data
      }); // Debug: full error details
      
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
