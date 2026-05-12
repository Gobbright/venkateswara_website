import { useEffect, useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { videoCalls } from "../data/adminData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const statusStyles = {
  Scheduled: "bg-blue-50 text-blue-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Completed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function VideoCalls() {
  const [calls, setCalls] = useState(videoCalls);
  const [status, setStatus] = useState("loading");
  const [activeView, setActiveView] = useState("pending");
  const [editingCall, setEditingCall] = useState(null);
  const [editStatus, setEditStatus] = useState("Pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCalls = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/videocall-schedules`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Video calls load panna mudiyala.");
        }

        if (isMounted) {
          setCalls(result.data || []);
          setStatus("ready");
        }
      } catch {
        if (isMounted) {
          setCalls(videoCalls);
          setStatus("fallback");
        }
      }
    };

    loadCalls();

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingCalls = calls.filter((call) => call.status !== "Completed");
  const completedCalls = calls.filter((call) => call.status === "Completed");
  const visibleCalls = activeView === "completed" ? completedCalls : pendingCalls;

  const openEdit = (call) => {
    setEditingCall(call);
    setEditStatus(call.status || "Pending");
    setMessage("");
  };

  const closeEdit = () => {
    setEditingCall(null);
    setEditStatus("Pending");
  };

  const saveStatus = async () => {
    if (!editingCall) {
      return;
    }

    if (!editingCall._id) {
      setCalls((current) =>
        current.map((call) =>
          call.id === editingCall.id ? { ...call, status: editStatus } : call
        )
      );
      closeEdit();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/videocall-schedules/${editingCall._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update panna mudiyala.");
      }

      setCalls((current) =>
        current.map((call) => (call._id === editingCall._id ? result.data : call))
      );
      setMessage("Status updated.");
      closeEdit();
    } catch (error) {
      setMessage(error.message || "Backend running nu check pannunga.");
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Video Call Schedule</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Scheduled purchase calls list.
        </p>
        {status === "fallback" && (
          <p className="mt-2 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
            Backend connect aagala. Demo data show aaguthu.
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveView("pending")}
              className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${
                activeView === "pending"
                  ? "bg-[#4DA7AF] text-white"
                  : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              }`}
            >
              Pending ({pendingCalls.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveView("completed")}
              className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${
                activeView === "completed"
                  ? "bg-green-600 text-white"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              Completed ({completedCalls.length})
            </button>
          </div>
          {message && (
            <p className="mt-3 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
              {message}
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">Call ID</th>
                <th className="px-5 py-4 font-extrabold">Name</th>
                <th className="px-5 py-4 font-extrabold">Phone</th>
                <th className="px-5 py-4 font-extrabold">Category</th>
                <th className="px-5 py-4 font-extrabold">Product</th>
                <th className="px-5 py-4 font-extrabold">Call Type</th>
                <th className="px-5 py-4 font-extrabold">Date / Time</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
                <th className="px-5 py-4 font-extrabold">Edit</th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" && (
                <tr>
                  <td colSpan="9" className="px-5 py-8 text-center text-sm font-bold text-slate-500">
                    Video calls loading...
                  </td>
                </tr>
              )}

              {status !== "loading" && visibleCalls.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-5 py-8 text-center text-sm font-bold text-slate-500">
                    {activeView === "completed" ? "Completed calls empty." : "Pending calls empty."}
                  </td>
                </tr>
              )}

              {status !== "loading" && visibleCalls.map((call, index) => (
                <tr key={call._id || call.id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4 font-extrabold text-slate-950">
                    {call.id || `VC-${String(index + 1).padStart(3, "0")}`}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{call.name}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{call.phone}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{call.category || "-"}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{call.product || "-"}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{call.callType || "-"}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">
                    <span className="block text-slate-900">{call.date}</span>
                    <span className="text-xs text-slate-500">{call.time}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[call.status] || statusStyles.Pending}`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => openEdit(call)}
                      className="flex h-9 items-center gap-1 rounded-full bg-[#e9fbfc] px-3 text-xs font-extrabold text-[#23777f] transition hover:bg-[#4DA7AF] hover:text-white"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-950">Edit Video Call</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {editingCall.name} status update pannunga.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close edit modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4">
              <select
                value={editStatus}
                onChange={(event) => setEditStatus(event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white"
              >
                <option>Pending</option>
                <option>Scheduled</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="h-11 rounded-2xl bg-slate-100 px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveStatus}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#4DA7AF] px-5 text-sm font-extrabold text-white transition hover:bg-[#23777f]"
                >
                  <Check size={16} />
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
