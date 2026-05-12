import { useState } from "react";
import { useParams } from "react-router-dom";
import { Edit3, PackageCheck, ShoppingCart, Truck, X, XCircle } from "lucide-react";
import { orders } from "../data/adminData";

const categoryFilters = [
  "All Category",
  "Mens",
  "Womens",
  "Kids",
  "Festive",
  "Daily Deal",
  "Accessories",
];

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Packed: "bg-purple-50 text-purple-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

const statusFlow = ["Pending", "Confirmed", "Packed", "Delivered"];

export default function Orders() {
  const { status } = useParams();
  const activeCategory = status ? decodeURIComponent(status) : "Overall";
  const [orderList, setOrderList] = useState(orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All Category");
  const [dateFilter, setDateFilter] = useState("");

  const statusFilteredOrders =
    activeCategory === "Overall"
      ? orderList
      : orderList.filter((order) => order.status === activeCategory);

  const visibleOrders =
    categoryFilter === "All Category"
      ? statusFilteredOrders
      : statusFilteredOrders.filter((order) => order.category === categoryFilter);
  const dateFilteredOrders = dateFilter
    ? visibleOrders.filter((order) => order.date === dateFilter)
    : visibleOrders;

  const statusCounts = orderList.reduce((counts, order) => {
    counts[order.status] = (counts[order.status] ?? 0) + 1;
    return counts;
  }, {});

  const summaryCards = [
    { label: "Total Orders", value: orderList.length, icon: ShoppingCart },
    { label: "Packed", value: statusCounts.Packed ?? 0, icon: PackageCheck },
    { label: "Delivered", value: statusCounts.Delivered ?? 0, icon: Truck },
    { label: "Cancelled", value: statusCounts.Cancelled ?? 0, icon: XCircle },
  ];

  const handleModalChange = (field, value) => {
    setSelectedOrder((currentOrder) => ({
      ...currentOrder,
      [field]: field === "amount" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    setOrderList((currentOrders) =>
      currentOrders.map((order) =>
        order.id === selectedOrder.id ? selectedOrder : order
      )
    );
    setSelectedOrder(null);
  };

  const handleDelete = () => {
    setOrderList((currentOrders) =>
      currentOrders.filter((order) => order.id !== selectedOrder.id)
    );
    setSelectedOrder(null);
  };

  const handleNextMove = () => {
    setSelectedOrder((currentOrder) => {
      const currentIndex = statusFlow.indexOf(currentOrder.status);

      if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
        return currentOrder;
      }

      return {
        ...currentOrder,
        status: statusFlow[currentIndex + 1],
      };
    });
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">
          {activeCategory} Orders
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Category wise order table and status visual.
        </p>
      </div>

      <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9fbfc] text-[#23777f]">
              <Icon size={22} />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-950">{value}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <h3 className="text-lg font-extrabold text-slate-950">Order List</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setCategoryFilter(filter)}
                    className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${
                      categoryFilter === filter
                        ? "bg-[#4DA7AF] text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="h-10 rounded-full border border-slate-200 bg-slate-50 px-4 text-xs font-extrabold text-slate-600 outline-none focus:border-[#4DA7AF] focus:bg-white"
                />
                {dateFilter && (
                  <button
                    type="button"
                    onClick={() => setDateFilter("")}
                    className="h-10 rounded-full bg-orange-50 px-4 text-xs font-extrabold text-orange-700 transition hover:bg-orange-600 hover:text-white"
                  >
                    Clear Date
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">Order ID</th>
                <th className="px-5 py-4 font-extrabold">Customer</th>
                <th className="px-5 py-4 font-extrabold">Category</th>
                <th className="px-5 py-4 font-extrabold">Product</th>
                <th className="px-5 py-4 font-extrabold">Date / Time</th>
                <th className="px-5 py-4 font-extrabold">Amount</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
                <th className="px-5 py-4 font-extrabold">Edit</th>
              </tr>
            </thead>
            <tbody>
              {dateFilteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4 font-extrabold text-slate-950">{order.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{order.customer}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{order.category}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{order.product}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">
                    <span className="block text-slate-900">{order.date}</span>
                    <span className="text-xs text-slate-500">{order.time}</span>
                  </td>
                  <td className="px-5 py-4 font-extrabold text-[#23777f]">
                    Rs. {order.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9fbfc] text-[#23777f] transition hover:bg-[#4DA7AF] hover:text-white"
                      aria-label={`Edit ${order.id}`}
                    >
                      <Edit3 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
              {dateFilteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-sm font-bold text-slate-500">
                    No orders found for selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-950">Order Details</h3>
                <p className="text-sm font-semibold text-slate-500">
                  View, update, save, or delete order.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Order ID</span>
                <input value={selectedOrder.id} readOnly className="h-11 w-full rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-600 outline-none" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Name</span>
                <input value={selectedOrder.customer} onChange={(event) => handleModalChange("customer", event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-[#4DA7AF]" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Phone Number</span>
                <input value={selectedOrder.phone} onChange={(event) => handleModalChange("phone", event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-[#4DA7AF]" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Category</span>
                <input value={selectedOrder.category} onChange={(event) => handleModalChange("category", event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-[#4DA7AF]" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Product</span>
                <input value={selectedOrder.product} onChange={(event) => handleModalChange("product", event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-[#4DA7AF]" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Amount</span>
                <input type="number" value={selectedOrder.amount} onChange={(event) => handleModalChange("amount", event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-[#4DA7AF]" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Date</span>
                <input type="date" value={selectedOrder.date} onChange={(event) => handleModalChange("date", event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-[#4DA7AF]" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Time</span>
                <input value={selectedOrder.time} onChange={(event) => handleModalChange("time", event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-[#4DA7AF]" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Address</span>
                <textarea value={selectedOrder.address} onChange={(event) => handleModalChange("address", event.target.value)} className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#4DA7AF]" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Order Status</span>
                <select value={selectedOrder.status} onChange={(event) => handleModalChange("status", event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-[#4DA7AF]">
                  {Object.keys(statusStyles).map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleNextMove}
                disabled={!statusFlow.includes(selectedOrder.status) || selectedOrder.status === "Delivered"}
                className="h-11 rounded-2xl bg-slate-950 px-6 text-sm font-extrabold text-white transition hover:bg-[#23777f] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                Next Move
              </button>
              <button type="button" onClick={handleSave} className="h-11 rounded-2xl bg-[#4DA7AF] px-6 text-sm font-extrabold text-white transition hover:bg-[#23777f]">
                Save
              </button>
              <button type="button" onClick={handleDelete} className="h-11 rounded-2xl bg-red-50 px-6 text-sm font-extrabold text-red-700 transition hover:bg-red-600 hover:text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
