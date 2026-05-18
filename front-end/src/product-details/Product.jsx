import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Heart, ImagePlus, Minus, Plus, Send, ShoppingCart } from "lucide-react";
import { apiRequest, assetUrl, authorizedRequest } from "../utils/api";
import { loadShopItems, toggleShopItem } from "../utils/shopItems";
import { getStoredUser } from "../utils/userSession";

const MAX_REVIEW_IMAGE_SIZE = 5 * 1024 * 1024;

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
    return { name: user?.name || "", email: user?.email || "", phone: user?.phone || "", address: "" };
  });
  const [message, setMessage] = useState("Loading product...");
  const [isOrdering, setIsOrdering] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState(() => ({
    name: getStoredUser()?.name || "",
    comment: "",
    image: "",
  }));
  const [reviewImageName, setReviewImageName] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [isReviewSaving, setIsReviewSaving] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const result = await apiRequest(`/products/${id}`);
        setProduct(result.data);
        setReviews(result.data.reviews || []);
        setSelectedSize((result.data.size || "M").split(",")[0].trim() || "M");
        const user = getStoredUser();
        if (user) {
          setReviewForm((current) => ({ ...current, name: user.name || current.name }));
          const [cartResult, wishlistResult] = await Promise.all([
            loadShopItems("cart", user),
            loadShopItems("wishlist", user),
          ]);
          setWishlisted(wishlistResult.some((item) => item.slug === result.data._id));
          setAddedToCart(cartResult.some((item) => item.slug === result.data._id));
        }
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

  const handleCart = async () => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    const item = toShopItem(product, quantity, selectedSize);
    const currentItems = await loadShopItems("cart", user);
    const result = await toggleShopItem("cart", item, currentItems, user);
    setAddedToCart(result.isAdded);
  };

  const handleWishlist = async () => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    const item = toShopItem(product, quantity, selectedSize);
    const currentItems = await loadShopItems("wishlist", user);
    const result = await toggleShopItem("wishlist", item, currentItems, user);
    setWishlisted(result.isAdded);
  };

  const placeOrder = async () => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setMessage("Enter your name, email, phone, and address to place the order.");
      return;
    }

    const now = new Date();
    setIsOrdering(true);
    setMessage("");

    try {
      navigate("/payment", {
        state: {
          source: "product",
          checkout: {
            userId: user.id,
            email: customer.email.trim(),
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
          },
          returnTo: location.pathname,
        },
      });
    } catch (error) {
      setMessage(error.message || "Payment page open failed.");
    } finally {
      setIsOrdering(false);
    }
  };

  const handleReviewImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setReviewForm((current) => ({ ...current, image: "" }));
      setReviewImageName("");
      return;
    }

    if (file.size > MAX_REVIEW_IMAGE_SIZE) {
      setReviewForm((current) => ({ ...current, image: "" }));
      setReviewImageName("");
      setReviewMessage("Review image size must be under 5MB.");
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setReviewMessage("Please choose a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReviewForm((current) => ({ ...current, image: String(reader.result || "") }));
      setReviewImageName(file.name);
      setReviewMessage("");
    };
    reader.readAsDataURL(file);
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewMessage("");
    const user = getStoredUser();

    if (!user) {
      setReviewMessage("Login required to post a review.");
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewMessage("Comment is required.");
      return;
    }

    setIsReviewSaving(true);

    try {
      const result = await authorizedRequest(`/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          comment: reviewForm.comment.trim(),
          image: reviewForm.image,
        }),
      });
      setReviews(result.data || []);
      setReviewForm((current) => ({ ...current, comment: "", image: "" }));
      setReviewImageName("");
      setReviewMessage("Review added successfully.");
    } catch (error) {
      setReviewMessage(error.message || "Review save failed.");
    } finally {
      setIsReviewSaving(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-transparent p-6">
        <p className="rounded-3xl bg-white p-8 text-center text-sm font-bold text-slate-600 shadow-sm">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-3 sm:p-4 md:p-6">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-semibold md:text-4xl">Product Details</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">{productCode}</p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_500px]">
        <div className="grid gap-5 lg:self-start">
          <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl bg-white p-4 shadow-sm sm:min-h-[420px] sm:p-6">
            {product.image ? (
              <img
                src={assetUrl(product.image)}
                alt={product.name}
                decoding="async"
                className="h-full max-h-[580px] w-full max-w-[680px] object-contain"
              />
            ) : (
              <span className="text-sm font-bold text-slate-400">No Image</span>
            )}
          </div>

          <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-950">Reviews & Comments</h3>
                <p className="text-sm font-semibold text-gray-500">{reviews.length} customer comments</p>
              </div>
            </div>

            <form onSubmit={submitReview} className="mt-5 grid gap-3 rounded-2xl bg-[#fffaf3] p-4">
              <div className="grid gap-3 sm:grid-cols-[220px_minmax(0,1fr)]">
                <input
                  value={getStoredUser()?.name || reviewForm.name}
                  readOnly
                  className="h-11 rounded-full bg-white px-4 text-sm font-semibold text-slate-600 outline-none ring-1 ring-black/10"
                  placeholder="Login to post"
                />
                <textarea
                  value={reviewForm.comment}
                  onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                  className="min-h-24 rounded-2xl bg-white px-4 py-3 text-sm font-semibold outline-none ring-1 ring-black/10 focus:ring-orange-300"
                  placeholder="Write your comment"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-4 text-sm font-bold text-gray-900 transition hover:border-orange-500 hover:text-orange-600">
                  <ImagePlus size={18} />
                  {reviewImageName || "Upload image optional"}
                  <input type="file" accept="image/*" onChange={handleReviewImage} className="sr-only" />
                </label>
                <button
                  type="submit"
                  disabled={isReviewSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-orange-600 px-5 text-sm font-bold text-white transition hover:bg-[#4DA7AF] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send size={17} />
                  {isReviewSaving ? "Saving..." : "Post Review"}
                </button>
              </div>

              {reviewForm.image && (
                <img src={reviewForm.image} alt="Review preview" className="h-24 w-24 rounded-2xl object-cover ring-1 ring-orange-100" />
              )}

              {reviewMessage && (
                <p className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-orange-700">
                  {reviewMessage}
                </p>
              )}
            </form>

            <div className="mt-5 grid gap-3">
              {reviews.length ? (
                reviews.map((review) => (
                  <article key={review._id || `${review.name}-${review.createdAt}`} className="grid gap-3 rounded-2xl border border-orange-100 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_120px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-bold text-gray-950">{review.name}</p>
                        {review.createdAt && (
                          <span className="text-xs font-semibold text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-gray-700">{review.comment}</p>
                    </div>
                    {review.image && (
                      <img
                        src={assetUrl(review.image)}
                        alt={`${review.name} review`}
                        className="h-28 w-full rounded-2xl object-cover sm:h-24"
                      />
                    )}
                  </article>
                ))
              ) : (
                <p className="rounded-2xl bg-orange-50 px-4 py-5 text-center text-sm font-bold text-orange-700">
                  No reviews yet. Add the first comment.
                </p>
              )}
            </div>
          </section>
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
            {product.description || "This product was added from the admin inventory. Orders will be saved in the admin order list."}
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
              type="email"
              value={customer.email}
              onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))}
              className="h-11 rounded-full bg-white px-4 text-sm font-semibold outline-none ring-1 ring-black/10 focus:ring-orange-300"
              placeholder="Email address"
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

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
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
              className="group relative flex h-12 items-center justify-center overflow-hidden rounded-full bg-black px-5 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="transition duration-200 group-hover:-translate-y-8 group-hover:opacity-0">
                {isOrdering ? "Verifying..." : "Buy Now"}
              </span>
              <span className="absolute translate-y-8 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                Verify Payment
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
