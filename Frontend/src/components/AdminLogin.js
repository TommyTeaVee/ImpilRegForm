import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginDetails } from "../api";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await LoginDetails(form);
      if (data?.token) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid login details");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md bg-black border border-yellow-500 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
          Admin Login
        </h2>

        {error && (
          <p className="mb-4 text-red-500 text-sm font-semibold text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-yellow-500 mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 rounded bg-gray-900 border border-yellow-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-yellow-500 mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 rounded bg-gray-900 border border-yellow-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
