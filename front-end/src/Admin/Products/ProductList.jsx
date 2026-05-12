import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, ImagePlus, Pencil, Trash2, X } from "lucide-react";
import { categories } from "../data/adminData";
import {
  getDeletedProducts,
  getStoredProducts,
  saveDeletedProducts,
  saveStoredProducts,
  subscribeProductChanges,
} from "../utils/productStore";

const productFilters = [
  "All",
  "Mens",
  "Womens",
  "Kids",
  "Festive",
  "Daily Deal",
  "Accessories",
];

const statusStyles = {
  Active: "bg-green-50 text-green-700",
  "Low Stock": "bg-orange-50 text-orange-700",
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ProductList() {
  const editImageInputRef = useRef(null);
  const [activeView, setActiveView] = useState("products");
  const [activeFilter, setActiveFilter] = useState("All");
  const [products, setProducts] = useState(() => getStoredProducts());
  const [deletedProducts, setDeletedProducts] = useState(() => getDeletedProducts());
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(
    () =>
      subscribeProductChanges(() => {
        setProducts(getStoredProducts());
        setDeletedProducts(getDeletedProducts());
      }),
    []
  );

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.category === activeFilter);
  const visibleProducts = activeView === "products" ? filteredProducts : deletedProducts;
  const emptyMessage =
    activeView === "products"
      ? "No products found for this filter."
      : "Deleted products empty.";

  const updateProducts = (nextProducts, nextMessage) => {
    setProducts(nextProducts);
    saveStoredProducts(nextProducts);
    setMessage(nextMessage);
  };

  const updateDeletedProducts = (nextProducts) => {
    setDeletedProducts(nextProducts);
    saveDeletedProducts(nextProducts);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
    setMessage("");
  };

  const updateEditField = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handleEditImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const image = await fileToDataUrl(file);
    updateEditField("image", image);
  };

  const saveEdit = () => {
    if (!editForm?.name?.trim() || editForm.price === "" || editForm.stock === "") {
      setMessage("Name, price, stock fill pannunga.");
      return;
    }

    const nextProducts = products.map((product) =>
      product.id === editingId
        ? {
            ...product,
            ...editForm,
            name: editForm.name.trim(),
            price: Number(editForm.price),
            stock: Number(editForm.stock),
          }
        : product
    );
    updateProducts(nextProducts, "Product updated.");
    setEditingId(null);
    setEditForm(null);
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

  const deleteProduct = () => {
    if (!deleteTarget) {
      return;
    }

    const nextProducts = products.filter((product) => product.id !== deleteTarget.id);
    updateProducts(nextProducts, "Product moved to deleted products.");
    updateDeletedProducts([
      {
        ...deleteTarget,
        deletedAt: new Date().toLocaleString("en-IN"),
      },
      ...deletedProducts.filter((product) => product.id !== deleteTarget.id),
    ]);
    setActiveView("deleted");
    setDeleteTarget(null);
  };

  const activeEditCategory = editForm?.category ?? categories[0].name;
  const activeEditCategoryData = categories.find((category) => category.name === activeEditCategory) ?? categories[0];

  return (
    <div>
      <div className="mb-5">
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

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {productFilters.map((filter) => (
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">Image</th>
                <th className="px-5 py-4 font-extrabold">Product ID</th>
                <th className="px-5 py-4 font-extrabold">Name</th>
                <th className="px-5 py-4 font-extrabold">Category</th>
                <th className="px-5 py-4 font-extrabold">Subcategory</th>
                <th className="px-5 py-4 font-extrabold">Price</th>
                <th className="px-5 py-4 font-extrabold">Stock</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
                {activeView === "deleted" && <th className="px-5 py-4 font-extrabold">Deleted At</th>}
                <th className="px-5 py-4 font-extrabold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xs font-extrabold text-slate-500">
                        IMG
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-extrabold text-slate-950">{product.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{product.name}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{product.category}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{product.subcategory}</td>
                  <td className="px-5 py-4 font-extrabold text-[#23777f]">Rs. {Number(product.price).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{product.stock}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  {activeView === "deleted" && (
                    <td className="px-5 py-4 font-semibold text-slate-600">{product.deletedAt || "-"}</td>
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
                  <td colSpan={activeView === "deleted" ? 10 : 9} className="px-5 py-10 text-center text-sm font-bold text-slate-500">
                    {emptyMessage}
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
                <p className="mt-1 text-sm font-semibold text-slate-500">{editingId} product details update pannunga.</p>
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
                    <img src={editForm.image} alt="Product preview" className="h-24 w-24 rounded-2xl object-cover" />
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
                    const nextCategoryData = categories.find((category) => category.name === nextCategory) ?? categories[0];
                    setEditForm((current) => ({
                      ...current,
                      category: nextCategory,
                      subcategory: nextCategoryData.subcategories[0],
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
                  placeholder="Price"
                />
                <input
                  value={editForm.stock}
                  type="number"
                  min="0"
                  onChange={(event) => updateEditField("stock", event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                  placeholder="Stock"
                />
                <select
                  value={editForm.status}
                  onChange={(event) => updateEditField("status", event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                >
                  <option>Active</option>
                  <option>Low Stock</option>
                </select>
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
                  {deleteTarget.name} delete panna confirm pannunga.
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
