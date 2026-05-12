import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import shirt from '../assets/Images/Mens/Shirt/shirt.webp';
import { getShopItems, toggleShopItem } from "../utils/shopItems";

export default function Product() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const product = {
    slug: "classic-cotton-shirt",
    name: "Classic Cotton Shirt",
    category: "Mens",
    image: shirt,
    price: 899,
    oldPrice: 1299,
    reviews: 112,
    discount: 31,
  };
  const [wishlisted, setWishlisted] = useState(() =>
    getShopItems("wishlist").some((item) => item.slug === product.slug)
  );
  const [addedToCart, setAddedToCart] = useState(() =>
    getShopItems("cart").some((item) => item.slug === product.slug)
  );

  return (
    <div className="min-h-screen bg-[#f5ede3] p-3 sm:p-4 md:p-6">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-semibold md:text-4xl">Product Details</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">
          A closer look at your selected style
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_500px]">
        <div className="flex min-h-[520px] items-center justify-center overflow-hidden rounded-3xl bg-white p-6 shadow-sm lg:self-start">
          <img
            src={product.image}
            alt={product.name}
            className="h-full max-h-[580px] w-full max-w-[680px] object-contain"
          />
        </div>

        <div className="rounded-3xl bg-[#fffaf3] p-6 shadow-sm lg:self-start">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-orange-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              Bestseller
            </span>
            <button
              type="button"
              onClick={() => {
                setWishlisted(toggleShopItem("wishlist", product));
              }}
              aria-label={`Add ${product.name} to wishlist`}
              className={`wishlist-button flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white shadow-md transition duration-300 hover:text-orange-600 ${
                wishlisted
                  ? "wishlist-button-active text-red-500"
                  : "text-gray-900"
              }`}
            >
              <Heart size={24} className={wishlisted ? "fill-current" : ""} />
            </button>
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
            {product.category}
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-gray-950">
            {product.name}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-[#e5a43a]">
              {"\u2605\u2605\u2605\u2605\u2605"}
            </span>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold text-[#39aeb7]">
              Rs. {product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-lg text-gray-500 line-through">
              Rs. {product.oldPrice.toLocaleString("en-IN")}
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {product.discount}% off
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-950">Select Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 min-w-11 rounded-full border px-4 text-sm font-semibold transition ${
                    selectedSize === size
                      ? "border-orange-600 bg-orange-600 text-white shadow-md"
                      : "border-black/20 bg-white text-gray-900 hover:border-orange-600 hover:bg-orange-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-base leading-7 text-gray-700">
            Soft cotton fabric, clean everyday styling, and a comfortable fit
            made for regular wear. This is dummy product detail content.
          </p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-950">Quantity</p>
            <div className="mt-3 inline-flex items-center overflow-hidden rounded-full border border-orange-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="flex h-11 w-12 items-center justify-center text-gray-900 transition hover:bg-orange-50 hover:text-orange-600"
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>
              <span className="flex h-11 min-w-14 items-center justify-center border-x border-orange-100 px-4 text-base font-bold text-gray-950">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className="flex h-11 w-12 items-center justify-center text-gray-900 transition hover:bg-orange-50 hover:text-orange-600"
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setAddedToCart(toggleShopItem("cart", { ...product, quantity }));
              }}
              className={`flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-base font-semibold transition ${
                addedToCart
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-black/20 bg-white text-gray-900 hover:border-black hover:bg-gray-50"
              }`}
            >
              <ShoppingCart size={18} />
              {addedToCart ? "Added" : "Add Cart"}
            </button>
            <Link
              to="/order"
              className="flex h-12 items-center justify-center rounded-full bg-black px-5 text-base font-semibold text-white !no-underline transition hover:bg-orange-600"
            >
              Buy Now
            </Link>
          </div>

          <div className="mt-6 grid gap-3 text-sm font-medium text-gray-700">
            <div className="rounded-2xl bg-white px-4 py-3">
              Free delivery on orders above Rs. 999
            </div>
            <div className="rounded-2xl bg-white px-4 py-3">
              Easy 7 day exchange available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
