import { useState } from "react";
import { Bell, Mail, Menu, ShieldCheck, UserRound, X } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNav from "../Nav/AdminNav";

export default function AdminLayout({ onLogout, onUserUpdate = () => {}, user }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const openProfile = () => {
    setProfileOpen(true);
  };

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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/admin/notifications")}
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#4DA7AF] hover:bg-[#e9fbfc] hover:text-[#23777f]"
                  aria-label="Notifications"
                >
                  <Bell size={19} />
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
                </button>
                <button
                  type="button"
                  onClick={openProfile}
                  className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-slate-700 transition hover:border-[#4DA7AF] hover:bg-[#e9fbfc] hover:text-[#23777f]"
                  aria-label="View user details"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e9fbfc] text-[#23777f]">
                    <UserRound size={17} />
                  </span>
                  <span className="hidden text-xs font-extrabold sm:block">{user?.name || "User"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4DA7AF] text-white lg:hidden"
                  aria-label="Open admin menu"
                >
                  <Menu size={22} />
                </button>
              </div>
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

      {profileOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">User Details</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">Signed-in admin profile.</p>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close profile details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                  <UserRound size={15} />
                  Name
                </div>
                <p className="text-sm font-extrabold text-slate-900">{user?.name || "-"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                  <Mail size={15} />
                  Email
                </div>
                <p className="text-sm font-extrabold text-slate-900">{user?.email || "-"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                  <ShieldCheck size={15} />
                  Access
                </div>
                <p className="text-sm font-extrabold text-slate-900">{user?.label || "-"}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{user?.role || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
