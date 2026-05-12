import { useState } from "react";
import {
  ChevronDown,
  CircleDot,
  Grid2X2,
  Package,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Star,
  Watch,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getShopItems, toggleShopItem } from "../utils/shopItems";
import shirt from "../assets/Images/Mens/Shirt/shirt.webp";
import pant from "../assets/Images/Mens/Pant/pant.jpg";
import tShirt from "../assets/Images/Mens/T-shirt/T-shirt.jpg";
import track from "../assets/Images/Mens/Track/track.jpg";
import shorts from "../assets/Images/Mens/shorts/shorts.jpg";
import accessories from "../assets/Images/Mens/Accessories/belt.jpg";

const categories = [
  { category: "Shirt", image: shirt, basePrice: 799 },
  { category: "Pant", image: pant, basePrice: 999 },
  { category: "T-Shirt", image: tShirt, basePrice: 499 },
  { category: "Track Pant", image: track, basePrice: 699 },
  { category: "Shorts", image: shorts, basePrice: 399 },
  { category: "Accessories", image: accessories, basePrice: 299 },
];

const PRODUCTS_PER_PAGE = 12;

const products = Array.from({ length: 24 }, (_, index) => {
  const item = categories[index % categories.length];

  return {
    name: `Mens ${item.category}`,
    category: item.category,
    image: item.image,
    price: item.basePrice + index * 100,
    oldPrice: item.basePrice + index * 100 + 500,
    reviews: 80 + index * 12,
    isBestseller: index < 3,
    slug: `mens-${item.category.toLowerCase().replaceAll(" ", "-")}-${index + 1}`,
  };
});

const filters = categories.map((item) => item.category);

const filterIcons = {
  Shirt,
  Pant: ShoppingBag,
  "T-Shirt": Shirt,
  "Track Pant": CircleDot,
  Shorts: Package,
  Accessories: Watch,
};

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-low-high" },
  { label: "Price: High to Low", value: "price-high-low" },
  { label: "Name: A to Z", value: "name-a-z" },
  { label: "Name: Z to A", value: "name-z-a" },
];

