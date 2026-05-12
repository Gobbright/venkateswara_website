import { setShopNotificationCount } from "./shopNotifications";

const itemKeys = {
  cart: "svfs-cart-items",
  wishlist: "svfs-wishlist-items",
};

export const getShopItems = (type) => {
  const key = itemKeys[type];

  if (!key || typeof window === "undefined") {
    return [];
  }

  try {
    const items = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

export const saveShopItems = (type, items) => {
  const key = itemKeys[type];

  if (!key || typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(items));
  setShopNotificationCount(type, items.length);
  window.dispatchEvent(
    new CustomEvent("shop-items-change", {
      detail: { type, items },
    })
  );
};

export const toggleShopItem = (type, item) => {
  const currentItems = getShopItems(type);
  const isAdded = currentItems.some((currentItem) => currentItem.slug === item.slug);
  const nextItems = isAdded
    ? currentItems.filter((currentItem) => currentItem.slug !== item.slug)
    : [{ quantity: 1, size: "M", color: "Default", ...item }, ...currentItems];

  saveShopItems(type, nextItems);
  return !isAdded;
};

export const removeShopItem = (type, slug) => {
  const nextItems = getShopItems(type).filter((item) => item.slug !== slug);
  saveShopItems(type, nextItems);
};
