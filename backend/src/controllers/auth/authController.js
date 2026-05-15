import { demoAdminUsers } from "../../data/auth/demoAdminUsers.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import AdminUser from "../../models/auth/AdminUser.js";
import AuthOtp from "../../models/auth/AuthOtp.js";
import User from "../../models/auth/User.js";
import { hashPassword, verifyPassword } from "../../utils/auth/password.js";
import { createToken } from "../../utils/auth/token.js";
import { sendOtpMail, sendWelcomeMail } from "../../utils/mail/mailer.js";

const adminRoleMap = {
  main_admin: {
    role: "main-admin",
    label: "All access",
    permissions: ["dashboard", "orders", "payments", "billing", "category", "products", "product-add", "users", "video-calls", "enquiries"],
    startPath: "/admin/dashboard",
  },
  orders_manager: {
    role: "orders-manager",
    label: "Orders, payments, billing, category, product list, product add",
    permissions: ["orders", "payments", "billing", "category", "products", "product-add"],
    startPath: "/admin/orders",
  },
  support_viewer: {
    role: "support-viewer",
    label: "Users, video calls, enquiries view",
    permissions: ["users", "video-calls", "enquiries"],
    startPath: "/admin/users",
  },
};

const isPasswordValid = (password, storedPassword) =>
  storedPassword.includes(":")
    ? verifyPassword(password || "", storedPassword)
    : storedPassword === password;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpExpiryMinutes = 10;

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const isEmailValid = (email) => emailPattern.test(normalizeEmail(email));

const createOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const getOtpRecord = ({ email, phone = "", purpose }) => {
  const query = email ? { email, purpose } : { phone, purpose };
  return AuthOtp.findOne(query).sort({ createdAt: -1 });
};

const saveOtp = async ({ email, phone = "", purpose, otp, payload = {} }) => {
  const existingRecord = await getOtpRecord({ email, phone, purpose });
  const nextSendCount = existingRecord && existingRecord.expiresAt > new Date()
    ? existingRecord.sendCount + 1
    : 1;

  if (existingRecord) {
    existingRecord.email = email;
    existingRecord.phone = phone;
    existingRecord.otpHash = hashPassword(otp);
    existingRecord.payload = payload;
    existingRecord.attempts = 0;
    existingRecord.sendCount = nextSendCount;
    existingRecord.expiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);
    return existingRecord.save();
  }

  return AuthOtp.create({
    email,
    phone,
    purpose,
    otpHash: hashPassword(otp),
    payload,
    sendCount: nextSendCount,
    expiresAt: new Date(Date.now() + otpExpiryMinutes * 60 * 1000),
  });
};

const getValidOtpRecord = async ({ email, phone = "", purpose, otp }) => {
  const record = await getOtpRecord({ email, phone, purpose });

  if (!record || record.expiresAt < new Date()) {
    return null;
  }

  if (record.attempts >= 5 || !verifyPassword(otp || "", record.otpHash)) {
    if (record) {
      record.attempts += 1;
      await record.save();
    }
    return null;
  }

  return record;
};

const createUserCode = async () => {
  const users = await User.find({ userCode: /^USR-/ }).select("userCode");
  const maxNumber = users.reduce((max, user) => {
    const value = Number(user.userCode?.replace(/\D/g, "") || 0);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);
  return `USR-${String(maxNumber + 1).padStart(3, "0")}`;
};

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
  userCode: user.userCode,
  email: user.email,
  name: user.name,
  phone: user.phone,
  city: user.city,
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
  const { name, email, phone = "", city = "", password } = req.body;

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
    userCode: await createUserCode(),
    name,
    email: normalizedEmail,
    phone,
    city,
    password: hashPassword(password),
  });

  res.status(201);
  sendAuthResponse(res, user);
});

export const requestRegisterOtp = asyncHandler(async (req, res) => {
  const { name, email, phone = "", city = "", password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!name || !normalizedEmail || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  if (!isEmailValid(normalizedEmail)) {
    res.status(400);
    throw new Error("Please enter a valid email address.");
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const otp = createOtp();
  const otpRecord = await saveOtp({
    email: normalizedEmail,
    phone,
    purpose: "register",
    otp,
    payload: {
      name: name.trim(),
      email: normalizedEmail,
      phone,
      city,
      password: hashPassword(password),
    },
  });
  await sendOtpMail({ to: normalizedEmail, name, otp, purpose: "register" });

  res.json({
    success: true,
    sendCount: otpRecord.sendCount,
    message: "OTP email sent successfully.",
  });
});

export const verifyRegisterOtp = asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  const record = await getValidOtpRecord({
    email: normalizedEmail,
    purpose: "register",
    otp: req.body.otp,
  });

  if (!record) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    await AuthOtp.deleteMany({ email: normalizedEmail, purpose: "register" });
    res.status(409);
    throw new Error("Email already registered");
  }

  const user = await User.create({
    userCode: await createUserCode(),
    name: record.payload.name,
    email: normalizedEmail,
    phone: record.payload.phone || "",
    city: record.payload.city || "",
    password: record.payload.password,
  });

  await AuthOtp.deleteMany({ email: normalizedEmail, purpose: "register" });
  sendWelcomeMail({ to: normalizedEmail, name: user.name }).catch((error) => {
    console.error("Welcome mail failed:", error.message);
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

export const requestPasswordResetOtp = asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  const phone = (req.body.phone || "").trim();

  if (!normalizedEmail && !phone) {
    res.status(400);
    throw new Error("Email or phone number required");
  }

  if (normalizedEmail && !isEmailValid(normalizedEmail)) {
    res.status(400);
    throw new Error("Please enter a valid email address.");
  }

  const user = await User.findOne(
    normalizedEmail ? { email: normalizedEmail } : { phone }
  );

  if (!user) {
    res.status(404);
    throw new Error("Account not found");
  }

  if (!isEmailValid(user.email)) {
    res.status(400);
    throw new Error("This account does not have a valid email");
  }

  const otp = createOtp();
  const otpRecord = await saveOtp({
    email: user.email,
    phone: user.phone,
    purpose: "password-reset",
    otp,
    payload: { userId: user._id.toString() },
  });
  await sendOtpMail({ to: user.email, name: user.name, otp, purpose: "password-reset" });

  res.json({
    success: true,
    email: user.email,
    sendCount: otpRecord.sendCount,
    message: "Password reset OTP sent to your email",
  });
});

export const verifyPasswordResetOtp = asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  const phone = (req.body.phone || "").trim();
  const { otp, password } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters.");
  }

  const record = await getValidOtpRecord({
    email: normalizedEmail,
    phone,
    purpose: "password-reset",
    otp,
  });

  if (!record) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  const user = await User.findById(record.payload.userId);

  if (!user) {
    res.status(404);
    throw new Error("Account not found");
  }

  user.password = hashPassword(password);
  await user.save();
  await AuthOtp.deleteMany({ email: user.email, purpose: "password-reset" });

  sendAuthResponse(res, user);
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

export const getProfile = asyncHandler(async (req, res) => {
  sendAuthResponse(res, req.user);
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ status: { $ne: "Deleted" } }).select("-password").sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: users });
});

export const updateUser = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "phone", "email", "city", "status"];
  const update = allowedFields.reduce((payload, field) => {
    if (req.body[field] !== undefined) {
      payload[field] = field === "email" ? req.body[field].trim().toLowerCase() : req.body[field];
    }

    return payload;
  }, {});

  const user = await User.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "Deleted", deletedAt: new Date() },
    { new: true }
  ).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ success: true, data: user });
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
