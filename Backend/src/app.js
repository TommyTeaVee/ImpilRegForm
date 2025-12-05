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
const cors_origin = process.env.CORS_ORIGIN
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []
app.use(cors({cors_origin}));

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
