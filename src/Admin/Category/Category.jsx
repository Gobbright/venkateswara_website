import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, FolderTree } from "lucide-react";
import { categories } from "../data/adminData";

export default function Category() {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const selectedCategoryName = categoryName ? decodeURIComponent(categoryName) : "Overall";
  const selectedCategory =
    selectedCategoryName === "Overall"
      ? null
      : categories.find((category) => category.name === selectedCategoryName);

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">
          {selectedCategory ? `${selectedCategory.name} Category` : "Overall Category"}
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Click category card to view subcategory table.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`rounded-3xl border p-5 shadow-sm ${
              selectedCategoryName === category.name
                ? "border-[#4DA7AF] bg-[#e9fbfc]"
                : "border-slate-200 bg-white"
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
                  <p className="text-sm font-bold text-slate-500">{category.count} products</p>
                </div>
              </div>
              <ChevronDown className="text-slate-400" size={19} />
            </button>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-lg font-extrabold text-slate-950">
              {selectedCategory.name} Subcategory Table
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-5 py-4 font-extrabold">S.No</th>
                  <th className="px-5 py-4 font-extrabold">Category</th>
                  <th className="px-5 py-4 font-extrabold">Subcategory</th>
                  <th className="px-5 py-4 font-extrabold">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedCategory.subcategories.map((subcategory, index) => (
                  <tr key={subcategory} className="border-b border-slate-100 text-sm">
                    <td className="px-5 py-4 font-extrabold text-slate-950">{index + 1}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{selectedCategory.name}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{subcategory}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/products/add/${encodeURIComponent(selectedCategory.name)}`)}
                        className="rounded-full bg-[#4DA7AF] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#23777f]"
                      >
                        Add Product
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
