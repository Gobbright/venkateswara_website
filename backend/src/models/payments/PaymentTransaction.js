import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      default: "Razorpay",
      trim: true,
    },
    mode: {
      type: String,
      enum: ["Mock", "Test", "Live"],
      default: "Mock",
    },
    paymentId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    orderCode: {
      type: String,
      trim: true,
      default: "",
    },
    customer: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Created", "Completed", "Failed", "Refunded"],
      default: "Created",
    },
    method: {
      type: String,
      trim: true,
      default: "Razorpay Mock",
    },
    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const PaymentTransaction =
  mongoose.models.PaymentTransaction || mongoose.model("PaymentTransaction", paymentTransactionSchema);

export default PaymentTransaction;
