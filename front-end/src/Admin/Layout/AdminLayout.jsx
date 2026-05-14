import { useEffect, useRef, useState } from "react";
import { Bell, Check, Edit3, Menu, UserRound, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import { updateAdminProfile } from "../auth/jwtAuth";
import AdminNav from "../Nav/AdminNav";
import { apiRequest } from "../../utils/api";

const playOrderSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.38);
  } catch (error) {
    console.warn("Order notification sound blocked", error);
  }
};

export default function AdminLayout({ onLogout, onUserUpdate = () => {}, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    label: user?.label || "",
  });
  const [profileMessage, setProfileMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [orderToast, setOrderToast] = useState(null);
  const latestOrderIdRef = useRef("");
  const initializedOrdersRef = useRef(false);

  useEffect(() => {
    const loadOrderNotifications = async () => {
      try {
        const result = await apiRequest("/orders");
        const latestOrder = result.data?.[0];

        if (!latestOrder) {
          return;
        }

        const latestOrderId = latestOrder.orderCode || latestOrder._id || latestOrder.id;
        const nextNotifications = result.data.slice(0, 6).map((order) => ({
          title: `Order ${order.status}`,
          detail: `${order.orderCode || order._id || order.id} - ${order.customer} - Rs. ${Number(order.amount || 0).toLocaleString("en-IN")}`,
        }));

        setNotifications(nextNotifications);

        if (!initializedOrdersRef.current) {
          initializedOrdersRef.current = true;
          latestOrderIdRef.current = latestOrderId;
          return;
        }

        if (latestOrderId && latestOrderId !== latestOrderIdRef.current) {
          latestOrderIdRef.current = latestOrderId;
          const toast = {
            title: "New order received",
            detail: `${latestOrder.orderCode || latestOrder._id} - ${latestOrder.customer} - Rs. ${Number(latestOrder.amount || 0).toLocaleString("en-IN")}`,
          };
          console.log("Admin order notification", latestOrder);
          setOrderToast(toast);
          setNotifications((current) => [toast, ...current].slice(0, 8));
          playOrderSound();
          window.setTimeout(() => setOrderToast(null), 6500);
        }
      } catch (error) {
        console.error("Admin order notification polling failed", error);
      }
    };

    loadOrderNotifications();
    const intervalId = window.setInterval(loadOrderNotifications, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  const openProfile = () => {
    setNotificationsOpen(false);
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      label: user?.label || "",
    });
    setProfileMessage("");
    setProfileOpen(true);
  };

  const updateProfileField = (field, value) => {
    setProfileForm((current) => ({ ...current, [field]: value }));
    setProfileMessage("");
  };

  const saveProfile = () => {
    if (!profileForm.name.trim() || !profileForm.email.trim() || !profileForm.label.trim()) {
      setProfileMessage("Name, email, label fill pannunga.");
      return;
    }

    const nextSession = updateAdminProfile(profileForm);

    if (!nextSession) {
      setProfileMessage("Session expired. Login again.");
      return;
    }

    onUserUpdate(nextSession);
    setProfileOpen(false);
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
                  onClick={() => setNotificationsOpen((current) => !current)}
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
                  aria-label="Edit user"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e9fbfc] text-[#23777f]">
                    <UserRound size={17} />
                  </span>
                  <span className="hidden text-xs font-extrabold sm:block">{user?.name || "User"}</span>
                  <Edit3 size={15} />
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
            {notificationsOpen && (
              <div className="absolute right-4 top-[86px] z-30 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl md:right-8">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="text-sm font-extrabold text-slate-950">Notifications</h2>
                  <p className="mt-1 text-xs font-bold text-slate-500">Latest admin updates</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.title} className="border-b border-slate-100 px-5 py-4 last:border-b-0">
                      <p className="text-sm font-extrabold text-slate-800">{notification.title}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{notification.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                <h2 className="text-xl font-extrabold text-slate-950">Edit User Details</h2>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close profile edit"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveProfile();
              }}
              className="grid gap-4"
            >
              <input
                value={profileForm.name}
                onChange={(event) => updateProfileField("name", event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                placeholder="Name"
              />
              <input
                value={profileForm.email}
                onChange={(event) => updateProfileField("email", event.target.value)}
                type="email"
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                placeholder="Email"
              />
              <input
                value={profileForm.label}
                onChange={(event) => updateProfileField("label", event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                placeholder="User Label"
              />
              <input
                value={user?.role || ""}
                readOnly
                className="h-12 rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-500 outline-none"
                placeholder="Role"
              />
              {profileMessage && (
                <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                  {profileMessage}
                </p>
              )}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="h-11 rounded-2xl bg-slate-100 px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#4DA7AF] px-5 text-sm font-extrabold text-white transition hover:bg-[#23777f]"
                >
                  <Check size={16} />
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {orderToast && (
        <div className="fixed bottom-5 right-5 z-[120] w-[calc(100vw-2.5rem)] max-w-sm rounded-3xl border border-[#4DA7AF]/30 bg-white p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e9fbfc] text-[#23777f]">
              <Bell size={18} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-slate-950">{orderToast.title}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{orderToast.detail}</p>
            </div>
            <button
              type="button"
              onClick={() => setOrderToast(null)}
              className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white"
              aria-label="Close order notification"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
