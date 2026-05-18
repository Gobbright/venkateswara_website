import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Grid2X2, ShoppingBag, ShoppingCart, Star } from "lucide-react";
import { apiRequest, assetUrl } from "../utils/api";
import { loadShopItems, toggleShopItem } from "../utils/shopItems";
import { getStoredUser } from "../utils/userSession";
import { productPath } from "../utils/productLinks";

const productKey = (product) => product._id;

const toShopItem = (product) => ({
  id: product._id,
  productId: product._id,
  slug: product._id,
  name: product.name,
  category: product.category,
  subcategory: product.subcategory,
  image: product.image,
  price: Number(product.price || 0),
  oldPrice: Number(product.originalPrice || product.price || 0),
  size: product.size || "M",
  color: "Default",
  productCode: product.productCode,
});

export default function DbProductCollection({ title = "Products", category = "" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSubcategory = new URLSearchParams(location.search).get("subcategory") || "All";
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("Loading products...");
  const [cartProducts, setCartProducts] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const query = category
          ? `/products?category=${encodeURIComponent(category)}`
          : "/products";
        const result = await apiRequest(query);
        setProducts(result.data);
        setMessage(result.data.length ? "" : "Active products added by the admin will appear here.");
      } catch (error) {
        setMessage(error.message || "Products load failed.");
      }
    };

    loadProducts();
  }, [category]);

  useEffect(() => {
    const loadUserItems = async () => {
      const user = getStoredUser();

      if (!user) {
        setCartProducts([]);
        setWishlistProducts([]);
        return;
      }

      try {
        const [cartResult, wishlistResult] = await Promise.all([
          loadShopItems("cart", user),
          loadShopItems("wishlist", user),
        ]);
        setCartProducts(cartResult);
        setWishlistProducts(wishlistResult);
      } catch (error) {
        console.error("Shop items load failed", error);
      }
    };

    loadUserItems();
  }, [location.pathname]);

  const subcategories = useMemo(
    () => [...new Set(products.map((product) => product.subcategory).filter(Boolean))],
    [products]
  );
  const visibleProducts = selectedSubcategory === "All"
    ? products
    : products.filter((product) => product.subcategory === selectedSubcategory);

  const toggleCart = async (product) => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    const item = toShopItem(product);
    const result = await toggleShopItem("cart", item, cartProducts, user);
    setCartProducts(result.items);
  };

  const toggleWishlist = async (product) => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    const item = toShopItem(product);
    const result = await toggleShopItem("wishlist", item, wishlistProducts, user);
    setWishlistProducts(result.items);
  };

  return (
    <div className="min-h-screen bg-transparent p-3 sm:p-4 md:p-6">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-semibold md:text-4xl">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">
          Showing active products from the admin inventory.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-2">
        <Link
          to={category ? location.pathname : "/categories"}
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] shadow-sm transition !no-underline sm:text-sm ${
            selectedSubcategory === "All"
              ? "border-orange-600 bg-gradient-to-r from-orange-600 to-[#4DA7AF] text-white"
              : "border-orange-200 bg-[#fffaf3] text-gray-800 hover:border-orange-600 hover:text-orange-700"
          }`}
        >
          <Grid2X2 size={15} />
          All
        </Link>
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory}
            to={`${location.pathname}?subcategory=${encodeURIComponent(subcategory)}`}
            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] shadow-sm transition !no-underline sm:text-sm ${
              selectedSubcategory === subcategory
                ? "border-orange-600 bg-orange-600 text-white"
                : "border-orange-200 bg-[#fffaf3] text-gray-800 hover:border-orange-600 hover:text-orange-700"
            }`}
          >
            {subcategory}
          </Link>
        ))}
      </div>

      {message && (
        <p className="rounded-3xl bg-[#fffaf3] p-8 text-center text-sm font-bold text-slate-600 shadow-sm">
          {message}
        </p>
      )}

      <div className="grid grid-cols-2 content-start gap-2 sm:gap-4 md:grid-cols-5">
        {visibleProducts.map((product) => {
          const id = productKey(product);
          const productCode = product.productCode || `PRD-${String(id).slice(-5).toUpperCase()}`;
          const detailsPath = productPath(product, "/categories");
          const isCartAdded = cartProducts.some((item) => item.slug === id);
          const isWishlisted = wishlistProducts.some((item) => item.slug === id);

          return (
            <div
              key={id}
              className="group flex h-full min-h-[390px] flex-col overflow-hidden rounded-2xl bg-[#fffaf3] shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-3xl"
            >
              <div className="flex h-10 shrink-0 items-center justify-between px-3 sm:h-12 sm:px-5">
                <span className="rounded-full bg-orange-600 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white sm:px-4 sm:py-2 sm:text-[10px]">
                  {productCode}
                </span>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={`Add ${product.name} to wishlist`}
                  className={`wishlist-button flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl leading-none shadow-md transition hover:text-orange-600 ${
                    isWishlisted ? "wishlist-button-active text-red-500" : "text-gray-900"
                  }`}
                >
                  {isWishlisted ? "\u2665" : "\u2661"}
                </button>
              </div>

              <Link
                to={detailsPath}
                className="flex h-36 shrink-0 items-center justify-center overflow-hidden bg-white p-2 !no-underline sm:h-52 sm:p-3"
              >
                {product.image ? (
                  <img
                    src={assetUrl(product.image)}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-sm font-bold text-slate-400">IMG</span>
                )}
              </Link>

              <div className="flex min-h-0 flex-1 flex-col px-3 py-3 sm:px-5 sm:py-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs">
                  <span className="flex gap-0.5 text-[#e5a43a]">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} size={13} className="fill-[#e5a43a] text-[#e5a43a]" />
                    ))}
                  </span>
                  <span className="text-gray-600">({product.stock})</span>
                </div>
                <Link to={detailsPath} className="block !no-underline text-gray-950 hover:text-orange-600">
                  <h2 className="min-h-[34px] text-sm font-semibold leading-tight sm:text-base">
                    {product.name}
                  </h2>
                </Link>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-orange-600">
                  {product.category} / {product.subcategory || "General"}
                </p>
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-base font-bold text-[#39aeb7]">
                    Rs. {Number(product.price || 0).toLocaleString("en-IN")}
                  </span>
                  {Number(product.originalPrice || 0) > Number(product.price || 0) && (
                    <span className="text-xs text-gray-500 line-through">
                      Rs. {Number(product.originalPrice).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs font-bold text-gray-700">Size: {product.size || "M"}</p>
                <div className="mt-auto grid grid-cols-2 gap-1.5 pt-4">
                  <button
                    type="button"
                    onClick={() => toggleCart(product)}
                    className={`flex h-9 items-center justify-center rounded-full border px-1 text-[11px] font-bold transition ${
                      isCartAdded
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-orange-200 bg-white text-gray-900 hover:border-orange-600 hover:text-orange-700"
                    }`}
                  >
                    <ShoppingCart size={15} />
                    {isCartAdded ? "Added" : "Cart"}
                  </button>
                  <Link
                    to={detailsPath}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-[#4DA7AF] px-1 text-[11px] font-bold text-white transition !no-underline hover:from-black hover:to-black"
                  >
                    <ShoppingBag size={15} />
                    Buy
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