export default function Mens() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(() => getShopItems("wishlist").map((item) => item.slug));
  const [cartItems, setCartItems] = useState(() => getShopItems("cart").map((item) => item.slug));
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts =
    selectedFilters.length === 0
      ? products
      : products.filter((item) => selectedFilters.includes(item.category));

  const sortedProducts = [...filteredProducts].sort((first, second) => {
    if (sortBy === "price-low-high") {
      return first.price - second.price;
    }

    if (sortBy === "price-high-low") {
      return second.price - first.price;
    }

    if (sortBy === "name-a-z") {
      return (
        first.name.localeCompare(second.name) ||
        first.slug.localeCompare(second.slug)
      );
    }

    if (sortBy === "name-z-a") {
      return (
        second.name.localeCompare(first.name) ||
        second.slug.localeCompare(first.slug)
      );
    }

    return 0;
  });
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleFilterChange = (filter) => {
    setSelectedFilters((currentFilters) =>
      currentFilters.includes(filter)
        ? currentFilters.filter((item) => item !== filter)
        : [...currentFilters, filter]
    );
    setCurrentPage(1);
  };

  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ?? "Featured";

  const handleWishlistToggle = (item) => {
    const isAdded = toggleShopItem("wishlist", item);
    setWishlistItems((currentItems) =>
      isAdded ? [...currentItems, item.slug] : currentItems.filter((slug) => slug !== item.slug)
    );
  };

  const handleCartToggle = (item) => {
    const isAdded = toggleShopItem("cart", item);
    setCartItems((currentItems) =>
      isAdded ? [...currentItems, item.slug] : currentItems.filter((slug) => slug !== item.slug)
    );
  };

  return (
    <div className="min-h-screen bg-[#f5ede3] p-3 sm:p-4 md:p-6">
      <div className="mb-3 shrink-0 text-center">
        <h1 className="text-2xl font-semibold md:text-4xl">Mens Collection</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">
          Browse mens styles by category
        </p>
      </div>

      <div className="mb-4 flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
          <button
            type="button"
            onClick={() => {
              setSelectedFilters([]);
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] shadow-sm transition sm:text-sm ${
              selectedFilters.length === 0
                ? "border-orange-600 bg-gradient-to-r from-orange-600 to-[#4DA7AF] text-white"
                : "border-orange-200 bg-[#fffaf3] text-gray-800 hover:border-orange-600 hover:text-orange-700"
            }`}
          >
            <Grid2X2 size={15} />
            All
          </button>
          {filters.map((filter) => {
            const Icon = filterIcons[filter] ?? Package;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] shadow-sm transition sm:text-sm ${
                  selectedFilters.includes(filter)
                    ? "border-orange-600 bg-gradient-to-r from-orange-600 to-[#4DA7AF] text-white"
                    : "border-orange-200 bg-[#fffaf3] text-gray-800 hover:border-orange-600 hover:text-orange-700"
                }`}
              >
                <Icon size={15} />
                {filter}
              </button>
            );
          })}
        </div>

        <div className="relative flex w-full items-center justify-center gap-2 text-gray-800 sm:w-auto lg:justify-end">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-orange-700">
            Sort
          </span>
          <span className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSortOpen((current) => !current)}
              className="flex h-11 w-full items-center justify-between rounded-full border border-orange-200 bg-[#fffaf3] py-2 pl-5 pr-11 text-left text-sm font-semibold text-gray-900 shadow-sm outline-none transition hover:border-orange-500 focus:border-orange-600 focus:ring-4 focus:ring-orange-100 sm:min-w-48"
            >
              {selectedSortLabel}
            </button>
            <ChevronDown
              className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 transition ${
                sortOpen ? "rotate-180" : ""
              }`}
              size={18}
              aria-hidden="true"
            />
            {sortOpen && (
              <div className="absolute right-0 top-[52px] z-30 w-full overflow-hidden rounded-2xl border border-orange-100 bg-white/90 p-1.5 shadow-xl backdrop-blur-md sm:w-56">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortBy(option.value);
                      setCurrentPage(1);
                      setSortOpen(false);
                    }}
                    className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                      sortBy === option.value
                        ? "bg-gradient-to-r from-orange-600 to-[#4DA7AF] text-white"
                        : "text-gray-800 hover:bg-orange-50 hover:text-orange-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </span>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 content-start gap-2 sm:gap-4 md:grid-cols-4">
          {paginatedProducts.map((item) => (
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
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => handleWishlistToggle(item)}
                  aria-label={`Add ${item.name} to wishlist`}
                  className={`wishlist-button flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl leading-none shadow-md transition duration-300 hover:text-orange-600 sm:h-10 sm:w-10 sm:text-3xl ${
                    wishlistItems.includes(item.slug)
                      ? "wishlist-button-active text-red-500"
                      : "text-gray-900"
                  }`}
                >
                  {wishlistItems.includes(item.slug) ? "\u2665" : "\u2661"}
                </button>
              </div>

              <Link
                to={`/product/${item.slug}`}
                className="flex h-36 shrink-0 items-center justify-center overflow-hidden bg-white p-2 !no-underline sm:h-56 sm:p-3 md:h-60"
                aria-label={`View ${item.name}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </Link>

              <div className="flex min-h-0 flex-1 flex-col px-3 py-3 sm:px-5 sm:py-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                  <span className="flex gap-0.5 text-[#e5a43a]">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={14}
                        className="fill-[#e5a43a] text-[#e5a43a]"
                      />
                    ))}
                  </span>
                  <span className="text-gray-600">({item.reviews})</span>
                </div>
                <Link
                  to={`/product/${item.slug}`}
                  className="block !no-underline text-gray-950 hover:text-orange-600"
                >
                  <h2 className="min-h-[34px] text-sm font-semibold leading-tight sm:min-h-0 sm:text-lg">
                    {item.name}
                  </h2>
                </Link>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-base font-bold text-[#39aeb7] sm:text-xl">
                    Rs. {item.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-500 line-through sm:text-sm">
                    Rs. {item.oldPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs font-semibold text-gray-600 sm:text-sm">Size</span>
                  {["S", "M", "L", "XL"].map((size) => (
                    <span
                      key={size}
                      className="flex h-7 min-w-7 items-center justify-center rounded-full border border-black/15 bg-white px-1.5 text-[10px] font-bold text-gray-800 transition hover:border-orange-600 hover:bg-orange-600 hover:text-white sm:h-8 sm:min-w-8 sm:px-2 sm:text-xs"
                    >
                      {size}
                    </span>
                  ))}
                </div>
                <div className="mt-auto grid grid-cols-2 gap-1.5 pt-4 sm:gap-2">
                  <Link
                    to="/cart"
                    onClick={(event) => {
                      event.preventDefault();
                      handleCartToggle(item);
                    }}
                    className={`flex h-9 items-center justify-center rounded-full border px-1 text-[11px] font-bold transition !no-underline sm:h-10 sm:px-3 sm:text-sm ${
                      cartItems.includes(item.slug)
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-orange-200 bg-white text-gray-900 hover:border-orange-600 hover:text-orange-700"
                    }`}
                  >
                    <ShoppingCart size={15} />
                    {cartItems.includes(item.slug) ? "Added" : "Add Cart"}
                  </Link>
                  <Link
                    to={`/product/${item.slug}`}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-[#4DA7AF] px-1 text-[11px] font-bold text-white transition !no-underline hover:from-black hover:to-black sm:h-10 sm:px-3 sm:text-sm"
                  >
                    <ShoppingBag size={15} />
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, pageIndex) => {
              const page = pageIndex + 1;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-4 text-sm font-bold transition ${
                    currentPage === page
                      ? "border-orange-600 bg-orange-600 text-white"
                      : "border-orange-200 bg-[#fffaf3] text-gray-900 hover:border-orange-600 hover:text-orange-700"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
