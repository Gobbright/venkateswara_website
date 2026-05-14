import asyncHandler from "../../middleware/asyncHandler.js";
import {
  getAllProductModels,
  getProductModelByCategory,
  productCollections,
} from "../../models/products/Product.js";

const createProductCode = async () => {
  const productGroups = await Promise.all(
    getAllProductModels().map(({ model }) => model.find({ productCode: /^PRD-/ }).select("productCode"))
  );
  const products = productGroups.flat();
  const maxNumber = products.reduce((max, product) => {
    const value = Number(product.productCode?.replace(/\D/g, "") || 0);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);
  return `PRD-${String(maxNumber + 1).padStart(3, "0")}`;
};

const createProductSlug = (name, productCode) =>
  `${name || "product"}-${productCode}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getProducts = asyncHandler(async (req, res) => {
  const filter = { status: 1 };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.status !== undefined) {
    filter.status = Number(req.query.status);
  }

  const limit = Number(req.query.limit || 0);
  if (req.query.category && !productCollections[req.query.category]) {
    res.json({ success: true, data: [] });
    return;
  }

  const models = req.query.category
    ? [{ model: getProductModelByCategory(req.query.category) }]
    : getAllProductModels();

  const productGroups = await Promise.all(
    models.map(({ model }) => model.find(filter).sort({ createdAt: -1 }).lean())
  );

  const products = productGroups
    .flat()
    .sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0));

  res.json({ success: true, data: limit > 0 ? products.slice(0, limit) : products });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await findProductById(req.params.id, { status: 1 });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const productCode = req.body.productCode || (await createProductCode());
  const Product = getProductModelByCategory(req.body.category);
  const product = await Product.create({
    ...req.body,
    productCode,
    slug: req.body.slug || createProductSlug(req.body.name, productCode),
    stockStatus: Number(req.body.stock || 0) <= 10 ? "Low Stock" : "Active",
    status: 1,
    isActive: true,
  });
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const update = { ...req.body };

  if (update.stock !== undefined) {
    update.stockStatus = Number(update.stock || 0) <= 10 ? "Low Stock" : "Active";
  }

  const existingProduct = await findProductById(req.params.id);

  if (!existingProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  const currentCategory = existingProduct.category;
  const nextCategory = update.category || currentCategory;
  let product;

  if (nextCategory !== currentCategory) {
    const nextProductData = {
      ...existingProduct.toObject(),
      ...update,
      category: nextCategory,
    };
    delete nextProductData._id;
    delete nextProductData.__v;

    await existingProduct.deleteOne();
    product = await getProductModelByCategory(nextCategory).create(nextProductData);
  } else {
    product = await existingProduct.constructor.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
  }

  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const existingProduct = await findProductById(req.params.id);

  if (!existingProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  const product = await existingProduct.constructor.findByIdAndUpdate(
    req.params.id,
    { status: 0, isActive: false, deletedAt: new Date() },
    { new: true }
  );

  res.json({ success: true, data: product });
});

const findProductById = async (id, extraFilter = {}) => {
  for (const { model } of getAllProductModels()) {
    const product = await model.findOne({ _id: id, ...extraFilter });

    if (product) {
      return product;
    }
  }

  return null;
};
