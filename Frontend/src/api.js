import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,

}); 

export const LoginDetails = (formdata) =>API.post("/api/auth/login", formdata)
export const registerModel = (formData) => API.post("/api/registrations", formData);
export const getRegistrations = () => API.get("/api/registrations/all");
export const updateRegistrationStatus = (id, status) => API.patch(`/api/registrations/${id}/status`, { status });
export const deleteRegistration = (id) => API.delete(`/api/registrations/${id}`);
export const getRegistrationById = (id) => API.get(`/registrations/all/${id}`);
export const loadSubscribers =() =>API.get('/subscribers')
