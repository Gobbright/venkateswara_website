import dotenv from "dotenv";
import app from "../app/app.js";
import connectDB from "../config/db.js";
import { seedAdminUsers } from "../seed/auth/adminUsers.js";
import { seedCategories } from "../seed/categories.js";
import { normalizeProducts } from "../seed/products.js";
import { normalizeUsers } from "../seed/users.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedAdminUsers();
  await seedCategories();
  await normalizeProducts();
  await normalizeUsers();

  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});
