import express from "express";
import {
  addProductReview,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../../controllers/products/productController.js";
import { protect } from "../../middleware/auth/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(createProduct);
router.route("/:id/reviews").post(protect, addProductReview);
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;
