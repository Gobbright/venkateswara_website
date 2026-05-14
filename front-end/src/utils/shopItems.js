import { apiRequest } from "./api";
import { setShopNotificationCount } from "./shopNotifications";
import { getStoredUser } from "./userSession";

const getUserId = (user = getStoredUser()) => user?.id || "";

const notifyItemsChange = (type, items) => {
  setShopNotificationCount(type, items.length);
  window.dispatchEvent(new CustomEvent("shop-items-change", { detail: { type, items } }));
};

export const getShopItems = () => [];

export const loadShopItems = async (type, user = getStoredUser()) => {
  const userId = getUserId(user);

  if (!userId) {
    notifyItemsChange(type, []);
    return [];
  }

  const result = await apiRequest(`/shop-items/${type}?userId=${encodeURIComponent(userId)}`);
  notifyItemsChange(type, result.data);
  return result.data;
};

export const saveShopItems = async (type, items, user = getStoredUser()) => {
  const userId = getUserId(user);

  if (!userId) {
    notifyItemsChange(type, []);
    return [];
  }

  const result = await apiRequest(`/shop-items/${type}`, {
    method: "PUT",
    body: JSON.stringify({ userId, items }),
  });
  notifyItemsChange(type, result.data);
  return result.data;
};

export const upsertShopItem = async (type, item, user = getStoredUser()) => {
  const userId = getUserId(user);

  if (!userId) {
    notifyItemsChange(type, []);
    return null;
  }

  const result = await apiRequest(`/shop-items/${type}`, {
    method: "POST",
    body: JSON.stringify({ userId, item }),
  });
  return result.data;
};

export const removeShopItem = async (type, slug, user = getStoredUser()) => {
  const userId = getUserId(user);

  if (!userId) {
    return slug;
  }

  const result = await apiRequest(`/shop-items/${type}/${encodeURIComponent(slug)}?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
  return result.data;
};

export const toggleShopItem = async (type, item, currentItems = [], user = getStoredUser()) => {
  const isAdded = currentItems.some((currentItem) => currentItem.slug === item.slug);
  const nextItems = isAdded
    ? currentItems.filter((currentItem) => currentItem.slug !== item.slug)
    : [{ quantity: 1, size: "M", color: "Default", ...item }, ...currentItems];

  await saveShopItems(type, nextItems, user);
  return { isAdded: !isAdded, items: nextItems };
};
