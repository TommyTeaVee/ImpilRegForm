import React, { useEffect, useState, useContext } from "react";
import { getSubscribers, deleteSubscriber } from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Subscribers() {
  const [subs, setSubs] = useState([]);
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const load = async () => {
    try {
      const { data } = await getSubscribers();
      setSubs(data);
    } catch (err) {
      console.error("Error loading subscribers:", err);
      logout();
      navigate("/admin-login");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    load();
  }, [token]);

  const remove = async (id) => {
    await deleteSubscriber(id);
    load();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-black border border-yellow-500 rounded shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-yellow-500">Subscribers</h2>

        <div className="space-x-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-3 py-1 rounded bg-yellow-500 text-black hover:bg-yellow-600 transition"
          >
            Back to Dashboard
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
        Newsletter Subscribers
      </h1>

      {/* TABLE */}
      <table className="w-full border-collapse border border-yellow-500 text-white">
        <thead className="bg-yellow-500 text-black">
          <tr>
            <th className="p-2 border border-yellow-500">Name</th>
            <th className="p-2 border border-yellow-500">Email</th>
            <th className="p-2 border border-yellow-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((s) => (
            <tr key={s.id} className="hover:bg-gray-900 transition">
              <td className="p-2 border border-yellow-500">
                {s.fullname || "—"}
              </td>
              <td className="p-2 border border-yellow-500">{s.email}</td>
              <td className="p-2 border border-yellow-500">
                <button
                  onClick={() => remove(s.id)}
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {subs.length === 0 && (
            <tr>
              <td
                className="p-3 border border-yellow-500 text-center text-gray-400"
                colSpan="3"
              >
                No subscribers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
