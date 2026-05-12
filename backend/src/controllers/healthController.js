import mongoose from "mongoose";

export const getHealth = (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
};
