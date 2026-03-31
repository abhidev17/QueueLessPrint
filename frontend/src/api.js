import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${API_URL}/api`
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("📤 API REQUEST:", {
    method: config.method.toUpperCase(),
    url: config.url,
    hasToken: !!token,
    data: config.data ? (config.data instanceof FormData ? "FormData" : config.data) : "no-data"
  }); // Debug
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Don't force json content-type for FormData - let browser set it
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging
    console.error("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
      method: error.config?.method,
      fullError: error.response?.data
    });

    if (error.response?.status === 401) {
      // Only clear and redirect if user is actually logged in
      const user = localStorage.getItem("user");
      if (user) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Reload to trigger login page
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    }
    return Promise.reject(error);
  }
);

export default API;