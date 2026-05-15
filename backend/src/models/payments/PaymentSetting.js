import mongoose from "mongoose";

const paymentSettingSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["Razorpay"],
      default: "Razorpay",
    },
    mode: {
      type: String,
      enum: ["Test", "Live"],
      default: "Test",
    },
    keyId: {
      type: String,
      trim: true,
      default: "",
    },
    keySecretHint: {
      type: String,
      trim: true,
      default: "",
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      default: "Use test mode until real Razorpay integration is connected.",
    },
  },
  { timestamps: true }
);

const PaymentSetting =
  mongoose.models.PaymentSetting || mongoose.model("PaymentSetting", paymentSettingSchema);

export default PaymentSetting;
