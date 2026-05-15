import asyncHandler from "../../middleware/asyncHandler.js";
import Order from "../../models/orders/Order.js";
import PaymentSetting from "../../models/payments/PaymentSetting.js";
import PaymentTransaction from "../../models/payments/PaymentTransaction.js";

const createOrderCode = async () => {
  const orders = await Order.find({ orderCode: /^SVFS-/ }).select("orderCode");
  const maxNumber = orders.reduce((max, order) => {
    const value = Number(order.orderCode?.replace(/\D/g, "") || 0);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return `SVFS-${String(maxNumber + 1).padStart(5, "0")}`;
};

const getSettingDocument = async () => {
  const existingSetting = await PaymentSetting.findOne({ provider: "Razorpay" });

  if (existingSetting) {
    return existingSetting;
  }

  return PaymentSetting.create({
    provider: "Razorpay",
    mode: "Test",
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecretHint: process.env.RAZORPAY_KEY_SECRET ? "Configured in backend/.env" : "",
    isEnabled: false,
  });
};

export const getPaymentSettings = asyncHandler(async (req, res) => {
  const setting = await getSettingDocument();

  res.json({
    success: true,
    data: {
      ...setting.toObject(),
      keyId: process.env.RAZORPAY_KEY_ID || setting.keyId,
      keySecretConfigured: Boolean(process.env.RAZORPAY_KEY_SECRET || setting.keySecretHint),
    },
  });
});

export const updatePaymentSettings = asyncHandler(async (req, res) => {
  const setting = await getSettingDocument();
  const updates = {
    mode: req.body.mode || setting.mode,
    keyId: req.body.keyId?.trim() ?? setting.keyId,
    isEnabled: Boolean(req.body.isEnabled),
    notes: req.body.notes ?? setting.notes,
  };

  if (req.body.keySecretConfigured) {
    updates.keySecretHint = "Configured in backend/.env";
  }

  Object.assign(setting, updates);
  await setting.save();

  res.json({ success: true, data: setting });
});

export const getPaymentTransactions = asyncHandler(async (req, res) => {
  const transactions = await PaymentTransaction.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: transactions });
});

export const completeMockRazorpayPayment = asyncHandler(async (req, res) => {
  const checkout = req.body.checkout;

  if (!checkout || !checkout.customer || !checkout.email || !checkout.phone || !checkout.amount) {
    res.status(400);
    throw new Error("Checkout details are required to complete payment.");
  }

  const paymentId = `rzp_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const order = await Order.create({
    ...checkout,
    orderCode: checkout.orderCode || (await createOrderCode()),
    paymentMethod: "Razorpay",
    paymentStatus: "Verified",
    status: "Confirmed",
  });

  const transaction = await PaymentTransaction.create({
    provider: "Razorpay",
    mode: "Mock",
    paymentId,
    orderId: order._id,
    orderCode: order.orderCode,
    customer: order.customer,
    email: order.email,
    phone: order.phone,
    amount: order.amount,
    status: "Completed",
    method: "Razorpay Mock Button",
    rawPayload: {
      source: req.body.source || "website",
      checkout,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      order,
      transaction,
    },
  });
});
