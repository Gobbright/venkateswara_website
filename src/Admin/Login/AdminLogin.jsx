import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Store } from "lucide-react";
import { ADMIN_USERS } from "../auth/jwtAuth";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValidLogin = onLogin({ email, password });

    if (!isValidLogin) {
      setError("Correct email and password enter pannunga.");
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4 py-8 text-slate-950">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-[#10212b] p-7 text-white md:p-10 lg:block">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4DA7AF]">
            <Store size={27} />
          </div>
          <h1 className="mt-8 text-4xl font-extrabold leading-tight md:text-5xl">
            Sri Venkateswara Admin
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-white/75">
            Orders, categories, products, and stock status ellam one dashboard la manage pannalam.
          </p>
          <div className="mt-8 grid gap-3">
            {["Overall order status", "Category wise products", "Top product add page"].map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold">
                {item}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-7 md:p-10">
          <div className="mb-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9fbfc] text-[#23777f]">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-950">Admin Login</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              JWT auth token create aagi dashboard open aagum.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                <Mail size={17} className="text-[#23777f]" />
                Email Address
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold outline-none transition focus:border-[#4DA7AF] focus:bg-white focus:ring-4 focus:ring-[#4DA7AF]/15"
                placeholder="admin@gobrightglobal.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                <LockKeyhole size={17} className="text-[#23777f]" />
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold outline-none transition focus:border-[#4DA7AF] focus:bg-white focus:ring-4 focus:ring-[#4DA7AF]/15"
                placeholder="admin123"
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#4DA7AF] px-5 text-sm font-extrabold text-white transition hover:bg-[#23777f]"
          >
            Login Dashboard
            <ArrowRight size={18} />
          </button>

          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Demo Logins
            </p>
            <div className="mt-3 grid gap-2">
              {ADMIN_USERS.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => {
                    setEmail(user.email);
                    setPassword(user.password);
                    setError("");
                  }}
                  className="rounded-xl bg-white px-3 py-2 text-left text-xs font-bold text-slate-600 transition hover:bg-[#e9fbfc] hover:text-[#23777f]"
                >
                  <span className="block text-slate-900">{user.name} - {user.label}</span>
                  {user.email} / {user.password}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
