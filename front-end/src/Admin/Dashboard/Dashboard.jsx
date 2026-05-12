import { useNavigate } from "react-router-dom";
import { FolderTree, PackagePlus, PhoneCall, ShoppingCart, Users } from "lucide-react";
import { categories, orders, users, videoCalls } from "../data/adminData";
import { getStoredProducts } from "../utils/productStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const overviewActions = [
    { label: "Orders", value: orders.length, path: "/admin/orders", icon: ShoppingCart },
    { label: "Categorys", value: categories.length, path: "/admin/category", icon: FolderTree },
    { label: "Products", value: getStoredProducts().length, path: "/admin/products", icon: PackagePlus },
    { label: "Users", value: users.length, path: "/admin/users", icon: Users },
    { label: "Video Call Schedule", value: videoCalls.length, path: "/admin/video-calls", icon: PhoneCall },
  ];
  const newOrders = orders.slice(0, 5);

  return (
    <div className="min-h-[calc(100vh-7rem)]">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {overviewActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.path)}
              className="flex h-32 flex-col items-start justify-center rounded-2xl border border-slate-200 bg-white px-5 text-left shadow-sm transition hover:border-[#4DA7AF] hover:bg-[#e9fbfc]"
            >
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9fbfc] text-[#23777f]">
                <Icon size={21} />
              </span>
              <span className="mt-1 text-sm font-extrabold text-slate-600">{action.label}</span>
              <span className="text-3xl font-extrabold text-slate-950">{action.value}</span>
            </button>
          );
        })}
      </div>

      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-extrabold text-slate-950">New Orders</h2>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="rounded-full bg-[#e9fbfc] px-4 py-2 text-xs font-extrabold text-[#23777f] transition hover:bg-[#4DA7AF] hover:text-white"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">Order ID</th>
                <th className="px-5 py-4 font-extrabold">Customer</th>
                <th className="px-5 py-4 font-extrabold">Product</th>
                <th className="px-5 py-4 font-extrabold">Amount</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
                <th className="px-5 py-4 font-extrabold">Date</th>
              </tr>
            </thead>
            <tbody>
              {newOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 text-sm last:border-b-0">
                  <td className="px-5 py-4 font-extrabold text-slate-950">{order.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{order.customer}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{order.product}</td>
                  <td className="px-5 py-4 font-extrabold text-[#23777f]">
                    Rs. {Number(order.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold text-orange-700">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-600">
                    {order.date} / {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
