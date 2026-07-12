import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage on every request if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("fleet_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Store token when received from auth endpoints
api.interceptors.response.use((response) => {
  if (response.data?.token && typeof window !== "undefined") {
    localStorage.setItem("fleet_token", response.data.token);
  }
  return response;
});
