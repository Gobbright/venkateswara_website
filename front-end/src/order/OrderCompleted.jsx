import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2, PackageCheck, ShoppingBag, Truck } from "lucide-react";
import { apiRequest } from "../utils/api";

const getOrderId = (order) => order?.orderCode || order?._id || "SVFS-ORDER";

export default function OrderCompleted() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [message, setMessage] = useState("");
  const orderId = getOrderId(order);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const result = await apiRequest(`/orders/${id}`);
        setOrder(result.data);
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Order details load failed.");
      }
    };

    loadOrder();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#FAF0E6] px-4 py-8 text-[#1a0a00] md:px-16">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="bg-[#4DA7AF] px-6 py-8 text-center text-white md:px-12">
            <CheckCircle2 className="mx-auto mb-4" size={54} />
            <h1 className="text-3xl font-extrabold md:text-5xl">Order Completed</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-white/85 md:text-base">
              Payment verified. Your order is confirmed and tracking is ready.
            </p>
          </div>

          <div className="grid gap-6 p-5 md:grid-cols-[1fr_320px] md:p-8">
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-orange-600">Order ID</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-950">{orderId}</p>
                </div>
                <div className="rounded-2xl bg-[#e9fbfc] p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#23777f]">Payment</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-950">{order?.paymentStatus || "Verified"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">Customer</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-950">{order?.customer || "-"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">Total</p>
                  <p className="mt-1 text-lg font-extrabold text-[#23777f]">
                    Rs. {Number(order?.amount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 p-4">
                <p className="text-sm font-extrabold text-slate-950">Order Track</p>
                <div className="mt-4 grid gap-4">
                  {[
                    { title: "Payment Verified", icon: CheckCircle2, done: true },
                    { title: "Order Confirmed", icon: PackageCheck, done: true },
                    { title: "Packing Next", icon: Truck, done: false },
                  ].map(({ title, icon: Icon, done }) => (
                    <div key={title} className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${done ? "bg-[#4DA7AF] text-white" : "bg-orange-100 text-orange-600"}`}>
                        <Icon size={20} />
                      </div>
                      <p className="font-bold text-slate-800">{title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-2xl bg-[#fff8f0] p-5">
              <ShoppingBag className="mb-4 text-orange-600" size={34} />
              <h2 className="text-2xl font-extrabold text-slate-950">Thanks for shopping</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                You can track this order anytime from Track Order. Only your logged-in orders will show there.
              </p>
              <div className="mt-6 grid gap-3">
                <Link
                  to="/order/track"
                  className="flex h-12 items-center justify-center rounded-full bg-[#4DA7AF] px-5 text-sm font-extrabold text-white transition !no-underline hover:bg-[#23777f]"
                >
                  View Order Track
                </Link>
                <Link
                  to="/mens"
                  className="flex h-12 items-center justify-center rounded-full border border-black/15 bg-white px-5 text-sm font-extrabold text-slate-900 transition !no-underline hover:border-orange-600 hover:text-orange-600"
                >
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>

          {!order && (
            <p className="px-6 pb-6 text-center text-sm font-bold text-orange-700">
              {message || `Order details were not found for ${id}. Please check your recent orders in Track Order.`}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
