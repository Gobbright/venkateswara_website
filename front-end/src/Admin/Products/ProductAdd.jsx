import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ImagePlus, PackagePlus } from "lucide-react";
import { apiRequest, assetUrl } from "../../utils/api";

const emptyForm = {
  name: "",
  subcategory: "",
  price: "",
  stock: "",
  tax: "5",
  sizes: ["M"],
  discount: "",
  hsn: "",
  image: "",
};

const taxOptions = ["0", "5", "12", "18", "28"];
const sizeOptions = ["S", "M", "L", "XL", "XXL", "Free Size"];
const discountOptions = ["5", "10", "20"];
const stockOptions = ["20", "50", "100"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const calculateDiscountedPrice = (price, discount) => {
  const priceValue = Number(price || 0);
  const discountValue = Number(discount || 0);

  if (!priceValue || !discountValue) {
    return priceValue;
  }

  return Math.max(0, Math.round(priceValue - (priceValue * discountValue) / 100));
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const normalizeCategories = (items) =>
  items.map((category) => ({
    ...category,
    subcategories: (category.subcategories || [])
      .filter((subcategory) => typeof subcategory === "string" || Number(subcategory.status ?? 1) === 1)
      .map((subcategory) => (typeof subcategory === "string" ? subcategory : subcategory.name))
      .filter(Boolean),
  }));

export default function ProductAdd({ initialCategory = "Mens" }) {
  const { categoryName } = useParams();
  const imageInputRef = useRef(null);
  const routeCategory = categoryName ? decodeURIComponent(categoryName) : initialCategory;
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(routeCategory);
  const [form, setForm] = useState(emptyForm);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const selectedCategoryData = useMemo(
    () => categories.find((category) => category.name === selectedCategory) ?? { name: selectedCategory, subcategories: [] },
    [categories, selectedCategory]
  );
  const discountedPrice = calculateDiscountedPrice(form.price, form.discount);

  useEffect(() => {
    setSelectedCategory(routeCategory);
  }, [routeCategory]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await apiRequest("/categories");
        if (result.data.length) {
          setCategories(normalizeCategories(result.data));
        }
      } catch {
        setCategories([]);
        setMessage("Categories DB la load aagala.");
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      subcategory: selectedCategoryData.subcategories[0] ?? "",
    }));
  }, [selectedCategoryData]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const toggleSize = (size) => {
    setForm((current) => {
      const selectedSizes = current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size];

      return {
        ...current,
        sizes: selectedSizes.length ? selectedSizes : ["M"],
      };
    });
    setMessage("");
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedImage(null);
      updateField("image", "");
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      setMessage("Image size 5MB-kulla irukkanum.");
      return;
    }

    const image = await fileToDataUrl(file);
    setSelectedImage(file);
    updateField("image", image);
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || form.price === "" || form.stock === "") {
      setMessage("Product name, price, stock fill pannunga.");
      return;
    }

    const productPayload = {
      name: form.name.trim(),
      category: selectedCategory,
      subcategory: form.subcategory || selectedCategoryData.subcategories[0] || "",
      originalPrice: Number(form.price),
      price: discountedPrice,
      stock: Number(form.stock),
      tax: Number(form.tax),
      size: form.sizes.join(", "),
      discount: form.discount === "" ? 0 : Number(form.discount),
      hsn: form.hsn.trim(),
      image: form.image,
    };

    try {
      setIsSubmitting(true);
      setMessage("");

      const result = await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify(productPayload),
      });
      setForm({
        ...emptyForm,
        subcategory: selectedCategoryData.subcategories[0] ?? "",
      });
      setSelectedImage(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      setMessage(`${result.data.name} MongoDB la added successfully.`);
    } catch (error) {
      setMessage(error.message || "Product add panna mudiyala. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Top Product Add</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Product add page with category visual and top product display.
        </p>
      </div>

      <div className="mx-auto max-w-7xl">
        <form onSubmit={handleAddProduct} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9fbfc] text-[#23777f]">
              <PackagePlus size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-950">Add Product</h3>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid items-start gap-4 lg:grid-cols-2">
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                placeholder="Product Name"
              />
              <div>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#4DA7AF] bg-[#e9fbfc] px-3 text-xs font-extrabold text-[#23777f] transition hover:bg-white"
                >
                  {form.image ? (
                    <>
                      <img src={assetUrl(form.image)} alt="Product preview" className="h-7 w-7 rounded-lg object-cover" />
                      <span>Change Product Image</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={20} />
                      <span>Product Image Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <input
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                type="number"
                min="1"
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                placeholder="Original Price"
              />
              <div className="grid gap-2">
                <input
                  value={form.discount}
                  onChange={(event) => updateField("discount", event.target.value)}
                  type="number"
                  min="0"
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                  placeholder="%"
                />
                <div className="grid grid-cols-3 gap-2">
                  {discountOptions.map((discount) => (
                    <button
                      key={discount}
                      type="button"
                      onClick={() => updateField("discount", discount)}
                      className={`h-9 rounded-xl border text-xs font-extrabold transition ${
                        String(form.discount) === discount
                          ? "border-[#4DA7AF] bg-[#4DA7AF] text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#4DA7AF] hover:text-[#23777f]"
                      }`}
                    >
                      {discount}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex h-12 items-center justify-between rounded-2xl border border-[#4DA7AF]/20 bg-[#e9fbfc] px-4">
                <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#23777f]">Selling Price</span>
                <span className="text-lg font-extrabold text-slate-950">
                  Rs. {discountedPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
              >
                {categories.map((category) => (
                  <option key={category.name}>{category.name}</option>
                ))}
              </select>
              <select
                value={form.subcategory}
                onChange={(event) => updateField("subcategory", event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
              >
                {selectedCategoryData.subcategories.map((subcategory) => (
                  <option key={subcategory}>{subcategory}</option>
                ))}
              </select>
              <div className="grid gap-2">
                <input
                  value={form.stock}
                  onChange={(event) => updateField("stock", event.target.value)}
                  type="number"
                  min="0"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-center text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                  placeholder="Quantity"
                />
                <div className="grid grid-cols-3 gap-2">
                  {stockOptions.map((stock) => (
                    <button
                      key={stock}
                      type="button"
                      onClick={() => updateField("stock", stock)}
                      className={`h-9 rounded-xl border text-xs font-extrabold transition ${
                        String(form.stock) === stock
                          ? "border-[#4DA7AF] bg-[#4DA7AF] text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#4DA7AF] hover:text-[#23777f]"
                      }`}
                    >
                      {stock}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_260px] lg:items-start">
              <div className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">Size</span>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`h-8 rounded-full border px-2.5 text-[11px] font-extrabold transition ${
                        form.sizes.includes(size)
                          ? "border-[#4DA7AF] bg-[#4DA7AF] text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-[#4DA7AF] hover:text-[#23777f]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <select
                value={form.tax}
                onChange={(event) => updateField("tax", event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
              >
                {taxOptions.map((tax) => (
                  <option key={tax} value={tax}>
                    Tax {tax}%
                  </option>
                ))}
              </select>
              <input
                value={form.hsn}
                onChange={(event) => updateField("hsn", event.target.value)}
                className="h-12 w-full self-start rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                placeholder="HSN Code"
              />
            </div>
            {message && (
              <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-[#4DA7AF] px-5 text-sm font-extrabold text-white transition hover:bg-[#23777f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
