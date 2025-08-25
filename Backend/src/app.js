const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const registrationRoutes = require("./routes/registration");
const requireAdmin = require("./auth/requireAdmin");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

// Public submit
app.use("/api/auth", authRoutes);
app.post("/api/registrations", registrationRoutes);

// Admin protected
app.get("/api/registrations", requireAdmin, registrationRoutes);
app.get("/api/registrations/:id", requireAdmin, registrationRoutes);
app.patch("/api/registrations/:id/status", requireAdmin, registrationRoutes);
app.delete("/api/registrations/:id", requireAdmin, registrationRoutes);

module.exports = app;
