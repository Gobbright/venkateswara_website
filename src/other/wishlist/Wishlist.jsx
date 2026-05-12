import { useState } from "react";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import { getShopItems, removeShopItem, toggleShopItem } from "../../utils/shopItems";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState(() => getShopItems("wishlist"));
  const [cartItems, setCartItems] = useState(() => getShopItems("cart").map((item) => item.slug));

  const handleRemove = (slug) => {
    removeShopItem("wishlist", slug);
    setWishlistItems(getShopItems("wishlist"));
  };

  const handleCartToggle = (item) => {
    const isAdded = toggleShopItem("cart", item);
    setCartItems((currentItems) =>
      isAdded ? [...currentItems, item.slug] : currentItems.filter((slug) => slug !== item.slug)
    );
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
                  src={item.image}
                  alt={item.name}
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
                      cartItems.includes(item.slug)
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-black/20 bg-white text-gray-900 hover:border-black hover:bg-gray-50"
                    }`}
                  >
                    <ShoppingCart size={15} />
                    {cartItems.includes(item.slug) ? "Added" : "Add Cart"}
                  </button>
                  <button
                    type="button"
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
              <p className="text-lg font-semibold text-gray-950">Wishlist empty da.</p>
              <p className="mt-1 text-sm text-gray-600">Heart click panna product inga varum.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
