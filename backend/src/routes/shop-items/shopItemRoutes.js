import express from "express";
import {
  deleteShopItem,
  getShopItems,
  replaceShopItems,
  upsertShopItem,
} from "../../controllers/shop-items/shopItemController.js";

const router = express.Router();

router.route("/:type").get(getShopItems).put(replaceShopItems).post(upsertShopItem);
router.route("/:type/:slug").delete(deleteShopItem);

export default router;
