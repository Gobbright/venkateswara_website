import { products as defaultProducts, topProducts as defaultTopProducts } from "../data/adminData";

const PRODUCT_STORE_KEY = "svfs_admin_products";
const DELETED_PRODUCT_STORE_KEY = "svfs_admin_deleted_products";
const PRODUCT_CHANGE_EVENT = "svfs-admin-products-change";

export const getStoredProducts = () => {
  try {
    const savedProducts = JSON.parse(localStorage.getItem(PRODUCT_STORE_KEY) || "null");
    return Array.isArray(savedProducts) ? savedProducts : defaultProducts;
  } catch {
    return defaultProducts;
  }
};

export const saveStoredProducts = (products) => {
  localStorage.setItem(PRODUCT_STORE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event(PRODUCT_CHANGE_EVENT));
};

export const getDeletedProducts = () => {
  try {
    const savedProducts = JSON.parse(localStorage.getItem(DELETED_PRODUCT_STORE_KEY) || "null");
    return Array.isArray(savedProducts) ? savedProducts : [];
  } catch {
    return [];
  }
};

export const saveDeletedProducts = (products) => {
  localStorage.setItem(DELETED_PRODUCT_STORE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event(PRODUCT_CHANGE_EVENT));
};

export const createProductId = (products) => {
  const maxId = products.reduce((max, product) => {
    const number = Number(String(product.id).replace(/\D/g, ""));
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 108);

  return `PRD-${maxId + 1}`;
};

export const getTopProductCards = (products) => {
  const mergedProducts = products.length ? products : defaultProducts;
  const cards = mergedProducts.slice(0, 6).map(({ name, category, price, stock, image }) => ({
    name,
    category,
    price,
    stock,
    image,
  }));

  return cards.length ? cards : defaultTopProducts;
};

export const subscribeProductChanges = (callback) => {
  window.addEventListener(PRODUCT_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(PRODUCT_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};
