const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const registrationRoutes = require("./routes/registration");
const requireAdmin = require("./auth/requireAdmin");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes); // handles POST / GET / etc.

// Admin protected routes
app.use("/api/admin/registrations", requireAdmin, registrationRoutes);

module.exports = app;
