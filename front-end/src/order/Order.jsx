import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Package,
  PackageCheck,
  Search,
  Truck,
} from "lucide-react";
import { apiRequest } from "../utils/api";
import { getStoredUser } from "../utils/userSession";

const statusSteps = ["Confirmed", "Packed", "Delivered"];

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Packed: "bg-purple-50 text-purple-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

const getOrderId = (order) => order.orderCode || order._id || order.id;

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);

    if (!user) {
      setOrders([]);
      setMessage("Order track pakka login pannunga.");
      return;
    }

    const loadOrders = async () => {
      try {
        const result = await apiRequest(`/orders?userId=${encodeURIComponent(user.id)}`);
        setOrders(result.data);
        setMessage(result.data.length ? "" : "Innum order illa da. Shopping start pannunga.");
      } catch (error) {
        setOrders([]);
        setMessage(error.message || "Orders load failed.");
      }
    };

    loadOrders();
  }, []);

  const visibleOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return orders;
    }

    return orders.filter((order) => {
      const values = [getOrderId(order), order.product, order.phone, order.status, order.paymentStatus];
      return values.some((value) => String(value || "").toLowerCase().includes(normalizedQuery));
    });
  }, [orders, query]);

  const selectedOrder = visibleOrders[0];

  const requireLogin = () => {
    navigate("/login", { state: { returnTo: location.pathname } });
  };

  return (
    <div className="min-h-screen bg-[#FAF0E6] px-4 py-6 text-[#1a0a00] md:px-16 md:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-3xl bg-white px-6 py-7 text-center shadow-sm md:px-14">
          <p className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-sm font-extrabold text-orange-600">
            Your E-commerce Orders
          </p>
          <h1 className="mt-5 text-4xl font-extrabold text-gray-900 md:text-5xl">
            Track Your Order
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600">
            Login pannirukka user orders mattum inga show aagum.
          </p>
        </div>

        {!currentUser ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <Package className="mx-auto mb-4 text-orange-600" size={44} />
            <h2 className="text-2xl font-extrabold text-slate-950">Login Required</h2>
            <p className="mt-2 text-sm font-semibold text-slate-600">Order track and checkout ku user login venum.</p>
            <button
              type="button"
              onClick={requireLogin}
              className="mt-5 h-12 rounded-full bg-orange-600 px-8 text-sm font-extrabold text-white transition hover:bg-[#4DA7AF]"
            >
              Login to Track
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:p-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search order ID / mobile / status"
                  className="h-12 w-full rounded-full border border-orange-100 bg-orange-50 pl-12 pr-4 text-base font-semibold outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>
              <Link
                to="/mens"
                className="flex h-12 items-center justify-center rounded-full bg-orange-600 px-8 font-bold text-white transition !no-underline hover:bg-[#4DA7AF]"
              >
                Continue Shopping
              </Link>
            </div>

            {message && (
              <p className="mb-5 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                {message}
              </p>
            )}

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <section className="rounded-3xl bg-white p-5 shadow-sm md:p-7">
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-2xl font-extrabold">Order Track</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {selectedOrder ? getOrderId(selectedOrder) : "No active order"}
                    </p>
                  </div>
                  {selectedOrder && (
                    <span className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${statusStyles[selectedOrder.status] || "bg-slate-100 text-slate-600"}`}>
                      <Truck size={18} /> {selectedOrder.status}
                    </span>
                  )}
                </div>

                {selectedOrder ? (
                  <>
                    <div className="mb-7 grid gap-3 sm:grid-cols-2">
                      {[
                        { label: "Order ID", value: getOrderId(selectedOrder) },
                        { label: "Product", value: selectedOrder.product },
                        { label: "Payment", value: selectedOrder.paymentStatus || "Verified" },
                        { label: "Total", value: `Rs. ${Number(selectedOrder.amount || 0).toLocaleString("en-IN")}` },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-orange-100 bg-[#FFF8F0] p-4">
                          <p className="text-xs font-bold uppercase text-slate-400">{item.label}</p>
                          <p className="mt-1 font-bold text-slate-800">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {statusSteps.map((step) => {
                        const currentIndex = statusSteps.indexOf(selectedOrder.status);
                        const stepIndex = statusSteps.indexOf(step);
                        const done = selectedOrder.status === "Delivered" || (currentIndex >= 0 && stepIndex <= currentIndex);

                        return (
                          <div key={step} className="flex gap-4">
                            <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? "bg-[#4DA7AF] text-white" : "bg-orange-100 text-orange-600"}`}>
                              {done ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900">{step}</h3>
                              <p className="text-sm leading-6 text-slate-600">
                                {step === "Confirmed" && "Payment verified and order confirmed."}
                                {step === "Packed" && "Shop team packs your products safely."}
                                {step === "Delivered" && "Order delivered to your address."}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl bg-orange-50 p-8 text-center">
                    <p className="text-lg font-extrabold text-slate-950">No order found.</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">Checkout complete panna tracking inga varum.</p>
                  </div>
                )}
              </section>

              <aside className="grid gap-4">
                <div className="rounded-3xl bg-[#4DA7AF] p-5 text-white shadow-sm">
                  <PackageCheck className="mb-4" size={34} />
                  <h2 className="mb-2 text-2xl font-extrabold">My Orders</h2>
                  <p className="text-sm leading-6 text-white/85">
                    {currentUser.name} account la saved orders: {orders.length}
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="grid gap-3">
                    {visibleOrders.map((order) => (
                      <button
                        key={getOrderId(order)}
                        type="button"
                        onClick={() => setQuery(getOrderId(order))}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-orange-300 hover:bg-orange-50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-extrabold text-slate-950">{getOrderId(order)}</p>
                          <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[order.status] || "bg-slate-100 text-slate-600"}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-600">{order.product}</p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#23777f]">
                          <CreditCard size={16} /> {order.paymentStatus || "Verified"}
                        </p>
                      </button>
                    ))}
                    {visibleOrders.length === 0 && (
                      <p className="rounded-2xl bg-orange-50 p-5 text-center text-sm font-bold text-orange-700">
                        Matching order illa.
                      </p>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
