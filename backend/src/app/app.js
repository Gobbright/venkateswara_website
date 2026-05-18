import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import healthRoutes from "../routes/health/healthRoutes.js";
import authRoutes from "../routes/auth/authRoutes.js";
import categoryRoutes from "../routes/categories/categoryRoutes.js";
import enquiryRoutes from "../routes/enquiries/enquiryRoutes.js";
import orderRoutes from "../routes/orders/orderRoutes.js";
import paymentRoutes from "../routes/payments/paymentRoutes.js";
import productRoutes from "../routes/products/productRoutes.js";
import shopItemRoutes from "../routes/shop-items/shopItemRoutes.js";
import videoCallRoutes from "../routes/video-calls/videoCallRoutes.js";
import { notFound, errorHandler } from "../middleware/errorMiddleware.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, "../../uploads");
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const isAllowedDevOrigin = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1):517\d$/.test(origin);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || isAllowedDevOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsPath));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shop-items", shopItemRoutes);
app.use("/api/video-calls", videoCallRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
