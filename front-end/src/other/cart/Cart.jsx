import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { getShopItems, removeShopItem, saveShopItems } from '../../utils/shopItems';

export default function Cart() {
  const [cartItems, setCartItems] = useState(() => getShopItems("cart"));

  const updateQuantity = (slug, change) => {
    const nextItems = cartItems.map((item) =>
      item.slug === slug
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
        : item
    );
    setCartItems(nextItems);
    saveShopItems("cart", nextItems);
  };

  const handleRemove = (slug) => {
    removeShopItem("cart", slug);
    setCartItems(getShopItems("cart"));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const totalOldPrice = cartItems.reduce(
    (total, item) => total + (item.oldPrice || item.price) * (item.quantity || 1),
    0
  );
  const discount = totalOldPrice - subtotal;
  const deliveryFee = subtotal === 0 || subtotal > 999 ? 0 : 99;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#f5ede3] p-3 sm:p-4 md:p-6">
      <div className="mb-4 shrink-0 text-center">
        <h1 className="text-2xl font-semibold md:text-4xl">Cart</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">
          Review your selected styles before checkout
        </p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,760px)_520px] lg:justify-center">
        <div className="lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.slug}
                className="grid gap-3 rounded-3xl bg-[#fffaf3] p-4 shadow-sm transition hover:shadow-md sm:grid-cols-[150px_1fr]"
              >
                <div className="flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-white p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex min-w-0 flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                        {item.category}
                      </p>
                      <h2 className="mt-1 text-xl font-semibold leading-tight text-gray-950">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-gray-600">
                        Size: {item.size} | Color: {item.color}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.slug)}
                      className="shrink-0 rounded-full border border-orange-600/30 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:border-orange-600 hover:bg-orange-100"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-1">
                    <div>
                      <div className="flex items-baseline gap-2 leading-none">
                        <span className="text-xl font-bold text-[#39aeb7] sm:text-2xl">
                          Rs. {item.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          Rs. {(item.oldPrice || item.price).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm font-medium text-gray-600">
                        Item total: Rs.{" "}
                        {(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center rounded-full border border-black/20 bg-white p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, -1)}
                        className="h-9 w-9 rounded-full text-xl font-semibold text-gray-900 transition hover:bg-gray-100"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-base font-semibold text-gray-950">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, 1)}
                        className="h-9 w-9 rounded-full text-xl font-semibold text-gray-900 transition hover:bg-gray-100"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {cartItems.length === 0 && (
              <div className="rounded-3xl bg-[#fffaf3] p-8 text-center shadow-sm">
                <p className="text-lg font-semibold text-gray-950">Cart empty da.</p>
                <p className="mt-1 text-sm text-gray-600">Product add panna inga varum.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="shrink-0 rounded-3xl bg-[#fffaf3] p-6 shadow-sm lg:sticky lg:top-[150px] lg:self-start">
          <h2 className="text-2xl font-semibold text-gray-950">Price Details</h2>

          <div className="mt-4 space-y-3 text-base font-medium text-gray-700">
            <div className="flex justify-between gap-4">
              <span>Bag Total</span>
              <span>Rs. {totalOldPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between gap-4 text-green-700">
              <span>Discount</span>
              <span>- Rs. {discount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : `Rs. ${deliveryFee}`}</span>
            </div>
          </div>

          <div className="my-4 border-t border-black/10" />

          <div className="flex items-center justify-between gap-4">
            <span className="text-lg font-semibold text-gray-950">Total</span>
            <span className="text-2xl font-bold text-[#39aeb7]">
              Rs. {total.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-base font-semibold text-white transition hover:bg-orange-600"
          >
            <CreditCard size={18} />
            Checkout
          </button>
          <Link
            to="/mens"
            className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-black/20 bg-white px-5 text-base font-semibold text-gray-900 transition !no-underline hover:border-black hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
