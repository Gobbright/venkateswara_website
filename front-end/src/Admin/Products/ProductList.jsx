import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, ImagePlus, Pencil, Trash2, X } from "lucide-react";
import { apiRequest, assetUrl } from "../../utils/api";

const statusStyles = {
  Active: "bg-green-50 text-green-700",
  "Low Stock": "bg-orange-50 text-orange-700",
};

const taxOptions = ["0", "5", "12", "18", "28"];
const sizeOptions = ["S", "M", "L", "XL", "XXL", "Free Size"];

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

const parseSizes = (size) =>
  String(size || "M")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function ProductList() {
  const editImageInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [activeView, setActiveView] = useState("products");
  const [activeFilter, setActiveFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const [activeResult, deletedResult, categoryResult] = await Promise.all([
        apiRequest("/products"),
        apiRequest("/products?status=0"),
        apiRequest("/categories"),
      ]);
      setProducts(activeResult.data);
      setDeletedProducts(deletedResult.data);
      if (categoryResult.data.length) {
        setCategories(normalizeCategories(categoryResult.data));
      }
    } catch (error) {
      setMessage(error.message || "Products load failed.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.category === activeFilter);
  const visibleProducts = activeView === "products" ? filteredProducts : deletedProducts;
  const emptyMessage =
    activeView === "products"
      ? "No products found for this filter."
      : "Deleted products empty.";

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditForm({
      ...product,
      price: product.originalPrice ?? product.price,
      sizes: parseSizes(product.size),
    });
    setMessage("");
  };

  const updateEditField = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const toggleEditSize = (size) => {
    setEditForm((current) => {
      const currentSizes = current.sizes || parseSizes(current.size);
      const nextSizes = currentSizes.includes(size)
        ? currentSizes.filter((item) => item !== size)
        : [...currentSizes, size];

      return {
        ...current,
        sizes: nextSizes.length ? nextSizes : ["M"],
      };
    });
  };

  const handleEditImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const image = await fileToDataUrl(file);
    updateEditField("image", image);
  };

  const saveEdit = async () => {
    if (!editForm?.name?.trim() || editForm.price === "" || editForm.stock === "") {
      setMessage("Enter the product name, price, and stock.");
      return;
    }

    try {
      const payload = {
        ...editForm,
        name: editForm.name.trim(),
        originalPrice: Number(editForm.price),
        price: calculateDiscountedPrice(editForm.price, editForm.discount),
        stock: Number(editForm.stock),
        tax: Number(editForm.tax || 0),
        size: (editForm.sizes || parseSizes(editForm.size)).join(", "),
        discount: editForm.discount === "" ? 0 : Number(editForm.discount || 0),
        hsn: editForm.hsn?.trim() || "",
      };
      const result = await apiRequest(`/products/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setProducts((currentProducts) =>
        currentProducts.map((product) => (product._id === editingId ? result.data : product))
      );
      setMessage("Product updated successfully.");
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      setMessage(error.message || "Product update failed.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setMessage("");
  };

  const openDeleteModal = (product) => {
    setDeleteTarget(product);
    setMessage("");
  };

  const deleteProduct = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      const result = await apiRequest(`/products/${deleteTarget._id}`, { method: "DELETE" });
      setProducts((currentProducts) => currentProducts.filter((product) => product._id !== deleteTarget._id));
      setDeletedProducts((currentProducts) => [result.data, ...currentProducts]);
      setMessage("Product has been moved to deleted status.");
      setActiveView("deleted");
      setDeleteTarget(null);
    } catch (error) {
      setMessage(error.message || "Product delete failed.");
    }
  };

  const activeEditCategory = editForm?.category ?? categories[0]?.name ?? "";
  const activeEditCategoryData = categories.find((category) => category.name === activeEditCategory) ?? { subcategories: [] };
  const editSellingPrice = editForm ? calculateDiscountedPrice(editForm.price, editForm.discount) : 0;

  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-5 shrink-0">
        <h2 className="text-2xl font-extrabold text-slate-950">Product List</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Product table with working demo edit and delete actions.
        </p>
      </div>

      {message && (
        <p className="mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
          {message}
        </p>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="shrink-0 border-b border-slate-100 px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {["All", ...categories.map((category) => category.name)].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveView("products");
                  setActiveFilter(filter);
                }}
                className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${
                  activeView === "products" && activeFilter === filter
                    ? "bg-[#4DA7AF] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                }`}
              >
                {filter}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveView("deleted")}
              className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${
                activeView === "deleted"
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              Deleted Products
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">Image</th>
                <th className="px-5 py-4 font-extrabold">Name</th>
                <th className="px-5 py-4 font-extrabold">Category</th>
                <th className="px-5 py-4 font-extrabold">Price</th>
                <th className="px-5 py-4 font-extrabold">Size</th>
                <th className="px-5 py-4 font-extrabold">Stock</th>
                {activeView === "deleted" && <th className="px-5 py-4 font-extrabold">Deleted At</th>}
                <th className="px-5 py-4 font-extrabold">Last Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product._id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4">
                    {product.image ? (
                      <img src={assetUrl(product.image)} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xs font-extrabold text-slate-500">
                        IMG
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-extrabold text-slate-950">{product.name}</p>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      {product.productCode || `PRD-${String(product._id).slice(-5).toUpperCase()}`}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-700">{product.category}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{product.subcategory || "-"}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-extrabold text-[#23777f]">
                      Rs. {Number(product.price).toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-orange-600">{Number(product.discount || 0)}% off</p>
                    {product.originalPrice && Number(product.originalPrice) !== Number(product.price) && (
                      <p className="text-xs font-semibold text-slate-400 line-through">
                        Rs. {Number(product.originalPrice).toLocaleString("en-IN")}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{product.size || "-"}</td>
                  <td className="px-5 py-4">
                    <p className="font-extrabold text-slate-700">{product.stock}</p>
                    <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[product.stockStatus] ?? "bg-slate-100 text-slate-600"}`}>
                      {product.stockStatus || "Active"}
                    </span>
                  </td>
                  {activeView === "deleted" && (
                    <td className="px-5 py-4 font-semibold text-slate-600">
                      {product.deletedAt ? new Date(product.deletedAt).toLocaleString("en-IN") : "-"}
                    </td>
                  )}
                  <td className="px-5 py-4">
                    {activeView === "products" ? (
                      <div className="flex flex-nowrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(product)}
                          className="flex h-9 items-center gap-1 rounded-full bg-[#e9fbfc] px-3 text-xs font-extrabold text-[#23777f] transition hover:bg-[#4DA7AF] hover:text-white"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(product)}
                          className="flex h-9 items-center gap-1 rounded-full bg-red-50 px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-extrabold text-red-700">Deleted</span>
                    )}
                  </td>
                </tr>
              ))}
              {visibleProducts.length === 0 && (
                <tr>
                  <td colSpan={activeView === "deleted" ? 8 : 7} className="px-5 py-10 text-center text-sm font-bold text-slate-500">
                    {isLoading ? "Loading products..." : emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-950">Edit Product</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">Update product details.</p>
              </div>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close edit modal"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveEdit();
              }}
              className="grid gap-4"
            >
              <input ref={editImageInputRef} type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
              <button
                type="button"
                onClick={() => editImageInputRef.current?.click()}
                className="flex min-h-32 items-center justify-center gap-4 rounded-3xl border border-dashed border-[#4DA7AF] bg-[#e9fbfc] p-4 text-sm font-extrabold text-[#23777f] transition hover:bg-white"
              >
                {editForm.image ? (
                  <>
                    <img src={assetUrl(editForm.image)} alt="Product preview" className="h-24 w-24 rounded-2xl object-cover" />
                    Change Product Image
                  </>
                ) : (
                  <>
                    <ImagePlus size={20} />
                    Product Image Upload
                  </>
                )}
              </button>
              <input
                value={editForm.name}
                onChange={(event) => updateEditField("name", event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                placeholder="Product Name"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  value={editForm.category}
                  onChange={(event) => {
                    const nextCategory = event.target.value;
                    const nextCategoryData = categories.find((category) => category.name === nextCategory) ?? { subcategories: [] };
                    setEditForm((current) => ({
                      ...current,
                      category: nextCategory,
                      subcategory: nextCategoryData.subcategories[0] || "",
                    }));
                  }}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                >
                  {categories.map((category) => (
                    <option key={category.name}>{category.name}</option>
                  ))}
                </select>
                <select
                  value={editForm.subcategory}
                  onChange={(event) => updateEditField("subcategory", event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                >
                  {activeEditCategoryData.subcategories.map((subcategory) => (
                    <option key={subcategory}>{subcategory}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  value={editForm.price}
                  type="number"
                  min="1"
                  onChange={(event) => updateEditField("price", event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                  placeholder="Original Price"
                />
                <input
                  value={editForm.stock}
                  type="number"
                  min="0"
                  onChange={(event) => updateEditField("stock", event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                  placeholder="Stock"
                />
                <input
                  value={editForm.productCode || ""}
                  readOnly
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-500 outline-none"
                  placeholder="Product Code"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <select
                  value={editForm.tax ?? "0"}
                  onChange={(event) => updateEditField("tax", event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                >
                  {taxOptions.map((tax) => (
                    <option key={tax} value={tax}>
                      Tax {tax}%
                    </option>
                  ))}
                </select>
                <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleEditSize(size)}
                      className={`h-8 rounded-full border px-2.5 text-[11px] font-extrabold transition ${
                        (editForm.sizes || parseSizes(editForm.size)).includes(size)
                          ? "border-[#4DA7AF] bg-[#4DA7AF] text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-[#4DA7AF]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <input
                  value={editForm.discount ?? ""}
                  type="number"
                  min="0"
                  onChange={(event) => updateEditField("discount", event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                  placeholder="Discount %"
                />
                <input
                  value={editForm.hsn ?? ""}
                  onChange={(event) => updateEditField("hsn", event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                  placeholder="HSN Code"
                />
              </div>
              <div className="rounded-2xl border border-[#4DA7AF]/20 bg-[#e9fbfc] px-4 py-3">
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#23777f]">Selling Price</p>
                <p className="mt-1 text-xl font-extrabold text-slate-950">
                  Rs. {editSellingPrice.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="h-11 rounded-2xl bg-slate-100 px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#4DA7AF] px-5 text-sm font-extrabold text-white transition hover:bg-[#23777f]"
                >
                  <Check size={16} />
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-950">Delete Product</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Confirm delete for {deleteTarget.name}.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="h-11 rounded-2xl bg-slate-100 px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteProduct}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-red-700"
              >
                <Trash2 size={16} />
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
