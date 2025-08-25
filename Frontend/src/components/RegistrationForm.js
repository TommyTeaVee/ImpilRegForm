import React, { useState } from "react"
import {  motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { registerModel } from "../api" // axios API wrapper

const steps = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
]

export default function TalentApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    height: "",
    chest: "",
    waist: "",
    hips: "",
    shoe: "",
    hair: "",
    eyes: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    bio: "",
    pictures: {
      headshots: [
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      ],
      closeups: [
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      ],
      fullbody: [
        "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
        "https://images.pexels.com/photos/1918030/pexels-photo-1918030.jpeg",
        "https://images.pexels.com/photos/936119/pexels-photo-936119.jpeg",
      ],
      jeans: [
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
        "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
        "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      ],
      sportswear: [
        "https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg",
        "https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg",
        "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg",
      ],
    },
  })
  const [showToast, setShowToast] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const removeImage = (category, index) => {
    const updated = { ...formData.pictures }
    updated[category] = updated[category].filter((_, i) => i !== index)
    setFormData({ ...formData, pictures: updated })
  }

  const handleSubmit = async () => {
    try {
      await registerModel(formData)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (err) {
      alert("Submission failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      {/* Banner */}
      <div className="w-full max-w-4xl relative mb-6">
        <img
          src="https://images.pexels.com/photos/3789871/pexels-photo-3789871.jpeg"
          alt="banner"
          className="w-full h-40 object-cover rounded-2xl opacity-90"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl">
          <div className="w-16 h-16 bg-yellow-500 rounded-full mb-2" />
          <h1 className="text-2xl font-bold text-yellow-400">
            Impilo Talent Agency
          </h1>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex space-x-2 mb-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`px-3 py-1 rounded-full text-sm ${
              i === currentStep
                ? "bg-yellow-500 text-black"
                : i < currentStep
                ? "bg-yellow-700 text-white"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-lg rounded-2xl shadow-lg border border-yellow-500/20 p-6">
        {/* Steps */}
        {currentStep === 0 && (
          <div className="grid gap-3">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="dob"
              type="date"
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <select
              name="gender"
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        )}

        {currentStep === 1 && (
          <div className="grid gap-3">
            {["height", "chest", "waist", "hips", "shoe", "hair", "eyes"].map(
              (f) => (
                <input
                  key={f}
                  name={f}
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  onChange={handleChange}
                  className="p-3 rounded bg-black/40 border border-yellow-500/40"
                />
              )
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid gap-3">
            <input
              name="facebook"
              placeholder="Facebook URL"
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="instagram"
              placeholder="Instagram URL"
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="tiktok"
              placeholder="TikTok URL"
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
          </div>
        )}

        {currentStep === 3 && (
          <textarea
            name="bio"
            placeholder="Write your bio..."
            onChange={handleChange}
            className="w-full p-3 rounded bg-black/40 border border-yellow-500/40 min-h-[120px]"
          />
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            {Object.entries(formData.pictures).map(([category, pics]) => (
              <div key={category}>
                <h3 className="font-semibold text-yellow-400 mb-2 capitalize">
                  {category}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {pics.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        alt={category}
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(category, i)}
                        className="absolute top-1 right-1 bg-black/60 p-1 rounded-full"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h2 className="text-lg font-semibold text-yellow-400 mb-3">
              Review & Submit
            </h2>
            <pre className="text-sm bg-black/40 p-3 rounded max-h-60 overflow-y-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl"
            >
              Submit Application
            </button>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            >
              Back
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 inset-x-0 mx-auto w-fit px-6 py-3 bg-gradient-to-r from-yellow-500/90 to-yellow-600/90 text-black font-semibold rounded-xl shadow-xl border border-yellow-400/80 backdrop-blur-lg"
          >
            🎉 Application submitted successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}