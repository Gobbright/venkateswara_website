import asyncHandler from "../asyncHandler.js";
import User from "../../models/auth/User.js";
import { verifyToken } from "../../utils/auth/token.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const payload = token ? verifyToken(token) : null;

  if (!payload?.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const user = await User.findById(payload.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  req.user = user;
  next();
});
