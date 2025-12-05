const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const registrationRoutes = require("./routes/registration");
const requireAdmin = require("./auth/requireAdmin");
const subscribeRoutes = require('./routes/subscriber')
const app = express();

// ALLOW YOUR FRONTEND
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:3000",   // optional if using React
];
app.use(cors({allowedOrigins  }));

app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes); // handles POST / GET / etc.
app.get('/', (req, res)=>{
    res.send("Backend Online")
})

// Admin protected routes
app.use("/api/admin/registrations", registrationRoutes);
app.use("/api", subscribeRoutes)
module.exports = app;
