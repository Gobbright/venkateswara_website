export const productIdentifier = (product = {}) =>
  product.productCode || product.slug || product._id || product.id || "";

export const productPath = (product = {}, fallbackPath = "/categories") => {
  const identifier = productIdentifier(product);
  return identifier ? `/product/${encodeURIComponent(identifier)}` : fallbackPath;
};
