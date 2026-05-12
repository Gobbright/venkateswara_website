import { useState } from "react";
import { Link } from "react-router-dom";
import { LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const isLogin = mode === "login";

  return (
    <section className="min-h-screen bg-[#FAF0E6] px-5 py-8 text-[#1a0a00] md:px-16 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:p-8">
          <div className="grid grid-cols-2 rounded-full bg-orange-50 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`h-11 rounded-full text-base font-bold transition ${
                isLogin ? "bg-orange-600 text-white shadow-[0_6px_16px_rgba(249,115,22,0.28)]" : "text-gray-700 hover:text-orange-600"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`h-11 rounded-full text-base font-bold transition ${
                !isLogin ? "bg-orange-600 text-white shadow-[0_6px_16px_rgba(249,115,22,0.28)]" : "text-gray-700 hover:text-orange-600"
              }`}
            >
              Register
            </button>
          </div>

          <div className="mt-7">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-2 text-base leading-7 text-gray-600">
              {isLogin ? "Login with your registered details." : "Register once and enjoy smoother shopping support."}
            </p>
          </div>

          <form className="mt-6 space-y-4">
            {!isLogin && (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <UserRound size={17} className="text-orange-600" />
                  Full Name
                </span>
                <input className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Enter your name" />
              </label>
            )}

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                <Mail size={17} className="text-orange-600" />
                Email Address
              </span>
              <input className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Enter your email" />
            </label>

            {!isLogin && (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Phone size={17} className="text-orange-600" />
                  Phone Number
                </span>
                <input className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Enter phone number" />
              </label>
            )}

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                <LockKeyhole size={17} className="text-orange-600" />
                Password
              </span>
              <input type="password" className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Enter password" />
            </label>

            {!isLogin && (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <LockKeyhole size={17} className="text-orange-600" />
                  Confirm Password
                </span>
                <input type="password" className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Confirm password" />
              </label>
            )}

            {isLogin && (
              <div className="flex items-center justify-between gap-4 text-sm font-semibold text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-orange-600" />
                  Remember me
                </label>
                <button type="button" className="text-orange-600 transition hover:text-[#21747b]">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="button"
              className="flex h-12 w-full items-center justify-center rounded-full bg-orange-600 px-5 text-base font-bold text-white transition hover:scale-[1.02] hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF]"
            >
              {isLogin ? "Login" : "Create Account"}
            </button>

            {isLogin && (
              <Link
                to="/admin"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-5 text-sm font-bold text-orange-600 transition !no-underline hover:border-orange-500 hover:bg-orange-50"
              >
                <ShieldCheck size={18} />
                Admin Login
              </Link>
            )}
          </form>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D9F0F2] to-[#FFF1E6] p-8 shadow-[0_6px_24px_rgba(77,167,175,0.16)] md:p-10">
          <span className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-base font-semibold text-orange-600">
            Sri Venkateswara Family Shop Account
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            Shop faster with your family shopping profile
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Sign in to manage wishlist items, cart products, video call appointments, and order updates in one place.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {["Saved wishlist", "Easy checkout", "Order tracking", "Video call booking"].map((item) => (
              <div key={item} className="rounded-2xl bg-white/70 p-4 text-sm font-bold text-gray-800 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Auth;
