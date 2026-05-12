import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || process.env.MONGO_URI || "svfs-local-secret";

export const createToken = (payload) => {
  return jwt.sign(payload, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
  } catch {
    return null;
  }
};
