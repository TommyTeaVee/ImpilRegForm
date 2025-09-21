import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRegistrationById,
  updateRegistrationStatus,
  deleteRegistration,
} from "../api";

const imageSections = [
  { label: "Profile", keys: ["profileImage"] },
  {
    label: "Full Body",
    keys: ["fullBodyImage", "fullDress", "fullShorts", "fullJeans"],
  },
  {
    label: "Close-Ups",
    keys: ["closeForward", "closeLeft", "closeRight"],
  },
  {
    label: "Sportswear / Summerwear / Swimwear",
    keys: ["sportswear", "summerwear", "swimwear"],
  },
  { label: "Extra Images", keys: ["extraImages"] }, // stored as array
];

export default function RegistrationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    fetchRegistration();
  }, []);

  const fetchRegistration = async () => {
    try {
      const { data } = await getRegistrationById(id);
      setRegistration(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatus = async (status) => {
    await updateRegistrationStatus(id, status);
    fetchRegistration();
  };

  const handleDelete = async () => {
    await deleteRegistration(id);
    navigate("/admin");
  };

  if (!registration) return <p className="p-6">Loading...</p>;

  // fallback placeholder
  const placeholder = "https://via.placeholder.com/150";

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-yellow-500">
      {/* Banner */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-black">
          Impilo Talent Agency – Registration
        </h1>
        <p className="text-gray-700">Admin Review Panel</p>
      </div>

      {/* Information */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-yellow-600 mb-2">Information</h2>
        <p><strong>Full Name:</strong> {registration.fullName}</p>
        <p><strong>Email:</strong> {registration.email}</p>
        <p><strong>Phone:</strong> {registration.phone}</p>
        <p><strong>Date of Birth:</strong> {new Date(registration.dob).toLocaleDateString()}</p>
        <p><strong>Gender:</strong> {registration.gender}</p>
        <p><strong>Model Type:</strong> {registration.modelType}</p>
        {registration.bio && <p><strong>Bio:</strong> {registration.bio}</p>}
        {registration.allergiesOrSkin && <p><strong>Allergies / Skin Info:</strong> {registration.allergiesOrSkin}</p>}
      </div>

      {/* Measurements */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-yellow-600 mb-2">Measurements</h2>
        <p>
          <strong>Height:</strong> {registration.height} cm | <strong>Weight:</strong> {registration.weight} kg
        </p>
        <p>
          <strong>Bust/Waist/Hips:</strong> {registration.bust}/{registration.waist}/{registration.hips}
        </p>
        <p>
          <strong>Shoe Size:</strong> {registration.shoe} | <strong>Hair:</strong> {registration.hairColor} | <strong>Eyes:</strong> {registration.eyeColor}
        </p>
      </div>

      {/* Socials */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-yellow-600 mb-2">Socials</h2>
        <p><strong>Facebook:</strong> {registration.facebook || "N/A"}</p>
        <p><strong>Instagram:</strong> {registration.instagram || "N/A"}</p>
        <p><strong>TikTok:</strong> {registration.tiktok || "N/A"}</p>
        <p><strong>Visual Arts / Skills:</strong> {registration.visualArts?.join(", ") || "None"}</p>
      </div>

      {/* Pictures */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-yellow-600 mb-4">Pictures</h2>
        {imageSections.map((section) => (
          <div key={section.label} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{section.label}</h3>
            <div className="flex gap-2 flex-wrap">
              {section.keys.map((key) => {
                // handle array (extraImages)
                if (key === "extraImages") {
                  return registration.extraImages?.length > 0 ? (
                    registration.extraImages.map((url, idx) => (
                      <img
                        key={idx}
                        src={url || placeholder}
                        alt={`extra-${idx}`}
                        className="w-32 h-40 object-cover rounded-lg shadow"
                      />
                    ))
                  ) : (
                    <div
                      key="no-extra"
                      className="w-32 h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-xs rounded"
                    >
                      No Extra Images
                    </div>
                  );
                }

                // single image
                return (
                  <img
                    key={key}
                    src={registration[key] || placeholder}
                    alt={key}
                    className="w-32 h-40 object-cover rounded-lg shadow"
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3 flex-wrap">
        <button
          onClick={() => handleStatus("approved")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow"
        >
          Approve
        </button>
        <button
          onClick={() => handleStatus("rejected")}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow"
        >
          Reject
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
