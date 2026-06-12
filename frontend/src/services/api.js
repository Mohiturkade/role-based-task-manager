import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle auth errors globally
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const getMe = () => API.get("/auth/me");

// Tasks (User)
export const fetchTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// Admin Users
export const fetchAllUsers = () => API.get("/admin/users");
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const updateUserStatus = (id, status) =>
  API.patch(`/admin/users/${id}/status`, { status });

// Admin Tasks
export const fetchAllTasks = () => API.get("/admin/tasks");
export const adminDeleteTask = (id) => API.delete(`/admin/tasks/${id}`);

// Admin Stats
export const fetchStats = () => API.get("/admin/stats");

// Activity Logs
export const fetchActivityLogs = () => API.get("/activity");

export default API;