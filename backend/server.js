import http from "http";
import dotenv from "dotenv";
import app from "./src/app/app.js";
import connectDB from "./src/config/db.js";
import { seedAdminUsers } from "./src/seed/auth/adminUsers.js";
import { seedCategories } from "./src/seed/categories.js";
import { normalizeProducts } from "./src/seed/products.js";
import { normalizeUsers } from "./src/seed/users.js";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();
  await seedAdminUsers();
  await seedCategories();
  await normalizeProducts();
  await normalizeUsers();

  server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
};

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the old backend server or change PORT in backend/.env.`);
    process.exit(1);
  }

  console.error("Backend server error:", error);
  process.exit(1);
});

startServer().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
