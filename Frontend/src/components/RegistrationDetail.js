import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRegistrationById, updateRegistrationStatus, deleteRegistration } from "../api";

const imageSections = [
  { label: "Full Body", keys: ["Full Body-Dress","Full Body-Shorts","Full Body-Jeans/Pants"] },
  { label: "Close-Ups", keys: ["Close-Ups-Forward","Close-Ups-Left","Close-Ups-Right"] },
  { label: "Sports/Summer/Swimwear", keys: ["Sports/Summer/Swimwear-Sportswear","Sports/Summer/Swimwear-Summerwear","Sports/Summer/Swimwear-Swimwear"] }
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

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{registration.fullName}</h1>
      <p><strong>Email:</strong> {registration.email}</p>
      <p><strong>Phone:</strong> {registration.phone}</p>
      <p><strong>Model Type:</strong> {registration.modelType}</p>
      <p><strong>Bio:</strong> {registration.bio}</p>
      <p><strong>Height:</strong> {registration.height} | <strong>Weight:</strong> {registration.weight}</p>
      <p><strong>Bust/Waist/Hips:</strong> {registration.bust}/{registration.waist}/{registration.hips}</p>
      <p><strong>Shoe Size:</strong> {registration.shoeSize} | <strong>Hair:</strong> {registration.hairColor} | <strong>Eyes:</strong> {registration.eyeColor}</p>
      <p><strong>Visual Arts / Skills:</strong> {registration.visualArts?.join(", ")}</p>
      <p><strong>Allergies / Skin Info:</strong> {registration.allergies}</p>

      {/* Images */}
      <div className="mt-6">
        {imageSections.map(section => (
          <div key={section.label} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{section.label}</h2>
            <div className="flex gap-2 flex-wrap">
              {section.keys.map(key => registration.images[key] ? (
                <div key={key} className="flex flex-col items-center">
                  <p className="text-xs mb-1">{key.split("-")[1]}</p>
                  <img src={registration.images[key]} alt={key} className="w-32 h-40 object-cover rounded" />
                </div>
              ) : (
                <div key={key} className="w-32 h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-xs rounded">No Image</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 flex-wrap">
        <button onClick={() => handleStatus("approved")} className="px-3 py-1 bg-green-500 text-white rounded">Approve</button>
        <button onClick={() => handleStatus("rejected")} className="px-3 py-1 bg-yellow-500 text-white rounded">Reject</button>
        <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
      </div>
    </div>
  );
}
