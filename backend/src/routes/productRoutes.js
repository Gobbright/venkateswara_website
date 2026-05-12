import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(getProducts).post(createProduct);
router.get("/:id", getProductById);

export default router;
