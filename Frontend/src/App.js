import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StepperForm from "./components/RegistrationForm";
import AdminDashboard from "./components/AdminDashboard";
import RegistrationDetail from "./components/RegistrationDetail";
import AdminLogin from "./components/AdminLogin";
import ModelRegistrationForm from "./components/NewForm";
import AdminSubscribers from "./components/AdminSubscribers";
import ProtectedRoute from "./components/ProtectedRoutes";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Frontend Registration Forms */}
          <Route path="/old" element={<StepperForm />} />
          <Route path="/" element={<ModelRegistrationForm/>}/>
          {/* Admin Dashboard */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/registrations/all/:id"
  element={
    <ProtectedRoute>
      <RegistrationDetail />
    </ProtectedRoute>
  }
/>
          <Route path="/admin/subscribers" element={
            <ProtectedRoute><AdminSubscribers /></ProtectedRoute>} /> 
          {/* Redirect any unknown route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
