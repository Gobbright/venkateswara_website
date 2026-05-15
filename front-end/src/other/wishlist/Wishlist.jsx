import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import { assetUrl } from "../../utils/api";
import { loadShopItems, removeShopItem, saveShopItems, toggleShopItem } from "../../utils/shopItems";
import { getStoredUser } from "../../utils/userSession";

export default function Wishlist() {
  const location = useLocation();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      const user = getStoredUser();

      if (!user) {
        setWishlistItems([]);
        setCartItems([]);
        return;
      }

      const [wishlistResult, cartResult] = await Promise.all([
        loadShopItems("wishlist", user),
        loadShopItems("cart", user),
      ]);
      setWishlistItems(wishlistResult);
      setCartItems(cartResult);
    };

    loadWishlist();
  }, []);

  const handleRemove = async (slug) => {
    await removeShopItem("wishlist", slug);
    setWishlistItems((current) => current.filter((item) => item.slug !== slug));
  };

  const handleCartToggle = async (item) => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    const result = await toggleShopItem("cart", item, cartItems, user);
    setCartItems(result.items);
  };

  const handleBuyNow = async (item) => {
    if (!getStoredUser()) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    const nextCartItems = cartItems.some((cartItem) => cartItem.slug === item.slug)
      ? cartItems
      : [{ quantity: 1, size: "M", color: "Default", ...item }, ...cartItems];
    await saveShopItems("cart", nextCartItems);
    setCartItems(nextCartItems);
    navigate("/cart");
  };

  const handleAddAllToCart = async () => {
    if (!getStoredUser()) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    const currentSlugs = new Set(cartItems.map((item) => item.slug));
    const newItems = wishlistItems
      .filter((item) => !currentSlugs.has(item.slug))
      .map((item) => ({ quantity: 1, size: "M", color: "Default", ...item }));
    const nextCartItems = [...newItems, ...cartItems];

    await saveShopItems("cart", nextCartItems);
    setCartItems(nextCartItems);
  };

  return (
    <div className="min-h-screen bg-[#f5ede3] p-3 sm:p-4 md:p-6">
      <div className="mb-4 shrink-0 text-center">
        <h1 className="text-2xl font-semibold md:text-4xl">Wishlist</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">
          Your saved styles are ready when you are
        </p>
      </div>

      <div className="mb-4 flex shrink-0 items-center justify-between gap-3 rounded-2xl bg-[#fffaf3] px-4 py-3 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-gray-950">
            {wishlistItems.length} saved items
          </p>
          <p className="text-xs text-gray-600">Saved wishlist collection</p>
        </div>
        <button
          type="button"
          onClick={handleAddAllToCart}
          className="h-10 rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Add All Cart
        </button>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 content-start gap-2 sm:gap-4 md:grid-cols-4">
          {wishlistItems.map((item) => (
            <div
              key={item.slug}
              className="group flex h-full min-h-[405px] cursor-pointer flex-col overflow-hidden rounded-2xl bg-[#fffaf3] shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:min-h-[540px] sm:rounded-3xl"
            >
              <div className="flex h-10 shrink-0 items-center justify-between px-3 sm:h-12 sm:px-5">
                {item.isBestseller ? (
                  <span className="rounded-full bg-orange-600 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white sm:px-4 sm:py-2 sm:text-[10px] sm:tracking-[0.18em]">
                    Bestseller
                  </span>
                ) : (
                  <span className="rounded-full bg-[#f5ede3] px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-gray-700 sm:px-4 sm:py-2 sm:text-[10px] sm:tracking-[0.18em]">
                    {item.category}
                  </span>
                )}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.slug)}
                    aria-label={`Remove ${item.name} from wishlist`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600 shadow-md transition hover:text-gray-900 sm:h-10 sm:w-10"
                >
                  <Heart size={18} className="fill-current" />
                </button>
              </div>

              <div className="flex h-36 shrink-0 items-center justify-center overflow-hidden bg-white p-2 sm:h-56 sm:p-3 md:h-60">
                <img
                  src={assetUrl(item.image)}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex min-h-0 flex-1 flex-col px-3 py-3 sm:px-5 sm:py-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                  <span className="text-[#e5a43a]">
                    {"\u2605\u2605\u2605\u2605\u2605"}
                  </span>
                  <span className="text-gray-600">({item.reviews})</span>
                </div>
                <h2 className="min-h-[34px] text-sm font-semibold leading-tight text-gray-950 sm:min-h-0 sm:text-lg">
                  {item.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  {item.category}
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-base font-bold text-[#39aeb7] sm:text-xl">
                    Rs. {item.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-500 line-through sm:text-sm">
                    Rs. {item.oldPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-1.5 pt-4 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => handleCartToggle(item)}
                    className={`flex h-9 items-center justify-center gap-1.5 rounded-full border px-1 text-[11px] font-bold transition sm:h-10 sm:px-3 sm:text-sm ${
                      cartItems.some((cartItem) => cartItem.slug === item.slug)
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-black/20 bg-white text-gray-900 hover:border-black hover:bg-gray-50"
                    }`}
                  >
                    <ShoppingCart size={15} />
                    {cartItems.some((cartItem) => cartItem.slug === item.slug) ? "Added" : "Add Cart"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuyNow(item)}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-[#4DA7AF] px-1 text-[11px] font-bold text-white transition hover:from-black hover:to-black sm:h-10 sm:px-3 sm:text-sm"
                  >
                    <ShoppingBag size={15} />
                    Buy Now
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.slug)}
                  className="mt-3 h-10 w-full rounded-full border border-orange-600/30 bg-orange-50 px-3 text-sm font-semibold text-orange-700 transition hover:border-orange-600 hover:bg-orange-100"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {wishlistItems.length === 0 && (
            <div className="col-span-full rounded-3xl bg-[#fffaf3] p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-950">Your wishlist is empty.</p>
              <p className="mt-1 text-sm text-gray-600">Products you favorite will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
