import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { apiRequest } from "../../utils/api";

const normalizeCategories = (items) =>
  items.map((category) => ({
    ...category,
    status: Number(category.status ?? 1),
    subcategories: (category.subcategories || []).map((subcategory, index) =>
      typeof subcategory === "string"
        ? {
            subcategoryCode: `SUB-${String(index + 1).padStart(3, "0")}`,
            name: subcategory,
            status: 1,
          }
        : {
            subcategoryCode: subcategory.subcategoryCode || `SUB-${String(index + 1).padStart(3, "0")}`,
            name: subcategory.name || "",
            status: Number(subcategory.status ?? 1),
          }
    ),
  }));

export default function Category() {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const [categories, setCategories] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [subcategoryNameInput, setSubcategoryNameInput] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [message, setMessage] = useState("");

  const loadCategories = async (status = showDeleted ? 0 : 1) => {
    try {
      const result = await apiRequest(`/categories?status=${status}`);
      setCategories(result.data.length ? normalizeCategories(result.data) : []);
    } catch (error) {
      setMessage(error.message || "Category load failed.");
    }
  };

  useEffect(() => {
    loadCategories(showDeleted ? 0 : 1);
  }, [showDeleted]);

  const selectedCategoryName = categoryName ? decodeURIComponent(categoryName) : "Overall";
  const selectedCategory =
    selectedCategoryName === "Overall"
      ? null
      : categories.find((category) => category.name === selectedCategoryName);

  const activeSubcategories = useMemo(
    () => (selectedCategory?.subcategories || []).filter((subcategory) => (showDeleted ? subcategory.status === 0 : subcategory.status === 1)),
    [selectedCategory, showDeleted]
  );

  const resetForms = () => {
    setCategoryNameInput("");
    setSubcategoryNameInput("");
    setEditingCategory(null);
    setEditingSubcategory(null);
  };

  const saveCategory = async () => {
    if (!categoryNameInput.trim()) {
      setMessage("Category name fill pannunga.");
      return;
    }

    try {
      if (editingCategory) {
        const result = await apiRequest(`/categories/${editingCategory._id}`, {
          method: "PUT",
          body: JSON.stringify({ name: categoryNameInput.trim() }),
        });
        setCategories((current) =>
          current.map((category) => (category._id === result.data._id ? result.data : category))
        );
        setMessage("Category updated.");
      } else {
        const result = await apiRequest("/categories", {
          method: "POST",
          body: JSON.stringify({ name: categoryNameInput.trim(), subcategories: [] }),
        });
        setCategories((current) => [result.data, ...current]);
        setMessage("Category added.");
      }
      resetForms();
    } catch (error) {
      setMessage(error.message || "Category save failed.");
    }
  };

  const softDeleteCategory = async (category) => {
    try {
      await apiRequest(`/categories/${category._id}`, { method: "DELETE" });
      setCategories((current) => current.filter((item) => item._id !== category._id));
      if (selectedCategoryName === category.name) {
        navigate("/admin/category");
      }
      setMessage("Category status 0 aachu. DB la delete agala.");
    } catch (error) {
      setMessage(error.message || "Category delete failed.");
    }
  };

  const saveSubcategory = async () => {
    if (!selectedCategory) {
      setMessage("First category select pannunga.");
      return;
    }

    if (!subcategoryNameInput.trim()) {
      setMessage("Subcategory name fill pannunga.");
      return;
    }

    try {
      const path = editingSubcategory
        ? `/categories/${selectedCategory._id}/subcategories/${editingSubcategory.subcategoryCode}`
        : `/categories/${selectedCategory._id}/subcategories`;
      const result = await apiRequest(path, {
        method: editingSubcategory ? "PUT" : "POST",
        body: JSON.stringify({ name: subcategoryNameInput.trim() }),
      });
      setCategories((current) =>
        current.map((category) => (category._id === result.data._id ? result.data : category))
      );
      setMessage(editingSubcategory ? "Subcategory updated." : "Subcategory added.");
      resetForms();
    } catch (error) {
      setMessage(error.message || "Subcategory save failed.");
    }
  };

  const softDeleteSubcategory = async (subcategory) => {
    try {
      const result = await apiRequest(
        `/categories/${selectedCategory._id}/subcategories/${subcategory.subcategoryCode}`,
        { method: "DELETE" }
      );
      setCategories((current) =>
        current.map((category) => (category._id === result.data._id ? result.data : category))
      );
      setMessage("Subcategory status 0 aachu. DB la delete agala.");
    } catch (error) {
      setMessage(error.message || "Subcategory delete failed.");
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            {selectedCategory ? `${selectedCategory.name} Category` : "Overall Category"}
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Category and subcategory DB records. Delete panna status 0 mattum.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowDeleted((current) => !current)}
            className={`h-10 rounded-full px-4 text-xs font-extrabold ${
              showDeleted ? "bg-red-600 text-white" : "bg-red-50 text-red-700"
            }`}
          >
            {showDeleted ? "Active View" : "Deleted View"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setCategoryNameInput("");
            }}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#4DA7AF] px-4 text-xs font-extrabold text-white"
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
        <input
          value={categoryNameInput}
          onChange={(event) => setCategoryNameInput(event.target.value)}
          className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF]"
          placeholder={editingCategory ? "Update category name" : "New category name"}
        />
        <button
          type="button"
          onClick={saveCategory}
          className="h-11 rounded-2xl bg-[#4DA7AF] px-5 text-sm font-extrabold text-white"
        >
          {editingCategory ? "Update Category" : "Save Category"}
        </button>
      </div>

      {message && (
        <p className="mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
          {message}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category._id || category.name}
            className={`rounded-3xl border p-5 shadow-sm ${
              selectedCategoryName === category.name ? "border-[#4DA7AF] bg-[#e9fbfc]" : "border-slate-200 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => navigate(`/admin/category/${encodeURIComponent(category.name)}`)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9fbfc] text-[#23777f]">
                  <FolderTree size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950">{category.name}</h3>
                  <p className="text-xs font-bold text-slate-400">{category.categoryCode || "-"}</p>
                  <p className="text-sm font-bold text-slate-500">
                    {(category.subcategories || []).filter((subcategory) => subcategory.status === 1).length} subcategories
                  </p>
                </div>
              </div>
            </button>
            {!showDeleted && (
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(category);
                    setCategoryNameInput(category.name);
                  }}
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-[#e9fbfc] px-3 text-xs font-extrabold text-[#23777f]"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => softDeleteCategory(category)}
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-red-50 px-3 text-xs font-extrabold text-red-700"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="text-lg font-extrabold text-slate-950">
              {selectedCategory.name} Subcategory Table
            </h3>
            {!showDeleted && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={subcategoryNameInput}
                  onChange={(event) => setSubcategoryNameInput(event.target.value)}
                  className="h-10 rounded-full border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-[#4DA7AF]"
                  placeholder={editingSubcategory ? "Update subcategory" : "New subcategory"}
                />
                <button
                  type="button"
                  onClick={saveSubcategory}
                  className="h-10 rounded-full bg-[#4DA7AF] px-4 text-xs font-extrabold text-white"
                >
                  {editingSubcategory ? "Update Subcategory" : "Add Subcategory"}
                </button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-5 py-4 font-extrabold">S.No</th>
                  <th className="px-5 py-4 font-extrabold">Sub ID</th>
                  <th className="px-5 py-4 font-extrabold">Category</th>
                  <th className="px-5 py-4 font-extrabold">Subcategory</th>
                  <th className="px-5 py-4 font-extrabold">Status</th>
                  <th className="px-5 py-4 font-extrabold">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeSubcategories.map((subcategory, index) => (
                  <tr key={subcategory.subcategoryCode} className="border-b border-slate-100 text-sm">
                    <td className="px-5 py-4 font-extrabold text-slate-950">{index + 1}</td>
                    <td className="px-5 py-4 font-extrabold text-slate-600">{subcategory.subcategoryCode}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{selectedCategory.name}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{subcategory.name}</td>
                    <td className="px-5 py-4 font-bold text-slate-600">{subcategory.status}</td>
                    <td className="px-5 py-4">
                      {!showDeleted ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSubcategory(subcategory);
                              setSubcategoryNameInput(subcategory.name);
                            }}
                            className="rounded-full bg-[#e9fbfc] px-4 py-2 text-xs font-extrabold text-[#23777f]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => softDeleteSubcategory(subcategory)}
                            className="rounded-full bg-red-50 px-4 py-2 text-xs font-extrabold text-red-700"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/products/add/${encodeURIComponent(selectedCategory.name)}`)}
                            className="rounded-full bg-[#4DA7AF] px-4 py-2 text-xs font-extrabold text-white"
                          >
                            Add Product
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-extrabold text-red-700">Deleted</span>
                      )}
                    </td>
                  </tr>
                ))}
                {activeSubcategories.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm font-bold text-slate-500">
                      No subcategories.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
