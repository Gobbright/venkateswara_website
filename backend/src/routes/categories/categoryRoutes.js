import express from "express";
import {
  addSubcategory,
  createCategory,
  deleteCategory,
  deleteSubcategory,
  getCategories,
  updateCategory,
  updateSubcategory,
} from "../../controllers/categories/categoryController.js";

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
router.route("/:id").put(updateCategory).delete(deleteCategory);
router.post("/:id/subcategories", addSubcategory);
router.route("/:id/subcategories/:subcategoryCode").put(updateSubcategory).delete(deleteSubcategory);

export default router;
