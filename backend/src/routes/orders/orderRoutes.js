import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} from "../../controllers/orders/orderController.js";

const router = express.Router();

router.route("/").get(getOrders).post(createOrder);
router.route("/:id").put(updateOrder).delete(deleteOrder);

export default router;
