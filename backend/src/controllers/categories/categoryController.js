import asyncHandler from "../../middleware/asyncHandler.js";
import Category from "../../models/categories/Category.js";

const createCode = async (prefix, field, fallbackCount = 0) => {
  const rows = await Category.find({ [field]: new RegExp(`^${prefix}-`) }).select(field);
  const maxNumber = rows.reduce((max, row) => {
    const value = Number(row[field]?.replace(/\D/g, "") || 0);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, fallbackCount);
  return `${prefix}-${String(maxNumber + 1).padStart(3, "0")}`;
};

const createSubcategoryCode = (category, index) => {
  const existingMax = (category.subcategories || []).reduce((max, subcategory) => {
    const value = Number(String(subcategory?.subcategoryCode || "").replace(/\D/g, "") || 0);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);
  return `SUB-${String(existingMax + index + 1).padStart(3, "0")}`;
};

const normalizeCategory = (categoryDocument) => {
  const category = categoryDocument.toObject ? categoryDocument.toObject() : categoryDocument;
  return {
    ...category,
    status: Number(category.status ?? 1),
    subcategories: (category.subcategories || []).map((subcategory, index) =>
      typeof subcategory === "string"
        ? {
            subcategoryCode: `SUB-${String(index + 1).padStart(3, "0")}`,
            name: subcategory,
            status: 1,
          }
        : {
            subcategoryCode: subcategory.subcategoryCode || `SUB-${String(index + 1).padStart(3, "0")}`,
            name: subcategory.name || "",
            status: Number(subcategory.status ?? 1),
          }
    ),
  };
};

export const getCategories = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status !== undefined) {
    filter.status = Number(req.query.status);
  } else {
    filter.status = 1;
  }

  const categories = await Category.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: categories.map(normalizeCategory) });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    ...req.body,
    categoryCode: req.body.categoryCode || (await createCode("CAT", "categoryCode")),
    subcategories: (req.body.subcategories || []).map((subcategory, index) => ({
      subcategoryCode: subcategory.subcategoryCode || `SUB-${String(index + 1).padStart(3, "0")}`,
      name: typeof subcategory === "string" ? subcategory : subcategory.name,
      status: Number(subcategory.status ?? 1),
    })),
    status: 1,
    isActive: true,
  });
  res.status(201).json({ success: true, data: normalizeCategory(category) });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({ success: true, data: normalizeCategory(category) });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { status: 0, isActive: false },
    { new: true }
  );

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({ success: true, data: normalizeCategory(category) });
});

export const addSubcategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const subcategoryName = req.body.name?.trim();

  if (!subcategoryName) {
    res.status(400);
    throw new Error("Subcategory name is required");
  }

  category.subcategories.push({
    subcategoryCode: req.body.subcategoryCode || createSubcategoryCode(category, 0),
    name: subcategoryName,
    status: 1,
  });
  await category.save();

  res.status(201).json({ success: true, data: normalizeCategory(category) });
});

export const updateSubcategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.subcategories = (category.subcategories || []).map((subcategory, index) => {
    const normalized =
      typeof subcategory === "string"
        ? { subcategoryCode: `SUB-${String(index + 1).padStart(3, "0")}`, name: subcategory, status: 1 }
        : subcategory;

    if (normalized.subcategoryCode !== req.params.subcategoryCode) {
      return normalized;
    }

    return {
      ...normalized,
      name: req.body.name?.trim() || normalized.name,
      status: req.body.status === undefined ? Number(normalized.status ?? 1) : Number(req.body.status),
    };
  });
  await category.save();

  res.json({ success: true, data: normalizeCategory(category) });
});

export const deleteSubcategory = asyncHandler(async (req, res) => {
  req.body.status = 0;
  return updateSubcategory(req, res);
});
