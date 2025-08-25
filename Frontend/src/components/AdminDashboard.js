import React, { useEffect, useState } from "react";
import { getRegistrations, updateRegistrationStatus, deleteRegistration } from "../api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await getRegistrations();
    setItems(data);
  };

  useEffect(()=>{ load(); }, []);

  const setStatus = async (id, status) => {
    await updateRegistrationStatus(id, status);
    await load();
  };

  const remove = async (id) => {
    await deleteRegistration(id);
    await load();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Model Type</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(r=>(
            <tr key={r.id}>
              <td className="p-2 border">{r.fullName}</td>
              <td className="p-2 border">{r.email}</td>
              <td className="p-2 border">{r.modelType}</td>
              <td className="p-2 border">{r.status || "pending"}</td>
              <td className="p-2 border flex gap-2">
                <button onClick={()=>setStatus(r.id, "approved")} className="px-2 py-1 rounded bg-green-500 text-white">Approve</button>
                <button onClick={()=>setStatus(r.id, "rejected")} className="px-2 py-1 rounded bg-yellow-500 text-white">Reject</button>
                <button onClick={()=>remove(r.id)} className="px-2 py-1 rounded bg-red-600 text-white">Delete</button>
                <Link to={`/admin/registrations/${r.id}`} className="px-2 py-1 rounded bg-blue-500 text-white">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
