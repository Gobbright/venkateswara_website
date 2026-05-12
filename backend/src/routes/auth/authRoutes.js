import express from "express";
import { getDemoAdmins, getProfile, loginAdmin, loginUser, registerUser, updateProfile } from "../../controllers/auth/authController.js";
import { protect } from "../../middleware/auth/authMiddleware.js";

const router = express.Router();

router.get("/demo-admins", getDemoAdmins);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", loginAdmin);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

export default router;
