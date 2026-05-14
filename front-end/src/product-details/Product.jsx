import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { apiRequest } from "../utils/api";
import { getShopItems, toggleShopItem } from "../utils/shopItems";
import { saveCompletedOrder } from "../utils/orderTracking";
import { getStoredUser } from "../utils/userSession";

const toShopItem = (product, quantity, size) => ({
  id: product._id,
  productId: product._id,
  slug: product._id,
  name: product.name,
  category: product.category,
  subcategory: product.subcategory,
  image: product.image,
  price: Number(product.price || 0),
  oldPrice: Number(product.originalPrice || product.price || 0),
  quantity,
  size,
  color: "Default",
  productCode: product.productCode,
});

export default function Product() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [customer, setCustomer] = useState(() => {
    const user = getStoredUser();
    return { name: user?.name || "", phone: user?.phone || "", address: "" };
  });
  const [message, setMessage] = useState("Loading product...");
  const [isOrdering, setIsOrdering] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const result = await apiRequest(`/products/${id}`);
        setProduct(result.data);
        setSelectedSize((result.data.size || "M").split(",")[0].trim() || "M");
        setWishlisted(getShopItems("wishlist").some((item) => item.slug === result.data._id));
        setAddedToCart(getShopItems("cart").some((item) => item.slug === result.data._id));
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Product load failed.");
      }
    };

    loadProduct();
  }, [id]);

  const sizes = useMemo(() => {
    const values = (product?.size || "M").split(",").map((size) => size.trim()).filter(Boolean);
    return values.length ? values : ["M"];
  }, [product]);

  const productCode = product
    ? product.productCode || `PRD-${String(product._id).slice(-5).toUpperCase()}`
    : "";
  const discount = product
    ? Number(product.discount || 0)
    : 0;
  const amount = product ? Number(product.price || 0) * quantity : 0;

  const handleCart = () => {
    if (!getStoredUser()) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    const item = toShopItem(product, quantity, selectedSize);
    setAddedToCart(toggleShopItem("cart", item));
  };

  const handleWishlist = () => {
    if (!getStoredUser()) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    const item = toShopItem(product, quantity, selectedSize);
    setWishlisted(toggleShopItem("wishlist", item));
  };

  const placeOrder = async () => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setMessage("Order panna name, phone, address fill pannunga.");
      return;
    }

    const now = new Date();
    setIsOrdering(true);
    setMessage("");

    try {
      const result = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          customer: customer.name.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
          category: product.category,
          product: `${product.name} (${productCode}) x ${quantity}`,
          items: [toShopItem(product, quantity, selectedSize)],
          amount,
          date: now.toISOString().slice(0, 10),
          time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          status: "Confirmed",
          paymentStatus: "Verified",
          paymentMethod: "Online",
        }),
      });
      saveCompletedOrder(result.data, user);
      setCustomer({ name: "", phone: "", address: "" });
      navigate(`/order/completed/${result.data._id}`, { state: { order: result.data } });
    } catch (error) {
      setMessage(error.message || "Order save failed.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5ede3] p-6">
        <p className="rounded-3xl bg-white p-8 text-center text-sm font-bold text-slate-600 shadow-sm">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ede3] p-3 sm:p-4 md:p-6">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-semibold md:text-4xl">Product Details</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">{productCode}</p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_500px]">
        <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl bg-white p-6 shadow-sm lg:self-start">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              decoding="async"
              className="h-full max-h-[580px] w-full max-w-[680px] object-contain"
            />
          ) : (
            <span className="text-sm font-bold text-slate-400">No Image</span>
          )}
        </div>

        <div className="rounded-3xl bg-[#fffaf3] p-6 shadow-sm lg:self-start">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-orange-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              {product.category} / {product.subcategory || "General"}
            </span>
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={`Add ${product.name} to wishlist`}
              className={`wishlist-button flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white shadow-md transition hover:text-orange-600 ${
                wishlisted ? "wishlist-button-active text-red-500" : "text-gray-900"
              }`}
            >
              <Heart size={24} className={wishlisted ? "fill-current" : ""} />
            </button>
          </div>

          <h2 className="mt-6 text-3xl font-semibold leading-tight text-gray-950">
            {product.name}
          </h2>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold text-[#39aeb7]">
              Rs. {Number(product.price).toLocaleString("en-IN")}
            </span>
            {Number(product.originalPrice || 0) > Number(product.price || 0) && (
              <span className="text-lg text-gray-500 line-through">
                Rs. {Number(product.originalPrice).toLocaleString("en-IN")}
              </span>
            )}
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {discount}% off
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-950">Select Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((size) => (
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
            {product.description || "Admin DB la added product. Order panna admin orders la save aagum."}
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

          <div className="mt-6 grid gap-3">
            <input
              value={customer.name}
              onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))}
              className="h-11 rounded-full bg-white px-4 text-sm font-semibold outline-none ring-1 ring-black/10 focus:ring-orange-300"
              placeholder="Customer name"
            />
            <input
              value={customer.phone}
              onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))}
              className="h-11 rounded-full bg-white px-4 text-sm font-semibold outline-none ring-1 ring-black/10 focus:ring-orange-300"
              placeholder="Phone number"
            />
            <textarea
              value={customer.address}
              onChange={(event) => setCustomer((current) => ({ ...current, address: event.target.value }))}
              className="min-h-20 rounded-2xl bg-white px-4 py-3 text-sm font-semibold outline-none ring-1 ring-black/10 focus:ring-orange-300"
              placeholder="Delivery address"
            />
          </div>

          {message && (
            <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
              {message}
            </p>
          )}

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCart}
              className={`flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-base font-semibold transition ${
                addedToCart
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-black/20 bg-white text-gray-900 hover:border-black hover:bg-gray-50"
              }`}
            >
              <ShoppingCart size={18} />
              {addedToCart ? "Added" : "Add Cart"}
            </button>
            <button
              type="button"
              onClick={placeOrder}
              disabled={isOrdering}
              className="flex h-12 items-center justify-center rounded-full bg-black px-5 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isOrdering ? "Verifying..." : "Verify Payment & Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
