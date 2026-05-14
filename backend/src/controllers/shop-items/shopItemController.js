import asyncHandler from "../../middleware/asyncHandler.js";
import ShopItem from "../../models/shop-items/ShopItem.js";

const getUserId = (req) => req.query.userId || req.body.userId;

export const getShopItems = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    res.status(400);
    throw new Error("User ID is required");
  }

  const items = await ShopItem.find({ userId, type: req.params.type }).sort({ updatedAt: -1 }).lean();
  res.json({ success: true, data: items.map((row) => row.item) });
});

export const upsertShopItem = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const item = req.body.item;

  if (!userId || !item?.slug) {
    res.status(400);
    throw new Error("User ID and item slug are required");
  }

  const row = await ShopItem.findOneAndUpdate(
    { userId, type: req.params.type, slug: item.slug },
    { userId, type: req.params.type, slug: item.slug, item },
    { new: true, runValidators: true, upsert: true }
  );

  res.json({ success: true, data: row.item });
});

export const replaceShopItems = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (!userId) {
    res.status(400);
    throw new Error("User ID is required");
  }

  await ShopItem.deleteMany({ userId, type: req.params.type });

  if (items.length) {
    await ShopItem.insertMany(
      items.map((item) => ({
        userId,
        type: req.params.type,
        slug: item.slug,
        item,
      }))
    );
  }

  res.json({ success: true, data: items });
});

export const deleteShopItem = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    res.status(400);
    throw new Error("User ID is required");
  }

  await ShopItem.deleteOne({ userId, type: req.params.type, slug: req.params.slug });
  res.json({ success: true, data: req.params.slug });
});
