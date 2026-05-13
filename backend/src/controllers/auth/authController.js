import { demoAdminUsers } from "../../data/auth/demoAdminUsers.js";
import crypto from "crypto";
import asyncHandler from "../../middleware/asyncHandler.js";
import AdminUser from "../../models/auth/AdminUser.js";
import User from "../../models/auth/User.js";
import { hashPassword, verifyPassword } from "../../utils/auth/password.js";
import { createToken } from "../../utils/auth/token.js";
import { sendPasswordResetEmail } from "../../utils/mail.js";

const adminRoleMap = {
  main_admin: {
    role: "main-admin",
    label: "All access",
    permissions: ["dashboard", "orders", "category", "products", "product-add", "users", "video-calls", "enquiries"],
    startPath: "/admin/dashboard",
  },
  orders_manager: {
    role: "orders-manager",
    label: "Orders and products",
    permissions: ["orders", "products", "product-add"],
    startPath: "/admin/orders",
  },
  support_viewer: {
    role: "support-viewer",
    label: "Enquiries view",
    permissions: ["enquiries"],
    startPath: "/admin/enquiries",
  },
};

const isPasswordValid = (password, storedPassword) =>
  storedPassword.includes(":")
    ? verifyPassword(password || "", storedPassword)
    : storedPassword === password;

const adminPayload = (adminUser) => {
  const mappedRole = adminRoleMap[adminUser.role] || adminRoleMap.support_viewer;

  return {
    id: adminUser._id,
    email: adminUser.email,
    name: adminUser.name,
    phone: "",
    role: mappedRole.role,
    label: mappedRole.label,
    permissions: mappedRole.permissions,
    startPath: mappedRole.startPath,
  };
};

const authPayload = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  role: user.role,
  label: user.label,
  permissions: user.permissions,
  startPath: user.startPath,
});

const sendAuthResponse = (res, user) => {
  const payload = authPayload(user);
  res.json({
    success: true,
    token: createToken(payload),
    user: payload,
  });
};

const sendAdminAuthResponse = (res, adminUser) => {
  const payload = adminPayload(adminUser);
  res.json({
    success: true,
    token: createToken(payload),
    user: payload,
  });
};

const createTemporaryPassword = () =>
  `SVFS-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

export const getDemoAdmins = asyncHandler(async (req, res) => {
  const adminUsers = await AdminUser.find({ status: 1 }).sort({ createdAt: 1 });

  res.json({
    success: true,
    data: (adminUsers.length ? adminUsers : demoAdminUsers).map((user) => {
      const adminUser = user.toObject ? user.toObject() : user;
      const mappedRole = adminRoleMap[adminUser.role] || adminRoleMap.support_viewer;

      return {
        email: adminUser.email,
        name: adminUser.name,
        role: mappedRole.role,
        label: mappedRole.label,
        permissions: mappedRole.permissions,
        startPath: mappedRole.startPath,
      };
    }),
  });
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone = "", password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    phone,
    password: hashPassword(password),
  });

  res.status(201);
  sendAuthResponse(res, user);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.trim().toLowerCase() });

  if (!user || !isPasswordValid(password, user.password)) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  sendAuthResponse(res, user);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email: normalizedEmail, role: "customer" });

  if (!user) {
    res.status(404);
    throw new Error("Email is not registered");
  }

  const previousPassword = user.password;
  const temporaryPassword = createTemporaryPassword();

  user.password = hashPassword(temporaryPassword);
  await user.save();

  try {
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      temporaryPassword,
    });
  } catch (error) {
    user.password = previousPassword;
    await user.save();
    throw error;
  }

  res.json({
    success: true,
    message: "Temporary password sent to your registered email",
  });
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const adminUser = await AdminUser.findOne({
    email: email?.trim().toLowerCase(),
    status: 1,
  });

  if (!adminUser || !adminUser.jwtAuth || !isPasswordValid(password, adminUser.password)) {
    res.status(401);
    throw new Error("Invalid admin email or password");
  }

  sendAdminAuthResponse(res, adminUser);
});

export const getRegisteredUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "customer" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: users });
});

export const getProfile = asyncHandler(async (req, res) => {
  sendAuthResponse(res, req.user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }

  req.user.name = name;
  req.user.phone = phone || "";
  await req.user.save();

  sendAuthResponse(res, req.user);
});
