import express from "express";
import {
  deleteUser,
  getDemoAdmins,
  getProfile,
  getUsers,
  loginAdmin,
  loginUser,
  requestPasswordResetOtp,
  requestRegisterOtp,
  verifyPasswordResetOtp,
  verifyRegisterOtp,
  updateProfile,
  updateUser,
} from "../../controllers/auth/authController.js";
import { protect } from "../../middleware/auth/authMiddleware.js";

const router = express.Router();

router.get("/demo-admins", getDemoAdmins);
router.post("/register", requestRegisterOtp);
router.post("/register/request-otp", requestRegisterOtp);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/login", loginUser);
router.post("/forgot-password/send-otp", requestPasswordResetOtp);
router.post("/forgot-password/verify-otp", verifyPasswordResetOtp);
router.post("/admin/login", loginAdmin);
router.get("/users", getUsers);
router.route("/users/:id").put(updateUser).delete(deleteUser);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

export default router;
