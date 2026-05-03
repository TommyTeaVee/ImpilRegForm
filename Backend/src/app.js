const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const registrationRoutes = require("./routes/registration");
const requireAdmin = require("./auth/requireAdmin");
const subscribeRoutes = require('./routes/subscriber')
const app = express();
app.use(express.json({limit:"500mb"}));
 app.use(express.urlencoded({ extended: true, limit: "500mb" }));
 
// ALLOW YOUR FRONTEND
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  //"http://localhost:3000",   // optional if using React
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
app.use("/api/admin/registrations", requireAdmin , registrationRoutes);
app.use("/api", requireAdmin , subscribeRoutes)
module.exports = app;
