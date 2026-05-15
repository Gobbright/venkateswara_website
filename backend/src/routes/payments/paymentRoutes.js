import express from "express";
import {
  completeMockRazorpayPayment,
  getPaymentSettings,
  getPaymentTransactions,
  updatePaymentSettings,
} from "../../controllers/payments/paymentController.js";

const router = express.Router();

router.route("/settings").get(getPaymentSettings).put(updatePaymentSettings);
router.get("/transactions", getPaymentTransactions);
router.post("/razorpay/mock-complete", completeMockRazorpayPayment);

export default router;
