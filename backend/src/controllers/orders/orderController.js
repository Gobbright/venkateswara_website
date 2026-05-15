import asyncHandler from "../../middleware/asyncHandler.js";
import Order from "../../models/orders/Order.js";
import mongoose from "mongoose";
import { sendOrderBillMail, sendOrderConfirmationMail, sendOrderStatusMail } from "../../utils/mail/mailer.js";

const createOrderCode = async () => {
  const orders = await Order.find({ orderCode: /^SVFS-/ }).select("orderCode");
  const maxNumber = orders.reduce((max, order) => {
    const value = Number(order.orderCode?.replace(/\D/g, "") || 0);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return `SVFS-${String(maxNumber + 1).padStart(5, "0")}`;
};

export const getOrders = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.userId) {
    filter.userId = req.query.userId;
  }

  if (req.query.phone) {
    filter.phone = req.query.phone;
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const orderFilter = mongoose.isValidObjectId(req.params.id)
    ? { $or: [{ _id: req.params.id }, { orderCode: req.params.id }] }
    : { orderCode: req.params.id };
  const order = await Order.findOne(orderFilter).lean();

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ success: true, data: order });
});

export const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create({
    ...req.body,
    orderCode: req.body.orderCode || (await createOrderCode()),
  });

  if (order.email && order.status === "Confirmed" && order.paymentStatus === "Verified") {
    sendOrderConfirmationMail({ to: order.email, order }).catch((error) => {
      console.error("Order confirmation mail failed:", error.message);
    });
  }

  res.status(201).json({ success: true, data: order });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const existingOrder = await Order.findById(req.params.id);

  if (!existingOrder) {
    res.status(404);
    throw new Error("Order not found");
  }

  const previousStatus = existingOrder.status;
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (order.email && req.body.status && req.body.status !== previousStatus) {
    sendOrderStatusMail({ to: order.email, order, previousStatus }).catch((error) => {
      console.error(`Order status mail failed for ${order.orderCode || order._id}:`, error.message);
    });

    if (order.status === "Delivered") {
      sendOrderBillMail({ to: order.email, order }).catch((error) => {
        console.error(`Order bill mail failed for ${order.orderCode || order._id}:`, error.message);
      });
    }
  }

  res.json({ success: true, data: order });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ success: true, data: order });
});
