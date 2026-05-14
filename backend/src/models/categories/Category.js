import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    categoryCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
      default: "",
    },
    subcategories: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
