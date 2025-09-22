import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api",
});

export const registerModel = (formData) => API.post("/registrations", formData);
export const getRegistrations = () => API.get("/registrations/all");
export const updateRegistrationStatus = (id, status) => API.patch(`/registrations/${id}/status`, { status });
export const deleteRegistration = (id) => API.delete(`/registrations/${id}`);
export const getRegistrationById = (id) => API.get(`/registrations/all/${id}`);
