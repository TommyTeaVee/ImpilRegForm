import React, { useEffect, useState } from "react";

export default function AdminSubscribers() {
  const [subs, setSubs] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch subscribers
  const loadSubscribers = () => {
    fetch( process.env.REACT_APP_SERVER_URL+"/api/subscribers")
      .then((res) => res.json())
      .then((data) => setSubs(data))
      .catch((err) => console.error("Failed to load subscribers:", err));
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  // Delete Subscriber
  const handleDelete = async (id, email) => {
    const confirmDelete = window.confirm(
      `Delete subscriber:\n${email}\n\nThis action cannot be undone.`
    );
    if (!confirmDelete) return;

    const res = await fetch(`/api/subscribers/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      setSubs(subs.filter((s) => s.id !== id));
    } else {
      alert("Failed to delete subscriber.");
    }
  };

  const filtered = subs.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">
          Impilo Admin — Subscribers
        </h1>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by email..."
            className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:border-yellow-400 focus:ring-yellow-400 focus:ring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-neutral-900 p-4 rounded-xl shadow-xl border border-neutral-800 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-neutral-700">
              <tr>
                <th className="py-3 px-2 text-yellow-400">Email</th>
                <th className="py-3 px-2 text-yellow-400">Subscribed At</th>
                <th className="py-3 px-2 text-yellow-400 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800 transition"
                  >
                    <td className="py-3 px-2">{user.email}</td>
                    <td className="py-3 px-2">
                      {new Date(user.subscribedAt).toLocaleString()}
                    </td>

                    {/* DELETE BUTTON */}
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => handleDelete(user.id, user.email)}
                        className="px-4 py-2 rounded-lg border border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-neutral-400 text-center">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Count */}
        <p className="text-neutral-400 mt-4">
          Total Subscribers:{" "}
          <span className="text-yellow-400">{filtered.length}</span>
        </p>
      </div>
    </div>
  );
}
