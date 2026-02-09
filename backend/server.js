// server.js
// Main server file - Entry point of the application

require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./database/connectDB");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 8080;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================
app.use(
  cors({
    origin: ["http://localhost:5173"], // Frontend URL
    credentials: true, // Allow cookies
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// ============================================
// DATABASE CONNECTION
// ============================================
connectDB();

// ============================================
// ROUTES
// ============================================
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// ============================================
// HEALTH CHECK ROUTE
// ============================================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// ERROR HANDLERS
// ============================================

// 404 Handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    type: "error",
    data: null,
  });
});

// Global Error Handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`✅ Server running on PORT: ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;