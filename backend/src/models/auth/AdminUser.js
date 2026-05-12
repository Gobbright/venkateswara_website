import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["main_admin", "orders_manager", "support_viewer"],
      required: true,
    },
    access: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    jwtAuth: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true, collection: "adminusers" }
);

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

export default AdminUser;
