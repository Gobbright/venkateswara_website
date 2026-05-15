import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, ShieldCheck, WalletCards } from "lucide-react";
import { apiRequest } from "../utils/api";
import { saveShopItems } from "../utils/shopItems";
import { getStoredUser } from "../utils/userSession";

const paymentMethods = ["Razorpay", "UPI", "Card"];

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const checkout = location.state?.checkout;
  const source = location.state?.source || "product";
  const [method, setMethod] = useState("Razorpay");
  const [message, setMessage] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  const items = useMemo(() => checkout?.items || [], [checkout]);

  const completePayment = async () => {
    if (!checkout) {
      setMessage("Payment details are missing. Please try again from the cart.");
      return;
    }

    setIsCompleting(true);
    setMessage("");

    try {
      const result = method === "Razorpay"
        ? await apiRequest("/payments/razorpay/mock-complete", {
            method: "POST",
            body: JSON.stringify({ checkout, source }),
          })
        : await apiRequest("/orders", {
            method: "POST",
            body: JSON.stringify({
              ...checkout,
              paymentMethod: method,
              paymentStatus: "Verified",
              status: "Confirmed",
            }),
          });

      const order = result.data.order || result.data;

      if (source === "cart") {
        await saveShopItems("cart", [], getStoredUser());
      }

      navigate(`/order/completed/${order._id}`, { state: { order }, replace: true });
    } catch (error) {
      setMessage(error.message || "Payment could not be completed.");
    } finally {
      setIsCompleting(false);
    }
  };

  const createPendingOrder = async () => {
    if (!checkout) {
      setMessage("Payment details are missing. Please try again from the cart.");
      return;
    }

    setIsCompleting(true);
    setMessage("");

    try {
      const result = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          ...checkout,
          paymentMethod: method,
          paymentStatus: "Pending",
          status: "Pending",
        }),
      });

      if (source === "cart") {
        await saveShopItems("cart", [], getStoredUser());
      }

      navigate(`/order/completed/${result.data._id}`, { state: { order: result.data }, replace: true });
    } catch (error) {
      setMessage(error.message || "Payment could not be completed.");
    } finally {
      setIsCompleting(false);
    }
  };

  if (!checkout) {
    return (
      <div className="min-h-screen bg-[#FAF0E6] px-4 py-8 text-[#1a0a00] md:px-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <WalletCards className="mx-auto mb-4 text-orange-600" size={44} />
          <h1 className="text-2xl font-extrabold text-slate-950">Payment details missing</h1>
          <p className="mt-2 text-sm font-semibold text-slate-600">Start checkout from the cart or product page.</p>
          <Link to="/cart" className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-orange-600 px-8 text-sm font-extrabold text-white transition !no-underline hover:bg-[#4DA7AF]">
            Go to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF0E6] px-4 py-8 text-[#1a0a00] md:px-16">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <CreditCard size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-950">Payment</h1>
              <p className="mt-1 text-sm font-semibold text-slate-600">Your order will be confirmed after payment completion.</p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {paymentMethods.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMethod(item)}
                className={`rounded-2xl border p-4 text-left font-extrabold transition ${
                  method === item
                    ? "border-orange-600 bg-orange-50 text-orange-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-orange-300"
                }`}
              >
                <WalletCards className="mb-3" size={22} />
                {item}
              </button>
            ))}
          </div>

          <div className="mt-7 rounded-2xl bg-[#fff8f0] p-5">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#23777f]">
              <ShieldCheck size={18} />
              Razorpay safe setup
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              No real money will be charged now. The Razorpay button uses a safe mock payment flow. Orders are confirmed only after payment is marked completed.
            </p>
          </div>

          {message && (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={completePayment}
            disabled={isCompleting}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-base font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <CheckCircle2 size={19} />
            {isCompleting ? "Confirming..." : method === "Razorpay" ? "Pay with Razorpay" : "Mark Payment Completed"}
          </button>

          <button
            type="button"
            onClick={createPendingOrder}
            disabled={isCompleting}
            className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 transition hover:border-orange-400 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Save as Pending Order
          </button>
        </section>

        <aside className="rounded-3xl bg-white p-6 shadow-sm lg:self-start">
          <h2 className="text-2xl font-extrabold text-slate-950">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
            <div className="flex justify-between gap-3">
              <span>Customer</span>
              <span className="text-right text-slate-950">{checkout.customer}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Email</span>
              <span className="text-right text-slate-950">{checkout.email}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Phone</span>
              <span className="text-right text-slate-950">{checkout.phone}</span>
            </div>
          </div>

          <div className="my-4 border-t border-slate-100" />

          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.slug || item.id}-${item.size || ""}`} className="rounded-2xl bg-slate-50 p-3">
                <p className="font-extrabold text-slate-950">{item.name}</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  Qty {item.quantity || 1} | Rs. {Number(item.price || 0).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-[#e9fbfc] p-4">
            <span className="font-extrabold text-slate-950">Total</span>
            <span className="text-2xl font-extrabold text-[#23777f]">
              Rs. {Number(checkout.amount || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
