import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true, // optional, if your backend uses cookies/sessions 
  headers: {
    'Content-Type': 'application/json',
  },
});

// OPTIONAL: Add interceptors for auth
api.interceptors.request.use((config) => {
  console.log("[api] baseURL =", import.meta.env.VITE_API_URL || "http://localhost:8000");
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // handle session expiration
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
