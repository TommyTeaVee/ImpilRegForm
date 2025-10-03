import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import axios from "axios";


const steps = [
  "Information",
  "Measurements",
  "Socials",
  "Pictures",
  "Review",
];

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
  { name: "extraImages", label: "Runway / Optional Images", max: 5 },
];

const visualArtsOptions = [
  "Drama / Theatre",
  "Singing",
  "Dance",
  "Poetry",
  "Art",
  "Painting",
];

// create empty images structure preserving each field
const makeEmptyImages = () =>
  Object.fromEntries(imageFields.map((f) => [f.name, []]));

export default function TalentApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // images[field] = [{ file: File, preview: objectURL }]
  const [images, setImages] = useState(makeEmptyImages);

  // per-file progress keyed by `${field}-${index}`, overall progress under 'overall'
  const [uploadProgress, setUploadProgress] = useState({ overall: 0 });

  // ---------- Input handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const toggleVisualArt = (art) => {
    setFormData((prev) => {
      const selected = prev.visualArts.includes(art)
        ? prev.visualArts.filter((v) => v !== art)
        : [...prev.visualArts, art];
      return { ...prev, visualArts: selected };
    });
  };

  // ---------- Image helpers ----------
  const addImage = (field, max) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const chosen = Array.from(e.target.files || []);
      if (!chosen.length) return;
      setImages((prev) => {
        const copy = { ...prev };
        const arr = copy[field] ? [...copy[field]] : [];
        for (const f of chosen) {
          if (arr.length >= max) break;
          arr.push({ file: f, preview: URL.createObjectURL(f) });
        }
        copy[field] = arr;
        return copy;
      });
    };
    input.click();
  };

  const replaceImage = (field, index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setImages((prev) => {
        const copy = { ...prev };
        const arr = [...copy[field]];
        arr[index] = { file: f, preview: URL.createObjectURL(f) };
        copy[field] = arr;
        return copy;
      });
    };
    input.click();
  };

  const removeImage = (field, index) => {
    setImages((prev) => {
      const copy = { ...prev };
      const arr = [...copy[field]];
      arr.splice(index, 1);
      copy[field] = arr;
      return copy;
    });
    setUploadProgress((prev) => {
      const copy = { ...prev };
      delete copy[`${field}-${index}`];
      return copy;
    });
  };

  const onDragEnd = (result, field) => {
    if (!result.destination) return;
    setImages((prev) => {
      const arr = Array.from(prev[field]);
      const [removed] = arr.splice(result.source.index, 1);
      arr.splice(result.destination.index, 0, removed);
      return { ...prev, [field]: arr };
    });

    // reorder uploadProgress entries for that field
    setUploadProgress((prev) => {
      const copy = { ...prev };
      const entries = [];
      imageFields.forEach((f) => {
        if (f.name === field) {
          // collect current field keys in order
          const list = (images[field] || []).map((_, idx) => `${field}-${idx}`);
          // But because images is updated asynchronously, best-effort: recreate keys
        }
      });
      // easiest approach: after reordering, we'll recompute during upload.
      return copy;
    });
  };

  // ---------- Submit with per-file progress ----------
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setUploadProgress({ overall: 0 });

    try {
      // Build FormData
      const fd = new FormData();
      // append non-file fields
      Object.keys(formData).forEach((k) => {
        const v = formData[k];
        if (Array.isArray(v)) {
          v.forEach((item) => fd.append(k, item));
        } else if (v !== undefined && v !== null && v !== "") {
          fd.append(k, v);
        }
      });

      // Build a flattened list of files with sizes so we can estimate per-file progress
      const fileList = []; // { field, index, file, size }
      imageFields.forEach(({ name }) => {
        (images[name] || []).forEach((entry, idx) => {
          if (entry?.file) {
            fd.append(name, entry.file);
            fileList.push({ field: name, index: idx, file: entry.file, size: entry.file.size });
          }
        });
      });

      const totalBytes = fileList.reduce((s, f) => s + (f.size || 0), 0) || 0;

      // If no files, fallback to a simple POST
      const url = `${process.env.REACT_APP_SERVER_URL || ""}/registrations`;

      await axios.post(url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          // progressEvent.loaded = bytes uploaded so far
          // We'll map uploaded bytes to per-file progress by rolling through fileList sizes
          const loaded = progressEvent.loaded;
          setUploadProgress((prev) => {
            const next = { ...prev };
            let remaining = loaded;
            for (let i = 0; i < fileList.length; i++) {
              const f = fileList[i];
              const prevSum = fileList.slice(0, i).reduce((s, x) => s + x.size, 0);
              const fileLoaded = Math.max(0, Math.min(remaining - prevSum, f.size));
              // compute percent for this file
              const pct = f.size ? Math.round((fileLoaded / f.size) * 100) : 100;
              next[`${f.field}-${f.index}`] = Math.max(0, Math.min(100, pct));
            }
            // overall: try to use loaded/totalBytes if totalBytes > 0 else fallback to progressEvent
            if (totalBytes > 0) {
              next.overall = Math.round(Math.min(100, (loaded / totalBytes) * 100));
            } else {
              // fallback to event total if present
              next.overall = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            }
            return next;
          });
        },
      });

      // Ensure all per-file show 100%
      setUploadProgress((prev) => {
        const done = { ...prev };
        imageFields.forEach(({ name }) => {
          (images[name] || []).forEach((_, idx) => {
            done[`${name}-${idx}`] = 100;
          });
        });
        done.overall = 100;
        return done;
      });

      // success
      await Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "Thank you — your registration has been received.",
        confirmButtonColor: "#f59e0b", // yellow-500
      });

      // reset form (optional: keep last values if you prefer)
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
      setImages(makeEmptyImages());
      setCurrentStep(steps.length - 1);
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          err?.response?.data?.message ||
          err.message ||
          "There was an error submitting your application.",
        confirmButtonColor: "#ef4444", // red
      });
    } finally {
      setIsSubmitting(false);
      // keep progress for a short time so user sees completion then clear
      setTimeout(() => setUploadProgress({ overall: 0 }), 1200);
    }
  };

  // ---------- Render step content (full UI preserved) ----------
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Information
        return (
          <div className="grid gap-3">
            <div className="w-full relative mb-6">
              <img
                src="https://impilomag.co.za/media/thando.jpg"
                alt="banner"
                className="w-full h-48 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl">
                <img
                  src="https://d16o5gtkyqkgf2.cloudfront.net/assets/impilo_logo.png"
                  alt="logo"
                  className="w-23 h-20 avatar rounded-full"
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
              placeholder="Date Of Birth"
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
                  placeholder="About yourself and or modelling journey"
                  value={formData.bio}
                  onChange={handleChange}
                  className="p-3 rounded bg-black/40 border border-yellow-500/40"
                />
                <input
                  name="allergiesOrSkin"
                  placeholder="Allergies / Skin related Issues"
                  value={formData.allergiesOrSkin}
                  onChange={handleChange}
                  className="p-3 rounded bg-black/40 border border-yellow-500/40"
                />

                <label className="text-xl items-center justify-center font-semibold text-yellow-400">
                  Visual Arts
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {visualArtsOptions.map((art) => (
                    <label key={art} className="flex items-center gap-2 cursor-pointer">
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
              placeholder="Facebook username"
              value={formData.facebook}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="instagram"
              placeholder="Instagram handle"
              value={formData.instagram}
              onChange={handleChange}
              className="p-3 rounded bg-black/40 border border-yellow-500/40"
            />
            <input
              name="tiktok"
              placeholder="TikTok username"
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
                        {images[name].map((entry, index) => (
                          <Draggable
                            key={`${name}-${index}`}
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
                                  src={entry.preview}
                                  alt={`${name}-${index}`}
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

                                {/* per-image progress bar */}
                                {uploadProgress[`${name}-${index}`] !== undefined && (
                                  <div className="absolute bottom-0 left-0 h-1 bg-green-600"
                                       style={{
                                         width: `${uploadProgress[`${name}-${index}`]}%`,
                                       }}
                                  />
                                )}

                                {/* percent label when uploading */}
                                {uploadProgress[`${name}-${index}`] !== undefined &&
                                  uploadProgress[`${name}-${index}`] < 100 && (
                                    <div className="absolute bottom-1 right-1 text-xs bg-black/60 text-green-300 px-1 rounded">
                                      {uploadProgress[`${name}-${index}`]}%
                                    </div>
                                  )}
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
                        {images[field].map((entry, i) => (
                          <img
                            key={i}
                            src={entry.preview}
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

      case 5: // Submission confirmation
        return (
          <div className="text-center p-6 bg-black/50 rounded-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              🎉 Submission Successful!
            </h2>
            <p className="mt-2 text-yellow-200">
              Thank you for applying. We will contact you soon.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // ---------- Main render ----------
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 md:p-6 relative">
      {/* Full-screen uploading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-yellow-400 w-14 h-14" />
            <div className="text-yellow-300">Uploading... {uploadProgress.overall || 0}%</div>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {steps.map((label, i) => (
          <button
            key={label}
            className={`px-4 py-2 rounded-full font-semibold ${
              i === currentStep
                ? "bg-yellow-500 text-black"
                : "bg-black/40 border border-yellow-500"
            }`}
            onClick={() => setCurrentStep(i)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="w-full max-w-3xl mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <button
            className="px-6 py-2 bg-gray-700 rounded"
            onClick={() => setCurrentStep((prev) => prev - 1)}
          >
            Previous
          </button>
        )}

        {currentStep < steps.length - 2 && (
          <button
            className="px-6 py-2 bg-yellow-500 text-black rounded"
            onClick={() => setCurrentStep((prev) => prev + 1)}
          >
            Next
          </button>
        )}

        {currentStep === steps.length - 2 && (
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
    </div>
  );
}
