import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { registerModel } from "../api";

// Stepper configuration
const steps = ["Information", "Measurements", "Socials", "Pictures", "Review"];
const imageFields = [
  { name: "profileImage", label: "Profile Image", max: 1 },
  { name: "fullBodyImage", label: "Full Body Image", max: 1 },
  { name: "fullDress", label: "Full Dress / Pants", max: 3 },
  { name: "fullShorts", label: "Full Shorts", max: 3 },
  { name: "fullJeans", label: "Full Jeans", max: 3 },
  { name: "closeForward", label: "Close Forward", max: 2 },
  { name: "closeLeft", label: "Close Left", max: 2 },
  { name: "closeRight", label: "Close Right", max: 2 },
  { name: "sportswear", label: "Sportswear", max: 3 },
  { name: "summerwear", label: "Summerwear", max: 3 },
  { name: "swimwear", label: "Swimwear Trunks", max: 3 },
];

// Visual Arts options
const visualArtsOptions = [
  "Drama / Theatre",
  "Singing",
  "Dance",
  "Poetry",
  "Art",
  "Painting",
];

const sampleImages = {};
imageFields.forEach(({ name }) => (sampleImages[name] = []));

export default function TalentApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    modelType: "Featured",
    bio: "",
    allergiesOrSkin: "",
    height: "",
    weight: "",
    bust: "",
    waist: "",
    hips: "",
    shoe: "",
    hairColor: "",
    eyeColor: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    visualArts: [],
    portfolio: "",
    agency: "",
  });
  const [images, setImages] = useState(sampleImages);
  const [files, setFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Visual arts toggle
  const toggleVisualArt = (art) => {
    setFormData((prev) => {
      const selected = prev.visualArts.includes(art)
        ? prev.visualArts.filter((v) => v !== art)
        : [...prev.visualArts, art];
      return { ...prev, visualArts: selected };
    });
  };

  // Image handlers
  const replaceImage = (field, index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const newImages = { ...images };
        newImages[field][index] = url;
        setImages(newImages);

        const newFiles = { ...files };
        if (!newFiles[field]) newFiles[field] = [];
        newFiles[field][index] = file;
        setFiles(newFiles);
      }
    };
    fileInput.click();
  };

  const addImage = (field, max) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true;
    fileInput.onchange = (e) => {
      if (e.target.files.length > 0) {
        const newImages = { ...images };
        const newFiles = { ...files };
        if (!newFiles[field]) newFiles[field] = [];
        Array.from(e.target.files).forEach((file) => {
          if (newImages[field].length < max) {
            const url = URL.createObjectURL(file);
            newImages[field].push(url);
            newFiles[field].push(file);
          }
        });
        setImages(newImages);
        setFiles(newFiles);
      }
    };
    fileInput.click();
  };

  const removeImage = (field, index) => {
    const newImages = { ...images };
    newImages[field].splice(index, 1);
    setImages(newImages);

    const newFiles = { ...files };
    if (newFiles[field]) {
      newFiles[field].splice(index, 1);
      if (newFiles[field].length === 0) delete newFiles[field];
      setFiles(newFiles);
    }
  };

  const onDragEnd = (result, field) => {
    if (!result.destination) return;
    const newImages = { ...images };
    const items = Array.from(newImages[field]);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    newImages[field] = items;
    setImages(newImages);

    if (files[field]) {
      const fileItems = Array.from(files[field]);
      const [removedFile] = fileItems.splice(result.source.index, 1);
      fileItems.splice(result.destination.index, 0, removedFile);
      setFiles((prev) => ({ ...prev, [field]: fileItems }));
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item) => fd.append(key, item));
        } else if (formData[key]) {
          fd.append(key, formData[key]);
        }
      });
      Object.keys(files).forEach((field) => {
        files[field].forEach((file) => fd.append(field, file));
      });
      await registerModel(fd);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        modelType: "Featured",
        bio: "",
        allergiesOrSkin: "",
        height: "",
        weight: "",
        bust: "",
        waist: "",
        hips: "",
        shoe: "",
        hairColor: "",
        eyeColor: "",
        facebook: "",
        instagram: "",
        tiktok: "",
        visualArts: [],
        portfolio: "",
        agency: "",
      });
      setImages(sampleImages);
      setFiles({});
      setCurrentStep(0);
    } catch (err) {
      console.error(err);
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Information
        return (
          <div className="grid gap-3">
            {/* Banner */}
            <div className="w-full relative mb-6">
              <img
                src="https://impilomag.co.za/media/thando.jpg"
                alt="banner"
                className="w-full h-48 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl">
                <img
                src="https://d16o5gtkyqkgf2.cloudfront.net/assets/impilo_logo.png"
                alt="banner"
                className="w-23 h-20 avatar rounded-full "
              />
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
                  Impilo Talent Agency
                </h1>
              </div>
            </div>

            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="dob"
              type="date"
              placeholder="DOB"
              value={formData.dob}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="modelType"
              value={formData.modelType}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            >
              <option value="Featured">Featured</option>
              <option value="InHouse">InHouse</option>
            </select>

            {formData.modelType === "InHouse" ? (
              <>
                <textarea
                  name="bio"
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="p-3 rounded bg-black/40 border border-yellow-500/40"
                />
                <input
                  name="allergiesOrSkin"
                  placeholder="Allergies / Skin Info"
                  value={formData.allergiesOrSkin}
                  onChange={handleChange}
                  className="p-3 rounded bg-black/40 border border-yellow-500/40"
                />
                {/* Visual Arts */}
                
                  <label className="text-xl  items-center justify-center font-semibold text-yellow-400">Visual Arts</label>
                  <br></br><div className="grid grid-cols-2 gap-2 mt-2">
                  {visualArtsOptions.map((art) => (
                    <label
                      key={art}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.visualArts.includes(art)}
                        onChange={() => toggleVisualArt(art)}
                        className="accent-yellow-500"
                      />
                      <span className="text-yellow-400">{art}</span>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <>
                <input
                  name="portfolio"
                  placeholder="Portfolio Link"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="p-3 rounded bg-black/40 border border-yellow-500/40"
                />
                <input
                  name="agency"
                  placeholder="Agency Name"
                  value={formData.agency}
                  onChange={handleChange}
                  className="p-3 rounded bg-black/40 border border-yellow-500/40"
                />
              </>
            )}
          </div>
        );
      case 1: // Measurements
        return (
          <div className="grid gap-3">
            <input
              name="height"
              placeholder="Height (cm)"
              value={formData.height}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="weight"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="bust"
              placeholder="Bust (cm)"
              value={formData.bust}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="waist"
              placeholder="Waist (cm)"
              value={formData.waist}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="hips"
              placeholder="Hips (cm)"
              value={formData.hips}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="shoe"
              placeholder="Shoe Size"
              value={formData.shoe}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="hairColor"
              placeholder="Hair Color"
              value={formData.hairColor}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="eyeColor"
              placeholder="Eye Color"
              value={formData.eyeColor}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
          </div>
        );
      case 2: // Socials
        return (
          <div className="grid gap-3">
            <input
              name="facebook"
              placeholder="Facebook"
              value={formData.facebook}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="instagram"
              placeholder="Instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="tiktok"
              placeholder="TikTok"
              value={formData.tiktok}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
          </div>
        );
      case 3: // Pictures
        return (
          <div className="grid gap-6">
            {imageFields.map(({ name, label, max }) => (
              <section
                key={name}
                className="bg-black/30 p-4 rounded-xl border border-yellow-500/50"
              >
                <h2 className="text-yellow-400 font-semibold mb-2">{label}</h2>
                <p className="text-sm text-gray-400 mb-2">Max {max} images</p>
                <DragDropContext onDragEnd={(res) => onDragEnd(res, name)}>
                  <Droppable droppableId={name} direction="horizontal">
                    {(provided) => (
                      <div
                        className="flex gap-2 overflow-x-auto"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {images[name].map((img, index) => (
                          <Draggable
                            key={index}
                            draggableId={`${name}-${index}`}
                            index={index}
                          >
                            {(prov) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className="relative w-32 h-32 border rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => replaceImage(name, index)}
                              >
                                <img
                                  src={img}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(name, index);
                                  }}
                                  className="absolute top-1 right-1 bg-black/60 p-1 rounded-full"
                                >
                                  <X size={16} className="text-white" />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {images[name].length < max && (
                          <div
                            className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-yellow-400 rounded-lg cursor-pointer"
                            onClick={() => addImage(name, max)}
                          >
                            <span className="text-yellow-400 font-semibold">+</span>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </section>
            ))}
          </div>
        );
      case 4: // Review
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-yellow-400">
              Review Your Application
            </h2>
            <pre className="bg-black/40 p-4 rounded text-sm">
              {JSON.stringify(formData, null, 2)}
            </pre>
            <div className="grid gap-4">
              {Object.keys(images).map(
                (field) =>
                  images[field].length > 0 && (
                    <div key={field}>
                      <h3 className="font-semibold text-yellow-300">{field}</h3>
                      <div className="flex gap-2 overflow-x-auto">
                        {images[field].map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            className="w-24 h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 md:p-6">
      {/* Stepper */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {steps.map((step, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-full font-semibold ${
              i === currentStep
                ? "bg-yellow-500 text-black"
                : "bg-black/40 border border-yellow-500"
            }`}
            onClick={() => setCurrentStep(i)}
          >
            {step}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="w-full max-w-3xl mb-4">{renderStepContent()}</div>

      {/* Navigation */}
      <div className="flex gap-4">
        {currentStep > 0 && (
          <button
            className="px-6 py-2 bg-gray-700 rounded"
            onClick={() => setCurrentStep((prev) => prev - 1)}
          >
            Previous
          </button>
        )}
        {currentStep < steps.length - 1 ? (
          <button
            className="px-6 py-2 bg-yellow-500 text-black rounded"
            onClick={() => setCurrentStep((prev) => prev + 1)}
          >
            Next
          </button>
        ) : (
          <button
            className="px-6 py-2 bg-yellow-500 text-black rounded flex items-center justify-center"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
            Submit
          </button>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-yellow-500 text-black p-4 rounded shadow-lg"
          >
            Registration submitted successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
