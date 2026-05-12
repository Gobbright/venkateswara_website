import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "main-admin", "orders-manager", "support-viewer"],
      default: "customer",
    },
    label: {
      type: String,
      default: "Customer",
    },
    permissions: {
      type: [String],
      default: [],
    },
    startPath: {
      type: String,
      default: "/",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
