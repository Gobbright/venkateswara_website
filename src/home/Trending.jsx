import { useState } from "react";
import { Link } from "react-router-dom";

import img1 from "../assets/Images/Trend/1.png";
import img2 from "../assets/Images/Trend/2.png";
import img3 from "../assets/Images/Trend/3.png";
import img4 from "../assets/Images/Trend/4.png";
import bgImg from "../assets/Images/bg.png";

const products = [
  {
    id: 1,
    badge: "BESTSELLER",
    name: "Mens Shirt",
    price: 1499,
    originalPrice: 2000,
    rating: 4.5,
    reviews: 128,
    path: "/product/mens-shirt",
    image: img2,
  },
  {
    id: 2,
    badge: "NEW",
    name: "Kids Wear",
    price: 1199,
    originalPrice: 2099,
    rating: 4.5,
    reviews: 128,
    path: "/product/kids-wear",
    image: img4,
  },
  {
    id: 3,
    badge: "FESTIVE",
    name: "Sharara for women",
    price: 1899,
    originalPrice: 2799,
    rating: 4.5,
    reviews: 128,
    path: "/product/sharara-women",
    image: img3,
  },
  {
    id: 4,
    badge: "PREMIUM",
    name: "Emerald Kanjivaram Saree",
    price: 5499,
    originalPrice: 7999,
    rating: 4.5,
    reviews: 128,
    path: "/product/emerald-saree",
    image: img1,
  },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => {
      const filled = star <= Math.floor(rating);
      const half = !filled && star - 0.5 <= rating;
      return (
        <svg key={star} xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24"
          fill={filled ? "#F97316" : half ? "url(#orangeHalf)" : "#FED7AA"}
        >
          <defs>
            <linearGradient id="orangeHalf">
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#FED7AA" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    })}
  </div>
);

const ProductCard = ({ product }) => {
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={product.path}
      className="block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          outline: hovered ? "2px solid #3B82F6" : "2px solid transparent",
          boxShadow: hovered ? "0 8px 24px rgba(59,130,246,0.15)" : "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div className="relative overflow-hidden rounded-t-2xl">
          <div
            className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest"
            style={{ backgroundColor: "#E8632A" }}
          >
            {product.badge}
          </div>

          <button
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow transition-all duration-200 hover:scale-110"
            onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
              fill={wished ? "#E8632A" : "none"}
              viewBox="0 0 24 24"
              stroke={wished ? "#E8632A" : "#9CA3AF"}
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <div className="h-64 bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hovered ? "scale(1.1)" : "scale(1)" }}
            />
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-1.5">
            <StarRating rating={product.rating} />
            <span className="text-gray-400 text-xs">({product.reviews})</span>
          </div>

          <p className="text-gray-900 font-semibold text-sm mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            {product.name}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: "#E8632A" }}>
              Rs. {product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-gray-400 line-through">
              Rs. {product.originalPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function Trending() {
  return (
    <section
      className="w-full py-14 px-4 md:px-10"
      style={{
        backgroundColor: "#FAF5EE",
        backgroundImage: `linear-gradient(rgba(250,245,238,0.78), rgba(250,245,238,0.78)), url(${bgImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="text-center mb-3">
        <h2 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Georgia', serif" }}>
          Trending Now
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Explore the newest additions to our collection <br />
          crafted for the who loves to stay ahead in fashion
        </p>
      </div>

      <div className="flex justify-end max-w-6xl mx-auto mb-6">
        <Link to="/mens" className="text-sm font-medium hover:underline" style={{ color: "#8B3A1A" }}>
          View all products -&gt;
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
