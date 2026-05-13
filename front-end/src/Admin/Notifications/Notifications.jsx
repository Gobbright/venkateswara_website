import { Bell, CheckCircle2, PackageCheck, PhoneCall, ShoppingCart, UserRound } from "lucide-react";

const notifications = [
  {
    title: "New order received",
    detail: "ORD-1009 waiting for confirmation.",
    time: "Today, 10:15 AM",
    type: "Order",
    icon: ShoppingCart,
    tone: "bg-orange-50 text-orange-700",
  },
  {
    title: "Low stock alert",
    detail: "Festive Kurta stock is below 10.",
    time: "Today, 09:40 AM",
    type: "Stock",
    icon: PackageCheck,
    tone: "bg-red-50 text-red-700",
  },
  {
    title: "Video call scheduled",
    detail: "Customer Nisha booked an 11:00 AM call.",
    time: "Yesterday, 05:30 PM",
    type: "Video Call",
    icon: PhoneCall,
    tone: "bg-[#e9fbfc] text-[#23777f]",
  },
  {
    title: "Product updated",
    detail: "Mens Cotton Shirt price was changed.",
    time: "Yesterday, 03:05 PM",
    type: "Product",
    icon: CheckCircle2,
    tone: "bg-green-50 text-green-700",
  },
  {
    title: "New user joined",
    detail: "A customer account was created today.",
    time: "12 May 2026, 06:20 PM",
    type: "User",
    icon: UserRound,
    tone: "bg-blue-50 text-blue-700",
  },
];

export default function Notifications() {
  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">Notifications</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Full list of latest admin updates and alerts.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#e9fbfc] px-4 py-3 text-sm font-extrabold text-[#23777f]">
          <Bell size={18} />
          {notifications.length} Updates
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-extrabold text-slate-950">Recent Activity</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.map(({ title, detail, time, type, icon: Icon, tone }) => (
            <div key={`${title}-${time}`} className="grid gap-4 px-5 py-5 sm:grid-cols-[44px_1fr_auto] sm:items-center">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-950">{title}</h4>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-500">
                    {type}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{detail}</p>
              </div>
              <p className="text-sm font-bold text-slate-400">{time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
