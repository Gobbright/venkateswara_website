import { useNavigate } from "react-router-dom";
import { BarChart3, Boxes, PackageCheck, ShoppingCart } from "lucide-react";
import { orders, topProducts } from "../data/adminData";

const overviewCards = [
  { label: "Overall Orders", value: orders.length, icon: ShoppingCart },
  {
    label: "Packed Orders",
    value: orders.filter((order) => order.status === "Packed").length,
    icon: PackageCheck,
  },
  { label: "Top Products", value: topProducts.length, icon: Boxes },
  { label: "Revenue", value: "Rs. 11.4k", icon: BarChart3 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">
              Store Admin Dashboard
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
              Orders, categories, and top products visual a manage panna clean admin panel.
            </p>
          </div>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/orders")}
              className="rounded-2xl bg-[#4DA7AF] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#23777f]"
            >
              View Orders
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products/add")}
              className="rounded-2xl bg-orange-100 px-5 py-3 text-sm font-extrabold text-orange-700 transition hover:bg-orange-600 hover:text-white"
            >
              Add Top Product
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9fbfc] text-[#23777f]">
              <Icon size={22} />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-950">{value}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-extrabold text-slate-950">Recent Order Status</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {orders.slice(0, 4).map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
              <div>
                <h4 className="text-sm font-extrabold text-slate-950">{order.product}</h4>
                <p className="text-xs font-bold text-slate-500">
                  {order.id} / {order.category}
                </p>
              </div>
              <span className="rounded-full bg-[#e9fbfc] px-3 py-1 text-xs font-extrabold text-[#23777f]">
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
