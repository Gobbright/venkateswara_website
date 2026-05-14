import {
  getAllProductModels,
  getProductModelByCategory,
  LegacyProduct,
  productCollections,
} from "../models/products/Product.js";
import mongoose from "mongoose";

const makeSlug = (name, code) =>
  `${name || "product"}-${code}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeProductData = (productData) => {
  if (productData.status === "Active") {
    productData.status = 1;
    productData.stockStatus = "Active";
    productData.isActive = true;
  }

  if (productData.status === "Low Stock") {
    productData.status = 1;
    productData.stockStatus = "Low Stock";
    productData.isActive = true;
  }

  if (productData.status === "Deleted") {
    productData.status = 0;
    productData.isActive = false;
  }

  return productData;
};

export const normalizeProducts = async () => {
  try {
    await mongoose.connection.db.dropCollection("dailydealproduct");
  } catch (error) {
    if (error.codeName !== "NamespaceNotFound") {
      console.warn("dailydealproduct cleanup skipped:", error.message);
    }
  }

  for (const { model: Product } of getAllProductModels()) {
    await Product.collection.updateMany(
      { status: "Active" },
      { $set: { status: 1, stockStatus: "Active", isActive: true } }
    );
    await Product.collection.updateMany(
      { status: "Low Stock" },
      { $set: { status: 1, stockStatus: "Low Stock", isActive: true } }
    );
    await Product.collection.updateMany(
      { status: "Deleted" },
      { $set: { status: 0, isActive: false } }
    );
  }

  const missingCodeGroups = await Promise.all(
    getAllProductModels().map(({ model: Product }) =>
      Product.find({
        $or: [
          { productCode: { $exists: false } },
          { productCode: "" },
          { slug: { $exists: false } },
          { slug: null },
          { slug: "" },
        ],
      }).sort({ createdAt: 1 })
    )
  );
  const products = missingCodeGroups.flat();

  const codedProductGroups = await Promise.all(
    getAllProductModels().map(({ model: Product }) => Product.find({ productCode: /^PRD-/ }).select("productCode"))
  );
  const codedProducts = codedProductGroups.flat();
  let lastNumber = codedProducts.reduce((max, product) => {
    const value = Number(product.productCode?.replace(/\D/g, "") || 0);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  for (const product of products) {
    if (!product.productCode) {
      lastNumber += 1;
      product.productCode = `PRD-${String(lastNumber).padStart(3, "0")}`;
    }

    if (!product.slug) {
      product.slug = makeSlug(product.name, product.productCode);
    }

    await product.save();
  }

  const legacyProducts = await LegacyProduct.find();

  for (const legacyProductItem of legacyProducts) {
    if (!productCollections[legacyProductItem.category]) {
      continue;
    }

    const Product = getProductModelByCategory(legacyProductItem.category);
    const exists = await Product.findOne({
      $or: [
        { productCode: legacyProductItem.productCode },
        { slug: legacyProductItem.slug },
      ],
    });

    if (!exists) {
      const productData = normalizeProductData(legacyProductItem.toObject());
      delete productData._id;
      delete productData.__v;
      await Product.create(productData);
    }
  }
};
