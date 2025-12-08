import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL || "https://reg.impilomag.co.za",
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const LoginDetails = (formdata) =>
  API.post("/api/auth/login", formdata);

// REGISTRATION CRUD
export const registerModel = (formData) =>
  API.post("/api/registrations", formData);

export const getRegistrations = () =>
  API.get("/api/registrations/all");

export const getRegistrationById = (id) =>
  API.get(`/api/registrations/all/${id}`);

export const updateRegistrationStatus = (id, status) =>
  API.patch(`/api/registrations/all/${id}/status`, { status });

export const deleteRegistration = (id) =>
  API.delete(`/api/registrations/all/${id}`);

// SUBSCRIBERS
export const getSubscribers = () => API.get("/api/subscribers");
export const deleteSubscriber = (id) =>
  API.delete(`/api/subscribers/${id}`);
