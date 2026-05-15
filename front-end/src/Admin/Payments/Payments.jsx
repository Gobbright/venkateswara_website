import { useEffect, useState } from "react";
import { CreditCard, KeyRound, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { apiRequest } from "../../utils/api";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export default function Payments() {
  const [settings, setSettings] = useState({
    provider: "Razorpay",
    mode: "Test",
    keyId: "",
    isEnabled: false,
    notes: "",
    keySecretConfigured: false,
  });
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadPaymentData = async () => {
    try {
      const [settingsResult, transactionsResult] = await Promise.all([
        apiRequest("/payments/settings"),
        apiRequest("/payments/transactions"),
      ]);
      setSettings(settingsResult.data);
      setTransactions(transactionsResult.data || []);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Payment data could not be loaded.");
    }
  };

  useEffect(() => {
    loadPaymentData();
  }, []);

  const updateField = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const result = await apiRequest("/payments/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setSettings(result.data);
      setMessage("Payment settings saved successfully.");
    } catch (error) {
      setMessage(error.message || "Payment settings could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">Payment Gateway</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Maintain Razorpay setup and view payment transactions.
          </p>
        </div>
        <button
          type="button"
          onClick={loadPaymentData}
          className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 transition hover:border-[#4DA7AF] hover:bg-[#e9fbfc] hover:text-[#23777f]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {message && (
        <p className="mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
          {message}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9fbfc] text-[#23777f]">
              <KeyRound size={22} />
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-slate-950">Razorpay Keys</h3>
              <p className="text-xs font-bold text-slate-500">Store secrets only in backend/.env</p>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Mode</span>
              <select
                value={settings.mode || "Test"}
                onChange={(event) => updateField("mode", event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
              >
                <option>Test</option>
                <option>Live</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Key ID</span>
              <input
                value={settings.keyId || ""}
                onChange={(event) => updateField("keyId", event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
                placeholder="rzp_test_xxxxxxxxxx"
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>
                <span className="block text-sm font-extrabold text-slate-800">Enable Razorpay</span>
                <span className="text-xs font-semibold text-slate-500">Keep disabled until real integration is connected.</span>
              </span>
              <input
                type="checkbox"
                checked={Boolean(settings.isEnabled)}
                onChange={(event) => updateField("isEnabled", event.target.checked)}
                className="h-5 w-5 accent-[#4DA7AF]"
              />
            </label>
            <textarea
              value={settings.notes || ""}
              onChange={(event) => updateField("notes", event.target.value)}
              className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
              placeholder="Payment setup notes"
            />
            <div className="rounded-2xl bg-[#fff8f0] p-4 text-sm font-semibold leading-6 text-slate-600">
              <div className="mb-2 flex items-center gap-2 font-extrabold text-[#23777f]">
                <ShieldCheck size={17} />
                Safe method
              </div>
              Add `RAZORPAY_KEY_SECRET` only in `backend/.env`. Do not save secret keys in frontend files.
            </div>
            <button
              type="button"
              onClick={saveSettings}
              disabled={isSaving}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#4DA7AF] px-5 text-sm font-extrabold text-white transition hover:bg-[#23777f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9fbfc] text-[#23777f]">
                <CreditCard size={20} />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">Transactions</h3>
                <p className="text-xs font-bold text-slate-500">Mock payments now, real Razorpay later.</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-5 py-4 font-extrabold">Payment ID</th>
                  <th className="px-5 py-4 font-extrabold">Order</th>
                  <th className="px-5 py-4 font-extrabold">Customer</th>
                  <th className="px-5 py-4 font-extrabold">Mode</th>
                  <th className="px-5 py-4 font-extrabold">Status</th>
                  <th className="px-5 py-4 font-extrabold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-slate-100 text-sm">
                    <td className="px-5 py-4 font-extrabold text-slate-950">{transaction.paymentId}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{transaction.orderCode || "-"}</td>
                    <td className="px-5 py-4">
                      <p className="font-extrabold text-slate-800">{transaction.customer || "-"}</p>
                      <p className="text-xs font-semibold text-slate-500">{transaction.email || "-"}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{transaction.mode}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-extrabold text-green-700">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-extrabold text-[#23777f]">{money(transaction.amount)}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm font-bold text-slate-500">
                      No payment transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
