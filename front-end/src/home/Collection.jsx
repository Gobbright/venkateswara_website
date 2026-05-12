import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { getShopItems, toggleShopItem } from "../utils/shopItems";

// Replace these with your actual image imports
import saree1 from "../assets/Images/Collection/1.png";
import shirt1 from "../assets/Images/Collection/2.png";
import pattu1 from "../assets/Images/Collection/3.png";
import saree2 from "../assets/Images/Collection/4.png";
import bgImg from "../assets/Images/bg.png";

const products = [
  {
    id: 1,
    badge: "BESTSELLER",
    badgeColor: "bg-orange-500",
    image: saree1,
    rating: 5,
    reviews: "10k",
    name: "AKHUGA Printed Saree",
    price: 999,
    originalPrice: 1099,
    path: "/product/akhuga-printed-saree",
  },
  {
    id: 2,
    badge: "NEW",
    badgeColor: "bg-orange-500",
    image: shirt1,
    rating: 5,
    reviews: "7k",
    name: "SNIPES Shirt",
    price: 1199,
    originalPrice: 2099,
    path: "/product/snipes-shirt",
  },
  {
    id: 3,
    badge: "FESTIVE",
    badgeColor: "bg-orange-500",
    image: pattu1,
    rating: 5,
    reviews: "5.5k",
    name: "Pattu Cousmized",
    price: 1699,
    originalPrice: 2000,
    path: "/product/pattu-cousmized",
  },
  {
    id: 4,
    badge: "PREMIUM",
    badgeColor: "bg-orange-500",
    image: saree2,
    rating: 5,
    reviews: "128",
    name: "Emerald Kanjivaram Saree",
    price: 2499,
    originalPrice: 3999,
    path: "/product/emerald-kanjivaram-saree",
  },
];

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(() =>
    getShopItems("cart").some((item) => item.slug === product.path)
  );
  const shopItem = {
    ...product,
    slug: product.path,
    category: "Latest Collection",
    oldPrice: product.originalPrice,
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex h-full min-h-[395px] flex-col gap-2 rounded-2xl bg-white p-3 transition-all duration-300 sm:min-h-[430px]"
      style={{
        border: hovered ? "2px solid #3b82f6" : "2px solid transparent",
        boxShadow: hovered
          ? "0 8px 30px rgba(59,130,246,0.15)"
          : "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Image Area */}
      <div className="relative overflow-hidden rounded-xl bg-white">
        <Link
          to={product.path}
          className="block !no-underline"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-contain object-top p-2 transition-transform duration-300 sm:h-56"
            style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
          />
        </Link>

        <span
          className={`absolute left-3 top-3 ${product.badgeColor} rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide text-white`}
        >
          {product.badge}
        </span>

      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col px-1 pt-1">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < product.rating
                  ? "fill-orange-400 text-orange-400"
                  : "text-gray-200"
              }
            />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">
            ({product.reviews})
          </span>
        </div>

        {/* Name */}
        <Link
          to={product.path}
          className="mb-1 min-h-[38px] text-sm font-semibold leading-tight text-gray-800 !no-underline hover:text-orange-600"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-orange-500">
            Rs. {product.price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 line-through">
            Rs. {product.originalPrice.toLocaleString()}
          </span>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setAddedToCart(toggleShopItem("cart", shopItem));
          }}
          className={`mt-auto flex h-9 w-full items-center justify-center gap-2 rounded-full border px-3 text-sm font-bold transition ${
            addedToCart
              ? "border-orange-600 bg-orange-600 text-white"
              : "border-orange-200 bg-white text-gray-900 hover:border-orange-600 hover:text-orange-700"
          }`}
        >
          <ShoppingCart size={16} />
          {addedToCart ? "Added" : "Add Cart"}
        </button>
      </div>
    </div>
  );
};

const Collection = () => {
  return (
    <div
      className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16"
      style={{
        backgroundColor: "#FAF0E6",
        backgroundImage: `linear-gradient(rgba(250,240,230,0.78), rgba(250,240,230,0.78)), url(${bgImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Latest Collection
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
          Explore the newest additions to our collection crafted for the modern
          who loves to stay ahead in fashion
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Shop More Button */}
      <div className="flex justify-center mt-10">
        <Link
          to="/categories"
          className="!no-underline bg-orange-500 text-white font-semibold text-sm px-10 py-3.5 rounded-full transition hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF] shadow-[0_4px_15px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(77,167,175,0.35)]"
        >
          Shop More
        </Link>
      </div>
    </div>
  );
};

export default Collection;
