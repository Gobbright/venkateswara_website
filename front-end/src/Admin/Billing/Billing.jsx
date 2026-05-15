import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Mail, ReceiptText, Search } from "lucide-react";
import { apiRequest } from "../../utils/api";
import logo from "../../assets/Images/sri-venkateswara-logo.png";

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Packed: "bg-purple-50 text-purple-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const getBillItems = (order) => {
  if (Array.isArray(order.items) && order.items.length > 0) {
    return order.items.map((item) => {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || item.amount || item.total || order.amount || 0);

      return {
        name: item.name || item.product || order.product || "Product",
        quantity,
        price,
        total: Number(item.total || price * quantity),
      };
    });
  }

  return [
    {
      name: order.product || "Product",
      quantity: 1,
      price: Number(order.amount || 0),
      total: Number(order.amount || 0),
    },
  ];
};

const buildBillHtml = (order) => {
  const orderId = order.orderCode || order._id || order.id;
  const items = getBillItems(order);
  const rows = items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td class="center">${item.quantity}</td>
          <td class="right">${money(item.price)}</td>
          <td class="right">${money(item.total)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!doctype html>
    <html>
      <head>
        <title>Bill ${orderId}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; background: #f4f7fb; color: #10212b; font-family: Arial, sans-serif; }
          .bill { width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; padding: 42px; }
          .top { display: flex; justify-content: space-between; gap: 24px; border-bottom: 3px solid #4DA7AF; padding-bottom: 20px; }
          .brand { display: flex; align-items: center; gap: 14px; }
          .brand img { width: 74px; height: 74px; object-fit: contain; }
          h1, h2, p { margin: 0; }
          h1 { font-size: 25px; line-height: 1.2; }
          .muted { color: #64748b; font-size: 13px; font-weight: 700; }
          .invoice { text-align: right; font-size: 13px; line-height: 1.8; }
          .title { margin-top: 30px; display: flex; justify-content: space-between; align-items: end; }
          .title h2 { font-size: 30px; letter-spacing: 0.04em; }
          .grid { margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
          .box { border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; }
          .box h3 { margin: 0 0 10px; font-size: 13px; color: #23777f; text-transform: uppercase; letter-spacing: 0.12em; }
          .box p { color: #334155; font-size: 13px; line-height: 1.7; }
          table { width: 100%; border-collapse: collapse; margin-top: 28px; font-size: 13px; }
          th { background: #e9fbfc; color: #23777f; text-align: left; padding: 12px; }
          td { border-bottom: 1px solid #e2e8f0; padding: 12px; }
          .center { text-align: center; }
          .right { text-align: right; }
          .total { margin-top: 22px; display: flex; justify-content: flex-end; }
          .total-card { min-width: 300px; border-radius: 16px; background: #10212b; color: #fff; padding: 18px; }
          .total-card p { display: flex; justify-content: space-between; font-size: 15px; font-weight: 800; }
          .footer { margin-top: 44px; border-top: 1px solid #e2e8f0; padding-top: 18px; color: #64748b; font-size: 12px; line-height: 1.6; }
          @media print {
            body { background: #fff; }
            .bill { width: auto; min-height: auto; margin: 0; padding: 24px; }
            @page { size: A4; margin: 12mm; }
          }
        </style>
      </head>
      <body>
        <main class="bill">
          <section class="top">
            <div class="brand">
              <img src="${logo}" alt="Sri Venkateswara Family Shop" />
              <div>
                <h1>Sri Venkateswara Family Shop</h1>
                <p class="muted">Mens, Womens & Kids Wear</p>
                <p class="muted">Online Billing Receipt</p>
              </div>
            </div>
            <div class="invoice">
              <strong>Bill ID:</strong> ${orderId}<br />
              <strong>Order Date:</strong> ${order.date || "-"} ${order.time || ""}<br />
              <strong>Status:</strong> ${order.status || "-"}<br />
              <strong>Payment:</strong> ${order.paymentMethod || "Online"} / ${order.paymentStatus || "-"}
            </div>
          </section>

          <section class="title">
            <div>
              <h2>TAX INVOICE</h2>
              <p class="muted">Generated from SVFS admin billing</p>
            </div>
            <p class="muted">Track ID: ${orderId}</p>
          </section>

          <section class="grid">
            <div class="box">
              <h3>Bill To</h3>
              <p><strong>${order.customer || "-"}</strong></p>
              <p>${order.phone || "-"}</p>
              <p>${order.email || "-"}</p>
            </div>
            <div class="box">
              <h3>Delivery Address</h3>
              <p>${order.address || "-"}</p>
              <p>Category: ${order.category || "-"}</p>
            </div>
          </section>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th class="center">Qty</th>
                <th class="right">Rate</th>
                <th class="right">Amount</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <section class="total">
            <div class="total-card">
              <p><span>Grand Total</span><span>${money(order.amount)}</span></p>
            </div>
          </section>

          <section class="footer">
            <p>Thank you for shopping with Sri Venkateswara Family Shop.</p>
            <p>This is a computer generated bill from the online order system.</p>
          </section>
        </main>
      </body>
    </html>
  `;
};

const openBillPdf = (order) => {
  const printWindow = window.open("", "_blank", "width=900,height=1100");

  if (!printWindow) {
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildBillHtml(order));
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
  }, 600);
};

export default function Billing({ mode = "online" }) {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const result = await apiRequest("/orders");
        setOrders(result.data || []);
      } catch (error) {
        setOrders([]);
        setMessage(error.message || "Billing orders load failed.");
      }
    };

    loadOrders();
  }, []);

  const onlineOrders = useMemo(
    () =>
      orders.filter((order) => {
        const paymentMethod = String(order.paymentMethod || "").toLowerCase();
        return paymentMethod.includes("online") || order.paymentStatus === "Verified";
      }),
    [orders]
  );

  const visibleOrders = onlineOrders.filter((order) => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return true;
    }

    return [order.orderCode, order._id, order.customer, order.phone, order.email, order.product]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
  });

  if (mode === "offline") {
    return (
      <section className="grid min-h-[70vh] place-items-center">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e9fbfc] text-[#23777f]">
            <ReceiptText size={28} />
          </span>
          <h2 className="mt-5 text-3xl font-extrabold text-slate-950">Offline Billing</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
            Coming soon. Offline counter billing screen will be added here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">Online Billing</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            View online orders, open professional bills, and download as PDF.
          </p>
        </div>
        <label className="relative block w-full xl:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#4DA7AF] focus:ring-4 focus:ring-[#4DA7AF]/10"
            placeholder="Search bill, customer, phone"
          />
        </label>
      </div>

      {message && (
        <p className="mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
          {message}
        </p>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">Bill ID</th>
                <th className="px-5 py-4 font-extrabold">Customer</th>
                <th className="px-5 py-4 font-extrabold">Product</th>
                <th className="px-5 py-4 font-extrabold">Payment</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
                <th className="px-5 py-4 font-extrabold">Amount</th>
                <th className="px-5 py-4 font-extrabold">Bill</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order._id || order.id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4 font-extrabold text-slate-950">{order.orderCode || order._id}</td>
                  <td className="px-5 py-4">
                    <p className="font-extrabold text-slate-800">{order.customer}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <Mail size={13} />
                      {order.email || "No email"}
                    </p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{order.product}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">
                    <span className="block">{order.paymentMethod || "Online"}</span>
                    <span className="text-xs text-slate-400">{order.paymentStatus || "-"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[order.status] || "bg-slate-100 text-slate-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-extrabold text-[#23777f]">{money(order.amount)}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="flex h-9 items-center gap-1.5 rounded-xl bg-[#e9fbfc] px-3 text-xs font-extrabold text-[#23777f] transition hover:bg-[#4DA7AF] hover:text-white"
                      >
                        <FileText size={15} />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => openBillPdf(order)}
                        className="flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-3 text-xs font-extrabold text-white transition hover:bg-[#23777f]"
                      >
                        <Download size={15} />
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm font-bold text-slate-500">
                    No online billing orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <img src={logo} alt="Sri Venkateswara Family Shop" className="h-16 w-16 object-contain" />
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-950">Bill Preview</h3>
                  <p className="text-sm font-bold text-slate-500">{selectedOrder.orderCode || selectedOrder._id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openBillPdf(selectedOrder)}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-extrabold text-white transition hover:bg-[#23777f]"
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#23777f]">Customer</p>
                <p className="mt-2 font-extrabold text-slate-900">{selectedOrder.customer}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{selectedOrder.phone || "-"}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{selectedOrder.email || "-"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#23777f]">Order</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">{selectedOrder.address || "-"}</p>
                <p className="mt-2 text-sm font-bold text-slate-900">{selectedOrder.paymentMethod || "Online"} / {selectedOrder.paymentStatus || "-"}</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#e9fbfc] text-xs uppercase tracking-[0.12em] text-[#23777f]">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Rate</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {getBillItems(selectedOrder).map((item) => (
                    <tr key={item.name} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-bold text-slate-800">{item.name}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-500">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-500">{money(item.price)}</td>
                      <td className="px-4 py-3 text-right font-extrabold text-slate-900">{money(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex justify-between rounded-2xl bg-slate-950 px-5 py-4 text-white">
              <span className="text-sm font-extrabold">Grand Total</span>
              <span className="text-xl font-extrabold">{money(selectedOrder.amount)}</span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="mt-4 h-11 w-full rounded-2xl bg-slate-100 px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-800 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
