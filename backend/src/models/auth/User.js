import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
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
    city: {
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
    status: {
      type: String,
      enum: ["Active", "New", "Blocked", "Deleted"],
      default: "Active",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
