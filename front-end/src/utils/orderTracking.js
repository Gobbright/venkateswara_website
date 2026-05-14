const USER_ORDERS_KEY = "svfs_user_orders";
const LAST_ORDER_KEY = "svfs_last_completed_order";

const readJson = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

export const getSavedOrders = () => {
  const orders = readJson(USER_ORDERS_KEY, []);
  return Array.isArray(orders) ? orders : [];
};

export const saveCompletedOrder = (order, user) => {
  if (typeof window === "undefined" || !order) {
    return;
  }

  const orderUserId = order.userId || user?.id || "";
  const normalizedOrder = {
    ...order,
    userId: orderUserId,
    email: order.email || user?.email || "",
    savedAt: new Date().toISOString(),
  };
  const nextOrders = [
    normalizedOrder,
    ...getSavedOrders().filter((savedOrder) => (savedOrder._id || savedOrder.orderCode) !== (order._id || order.orderCode)),
  ];

  window.localStorage.setItem(USER_ORDERS_KEY, JSON.stringify(nextOrders));
  window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(normalizedOrder));
  window.dispatchEvent(new CustomEvent("svfs-orders-change", { detail: nextOrders }));
};

export const getLastCompletedOrder = () => readJson(LAST_ORDER_KEY, null);

export const getOrdersForUser = (user) => {
  if (!user) {
    return [];
  }

  return getSavedOrders().filter((order) => order.userId === user.id || order.email === user.email);
};
