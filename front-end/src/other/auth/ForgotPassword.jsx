import { useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, Send, ShieldCheck, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { authRequest } from "../../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback("");

    if (!email.trim()) {
      setStatus("error");
      setFeedback("Please enter your registered email address.");
      return;
    }

    setStatus("loading");

    try {
      const result = await authRequest("/auth/forgot-password", { email });
      setStatus("success");
      setFeedback(result.message || "Temporary password sent to your registered email.");
    } catch (error) {
      setStatus("error");
      setFeedback(error.message || "Unable to send password email. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-[#FAF0E6] px-5 py-8 text-[#1a0a00] md:px-16 md:py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_6px_24px_rgba(77,167,175,0.16)] lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="p-6 md:p-10">
          <Link
            to="/login"
            className="mb-7 inline-flex items-center gap-2 text-sm font-extrabold text-orange-600 !no-underline transition hover:text-[#21747b]"
          >
            <ArrowLeft size={17} />
            Back to login
          </Link>

          <div className="mb-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <KeyRound size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Forgot Password</h1>
            <p className="mt-2 text-base leading-7 text-gray-600">
              Enter your registered email address and we will help you recover your shopping account.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
              <Mail size={17} className="text-orange-600" />
              Email Address
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setStatus("idle");
                setFeedback("");
              }}
              className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300"
              placeholder="Enter your email"
            />
          </label>

          {status === "error" && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {feedback}
            </p>
          )}

          {status === "success" && (
            <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-700">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
                <p>{feedback}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-5 text-base font-bold text-white transition hover:scale-[1.02] hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF]"
          >
            {status === "loading" ? "Sending..." : "Send Recovery Request"}
            <Send size={18} />
          </button>

          <div className="mt-5 rounded-2xl bg-orange-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#21747b]" size={19} />
              <p className="text-sm font-semibold leading-6 text-gray-600">
                We verify account details before allowing password changes to keep your profile secure.
              </p>
            </div>
          </div>
        </form>

        <div className="relative bg-gradient-to-br from-[#D9F0F2] to-[#FFF1E6] p-8 md:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
            <ShoppingBag size={27} />
          </div>
          <span className="mt-8 inline-flex rounded-full bg-orange-100 px-5 py-2 text-base font-semibold text-orange-600">
            Sri Venkateswara Family Shop
          </span>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            Recover your shopping profile
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Get back to wishlist items, cart products, order tracking, and video shopping support.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {["Wishlist access", "Cart recovery", "Order updates", "Video call booking"].map((item) => (
              <div key={item} className="rounded-2xl bg-white/70 p-4 text-sm font-bold text-gray-800 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
