import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["cart", "wishlist"],
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    item: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

shopItemSchema.index({ userId: 1, type: 1, slug: 1 }, { unique: true });

const ShopItem = mongoose.model("ShopItem", shopItemSchema);

export default ShopItem;
