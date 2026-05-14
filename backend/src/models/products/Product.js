import mongoose from "mongoose";

export const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    productCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    size: {
      type: String,
      default: "",
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    hsn: {
      type: String,
      default: "",
      trim: true,
    },
    stockStatus: {
      type: String,
      default: "Active",
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const productCollections = {
  Mens: "menproduct",
  Womens: "womensproduct",
  Kids: "kidsproduct",
  Festive: "festiveproduct",
  Accessories: "accessoriesproduct",
};

export const productCategories = Object.keys(productCollections);

export const getProductModelByCategory = (category = "Mens") => {
  const normalizedCategory = productCollections[category] ? category : "Mens";
  const modelName = `${normalizedCategory.replace(/[^a-z0-9]/gi, "")}Product`;
  const collectionName = productCollections[normalizedCategory];

  return mongoose.models[modelName] || mongoose.model(modelName, productSchema, collectionName);
};

export const getAllProductModels = () =>
  productCategories.map((category) => ({
    category,
    model: getProductModelByCategory(category),
  }));

export const LegacyProduct =
  mongoose.models.LegacyProduct || mongoose.model("LegacyProduct", productSchema, "products");

const Product = getProductModelByCategory("Mens");

export default Product;
