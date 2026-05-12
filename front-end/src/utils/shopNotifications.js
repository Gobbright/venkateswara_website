const notificationKeys = {
  cart: "svfs-cart-count",
  wishlist: "svfs-wishlist-count",
};

export const getShopNotificationCount = (type) => {
  const key = notificationKeys[type];

  if (!key || typeof window === "undefined") {
    return 0;
  }

  return Number.parseInt(window.localStorage.getItem(key) ?? "0", 10) || 0;
};

export const setShopNotificationCount = (type, count) => {
  const key = notificationKeys[type];

  if (!key || typeof window === "undefined") {
    return;
  }

  const nextCount = Math.max(0, count);
  window.localStorage.setItem(key, String(nextCount));
  window.dispatchEvent(
    new CustomEvent("shop-notification-change", {
      detail: { type, count: nextCount },
    })
  );
};
