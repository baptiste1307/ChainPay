/**
 * Express Application Configuration
 *
 * Configures middleware, static GUI serving, CORS, and API routing.
 */

const express = require("express");
const path = require("path");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Security & Parsing Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend assets (Dashboard & Web3 interface)
app.use(express.static(path.join(__dirname, "..", "public")));

// Primary API Namespace
app.use("/api", paymentRoutes);

// Backward compatibility: mount legacy root endpoints directly
app.use("/", paymentRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("[ChainPay Server Error]", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error occurred.",
  });
});

module.exports = app;
