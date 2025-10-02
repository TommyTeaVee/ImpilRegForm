const express = require("express");
const { upload, toCDN } = require("../utils/upload");
const prisma = require("../auth/Admin");
const router = express.Router();
const { notifyModelApproved, notifyModelDissApproved, notifyNewSubmission } = require("../utils/notifications");
require('dotenv').config()
const fieldDefs = [
  { name: "profileImage", maxCount: 3 },
  { name: "fullBodyImage", maxCount: 3 },
  { name: "fullDress", maxCount: 3 },
  { name: "fullShorts", maxCount: 3 },
  { name: "fullJeans", maxCount: 3 },
  { name: "closeForward", maxCount: 3 },
  { name: "closeLeft", maxCount: 3 },
  { name: "closeRight", maxCount: 3 },
  { name: "sportswear", maxCount: 3 },
  { name: "summerwear", maxCount: 3 },
  { name: "swimwear", maxCount: 3 },
  { name: "extraImages", maxCount: 10 },
];

function validateBody(b) {
  const required = ["fullName", "email", "phone", "dob", "gender", "modelType"];
  for (const k of required) if (!b[k]) return `Missing required field: ${k}`;

  if (!["Featured", "InHouse"].includes(b.modelType))
    return "modelType must be 'Featured' or 'InHouse'";

  if (b.modelType === "InHouse") {
    if (!b.bio) return "InHouse requires bio";
    if (!b.allergiesOrSkin) return "InHouse requires allergies/skin info";
  }

  if (b.modelType === "Featured") {
    if (!b.portfolio) return "Featured model requires portfolio link";
    if (!b.agency) return "Featured model requires agency name";
  }

  return null;
}

// wrap file urls with CloudFront
const pickUrl = (files, key) => {
  const loc = files?.[key]?.[0]?.location || null;
  return loc ? toCDN(loc) : null;
};

// Create registration
router.post("/", upload.fields(fieldDefs), async (req, res) => {
  try {
    let visualArts = req.body.visualArts;
    if (!visualArts) visualArts = [];
    if (typeof visualArts === "string") visualArts = [visualArts];
    visualArts = visualArts.filter((v) => v && v.trim() !== "");

    const body = { ...req.body, visualArts };
    const err = validateBody(body);
    if (err) return res.status(400).json({ error: err });

    const extras = (req.files?.extraImages || []).map((f) => toCDN(f.location));
    
    const created = await prisma.registration.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        dob: new Date(body.dob),
        gender: body.gender,
        modelType: body.modelType,

        // Conditional fields
        bio: body.modelType === "InHouse" ? body.bio : null,
        allergiesOrSkin: body.modelType === "InHouse" ? body.allergiesOrSkin : null,
        portfolio: body.modelType === "Featured" ? body.portfolio : null,
        agency: body.modelType === "Featured" ? body.agency : null,
        visualArts: body.modelType === "InHouse" ? visualArts : [],

        height: body.height ? Number(body.height) : null,
        weight: body.weight ? Number(body.weight) : null,
        bust: body.bust ? Number(body.bust) : null,
        waist: body.waist ? Number(body.waist) : null,
        hips: body.hips ? Number(body.hips) : null,
        shoe: body.shoe || null,
        hairColor: body.hairColor || null,
        eyeColor: body.eyeColor || null,

        facebook: body.facebook || null,
        instagram: body.instagram || null,
        tiktok: body.tiktok || null,

        profileImage: pickUrl(req.files, "profileImage"),
        fullBodyImage: pickUrl(req.files, "fullBodyImage"),
        fullDress: pickUrl(req.files, "fullDress"),
        fullShorts: pickUrl(req.files, "fullShorts"),
        fullJeans: pickUrl(req.files, "fullJeans"),
        closeForward: pickUrl(req.files, "closeForward"),
        closeLeft: pickUrl(req.files, "closeLeft"),
        closeRight: pickUrl(req.files, "closeRight"),
        sportswear: pickUrl(req.files, "sportswear"),
        summerwear: pickUrl(req.files, "summerwear"),
        swimwear: pickUrl(req.files, "swimwear"),
        extraImages: extras,
        status: "pending",
      },
    });
//check if phone or email exist
const exists = prisma.registration.findFirst({

  where: {email: body.email,
        phone: body.phone,
    OR:[{bodyemail}, {phone}]
  }
})

if(exists){
  return res.status(400).json({message:" A user with this phone or email already exists"})
}
    res.status(201).json({ message: "Registration saved", registration: created });
    
    await notifyNewSubmission(newReg.email, newReg.phone, newReg.fullName);

    res.json(newReg);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// health check
router.get("/", (req, res) => res.send("Welcome, server online"));

// get all registrations
router.get("/all", async (req, res) => {
  try {
    const items = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
    console.log(items.map(r => r.id));
  } catch {
    res.status(500).json({ error: "server error" });
  }
});

// get one registration
router.get("/all/:id", async (req, res) => {
  try {
    const item = await prisma.registration.findUnique({
      where: { id: req.params.id },
    });
    if (!item) return res.status(404).json({ error: "Not Found" });
    res.json(item);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// handle status update for approved ir dissaproved
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await prisma.registration.update({
      where: { id: req.params.id },
      data: { status },
    });

    if (status === "approved") {
      const { email, phone, fullName } = updated;
      await notifyModelApproved(email, phone, fullName);
    }else if(status==="rejected"){
      const {email, phone, fullName} = updated;
      await notifyModelDissApproved(email, phone, fullName)
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// handle status update
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await prisma.registration.update({
      where: { id: req.params.id },
      data: { status },
    });

    if (status === "approved") {
      const { email, phone, fullName } = updated;
      await notifyModelApproved(email, phone, fullName);
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// delete registration
router.delete("/:id", async (req, res) => {
  try {
    await prisma.registration.delete({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
