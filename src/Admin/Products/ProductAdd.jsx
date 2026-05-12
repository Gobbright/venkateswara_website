import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ImagePlus, PackagePlus } from "lucide-react";
import { categories } from "../data/adminData";
import {
  createProductId,
  getStoredProducts,
  saveStoredProducts,
} from "../utils/productStore";

const emptyForm = {
  name: "",
  subcategory: "",
  price: "",
  stock: "",
  image: "",
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ProductAdd({ initialCategory = categories[0].name }) {
  const { categoryName } = useParams();
  const imageInputRef = useRef(null);
  const routeCategory = categoryName ? decodeURIComponent(categoryName) : initialCategory;
  const [selectedCategory, setSelectedCategory] = useState(routeCategory);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const selectedCategoryData = categories.find((category) => category.name === selectedCategory) ?? categories[0];

  useEffect(() => {
    setSelectedCategory(routeCategory);
  }, [routeCategory]);

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

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const image = await fileToDataUrl(file);
    updateField("image", image);
  };

  const handleAddProduct = (event) => {
    event.preventDefault();

    if (!form.name.trim() || form.price === "" || form.stock === "") {
      setMessage("Product name, price, stock fill pannunga.");
      return;
    }

    const productList = getStoredProducts();
    const newProduct = {
      id: createProductId(productList),
      name: form.name.trim(),
      category: selectedCategory,
      subcategory: form.subcategory || selectedCategoryData.subcategories[0],
      price: Number(form.price),
      stock: Number(form.stock),
      status: Number(form.stock) <= 10 ? "Low Stock" : "Active",
      image: form.image,
    };

    saveStoredProducts([newProduct, ...productList]);
    setForm({
      ...emptyForm,
      subcategory: selectedCategoryData.subcategories[0] ?? "",
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    setMessage(`${newProduct.name} added successfully.`);
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Top Product Add</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Product add page with category visual and top product display.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleAddProduct} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9fbfc] text-[#23777f]">
              <PackagePlus size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-950">Add Product</h3>
              <p className="text-sm font-semibold text-slate-500">Category select pannitu product add pannunga.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
              placeholder="Product Name"
            />
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
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                type="number"
                min="1"
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                placeholder="Price"
              />
              <input
                value={form.stock}
                onChange={(event) => updateField("stock", event.target.value)}
                type="number"
                min="0"
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                placeholder="Stock"
              />
            </div>
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex min-h-28 items-center justify-center gap-3 rounded-3xl border border-dashed border-[#4DA7AF] bg-[#e9fbfc] p-4 text-sm font-extrabold text-[#23777f] transition hover:bg-white"
            >
              {form.image ? (
                <>
                  <img src={form.image} alt="Product preview" className="h-20 w-20 rounded-2xl object-cover" />
                  Change Product Image
                </>
              ) : (
                <>
                  <ImagePlus size={20} />
                  Product Image Upload
                </>
              )}
            </button>
            {message && (
              <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                {message}
              </p>
            )}
            <button type="submit" className="h-12 rounded-2xl bg-[#4DA7AF] text-sm font-extrabold text-white transition hover:bg-[#23777f]">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
