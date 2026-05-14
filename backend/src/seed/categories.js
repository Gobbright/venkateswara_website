import { defaultCategories } from "../data/defaultCategories.js";
import Category from "../models/categories/Category.js";

const makeCategoryCode = (number) => `CAT-${String(number).padStart(3, "0")}`;
const makeSubcategoryCode = (number) => `SUB-${String(number).padStart(3, "0")}`;

export const seedCategories = async () => {
  const categoryCount = await Category.countDocuments();

  if (categoryCount > 0) {
    await normalizeCategories();
    return;
  }

  await Category.insertMany(
    defaultCategories.map((category, categoryIndex) => ({
      ...category,
      categoryCode: makeCategoryCode(categoryIndex + 1),
      status: 1,
      isActive: true,
      subcategories: category.subcategories.map((subcategory, subcategoryIndex) => ({
        subcategoryCode: makeSubcategoryCode(subcategoryIndex + 1),
        name: subcategory,
        status: 1,
      })),
    }))
  );
};

export const normalizeCategories = async () => {
  const categories = await Category.find().sort({ createdAt: 1 });
  let lastCategoryNumber = categories.reduce((max, category) => {
    const value = Number(category.categoryCode?.replace(/\D/g, "") || 0);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  for (const category of categories) {
    if (category.name === "Daily Deal") {
      category.status = 0;
    }

    if (!category.categoryCode) {
      lastCategoryNumber += 1;
      category.categoryCode = makeCategoryCode(lastCategoryNumber);
    }

    if (category.status === undefined || category.status === null) {
      category.status = 1;
    }

    category.isActive = Number(category.status) === 1;
    category.subcategories = (category.subcategories || []).map((subcategory, index) => {
      if (typeof subcategory === "string") {
        return {
          subcategoryCode: makeSubcategoryCode(index + 1),
          name: subcategory,
          status: 1,
        };
      }

      return {
        subcategoryCode: subcategory.subcategoryCode || makeSubcategoryCode(index + 1),
        name: subcategory.name || "",
        status: Number(subcategory.status ?? 1),
      };
    });

    await category.save();
  }
};
