import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import AdminNav from "../Nav/AdminNav";

export default function AdminLayout({ onLogout, user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <div className="hidden lg:block">
          <AdminNav onLogout={onLogout} user={user} />
        </div>

        <main className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#23777f]">
                  Sri Venkateswara Family Shop
                </p>
                <h1 className="mt-1 text-2xl font-extrabold text-slate-950 md:text-3xl">
                  Admin Panel
                </h1>
                {user?.label && (
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {user.name} / {user.label}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4DA7AF] text-white lg:hidden"
                aria-label="Open admin menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </header>

          <div className="px-4 py-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/45 backdrop-blur-sm lg:hidden">
          <div className="h-full w-[86vw] max-w-[320px] overflow-y-auto bg-white shadow-2xl">
            <div className="flex justify-end p-4">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"
                aria-label="Close admin menu"
              >
                <X size={20} />
              </button>
            </div>
            <div>
              <AdminNav onLogout={onLogout} onNavigate={() => setMenuOpen(false)} user={user} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
