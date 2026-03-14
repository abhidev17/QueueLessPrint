import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
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