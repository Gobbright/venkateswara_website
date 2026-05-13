import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/auth/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import enquiryRoutes from "./routes/Enquiry_form/enquiryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import videocallScheduleRoutes from "./routes/videocall/videocallScheduleRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/videocall-schedules", videocallScheduleRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
