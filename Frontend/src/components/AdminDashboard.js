import React, { useEffect, useState, useContext } from "react";
import {
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
} from "../api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  
  // ⭐ MUST include loading, not only token
  const { token, loading, logout } = useContext(AuthContext);

  const load = async () => {
    try {
      const { data } = await getRegistrations();
      setItems(data);
    } catch (err) {
      console.error("Error loading registrations:", err);
      logout();
      navigate("/admin-login");
    }
  };

  // ⭐ Corrected logic
  useEffect(() => {
    if (loading) return;                // Wait for AuthContext
    
    if (!token) {                       // Only redirect AFTER loading
      navigate("/admin-login");
      return;
    }

    load();                             // Safe to fetch data now
  }, [loading, token]);

  const setStatus = async (id, status) => {
    await updateRegistrationStatus(id, status);
    await load();
  };

  const remove = async (id) => {
    await deleteRegistration(id);
    await load();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-black border border-yellow-500 rounded shadow-lg">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-yellow-500">Admin Panel</h2>

        <div className="space-x-3">
          <button
            onClick={() => navigate("/admin/subscribers")}
            className="px-3 py-1 rounded bg-yellow-500 text-black hover:bg-yellow-600 transition"
          >
            View Subscribers
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/admin-login");
            }}
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-yellow-500 text-center">
        Admin Dashboard
      </h1>

      {/* Registrations Table */}
      <table className="w-full border-collapse border border-yellow-500 text-white">
        <thead className="bg-yellow-500 text-black">
          <tr>
            <th className="p-2 border border-yellow-500">Name</th>
            <th className="p-2 border border-yellow-500">Email</th>
            <th className="p-2 border border-yellow-500">Model Type</th>
            <th className="p-2 border border-yellow-500">Status</th>
            <th className="p-2 border border-yellow-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="hover:bg-gray-900 transition">
              <td className="p-2 border border-yellow-500">{r.fullName}</td>
              <td className="p-2 border border-yellow-500">{r.email}</td>
              <td className="p-2 border border-yellow-500">{r.modelType}</td>
              <td className="p-2 border border-yellow-500">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    r.status === "approved"
                      ? "bg-green-600 text-white"
                      : r.status === "rejected"
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-yellow-400"
                  }`}
                >
                  {r.status || "pending"}
                </span>
              </td>
              <td className="p-2 border border-yellow-500 flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatus(r.id, "approved")}
                  className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => setStatus(r.id, "rejected")}
                  className="px-3 py-1 rounded bg-yellow-600 text-black hover:bg-yellow-700 transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <Link
                  to={`/admin/registrations/all/${r.id}`}
                  className="px-3 py-1 rounded bg-yellow-500 text-black hover:bg-yellow-600 transition"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
