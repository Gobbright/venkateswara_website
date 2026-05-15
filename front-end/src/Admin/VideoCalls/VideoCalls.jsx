import { useEffect, useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { apiRequest } from "../../utils/api";

const statusStyles = {
  Scheduled: "bg-blue-50 text-blue-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Completed: "bg-green-50 text-green-700",
};

export default function VideoCalls() {
  const [videoCalls, setVideoCalls] = useState([]);
  const [message, setMessage] = useState("");
  const [editingCall, setEditingCall] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    const loadVideoCalls = async () => {
      try {
        const result = await apiRequest("/video-calls");
        setVideoCalls(result.data);
      } catch (error) {
        setVideoCalls([]);
        setMessage(error.message || "Video calls load failed.");
      }
    };

    loadVideoCalls();
  }, []);

  const startEdit = (call) => {
    setEditingCall(call);
    setEditForm({
      name: call.name || "",
      phone: call.phone || "",
      category: call.category || "",
      date: call.date || "",
      time: call.time || "",
      status: call.status || "Scheduled",
    });
    setMessage("");
  };

  const updateEditField = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const saveVideoCall = async () => {
    if (!editingCall || !editForm.name.trim() || !editForm.phone.trim() || !editForm.date || !editForm.time) {
      setMessage("Enter the name, phone number, date, and time.");
      return;
    }

    try {
      if (editingCall._id) {
        const result = await apiRequest(`/video-calls/${editingCall._id}`, {
          method: "PUT",
          body: JSON.stringify(editForm),
        });
        setVideoCalls((current) => current.map((call) => (call._id === editingCall._id ? result.data : call)));
      } else {
        setVideoCalls((current) =>
          current.map((call) => ((call._id || call.id) === (editingCall._id || editingCall.id) ? { ...call, ...editForm } : call))
        );
      }
      setEditingCall(null);
      setEditForm(null);
      setMessage("Video call schedule updated.");
    } catch (error) {
      setMessage(error.message || "Video call update failed.");
    }
  };

  const deleteVideoCall = async (call) => {
    if (!window.confirm(`Delete the video call for ${call.name}?`)) {
      return;
    }

    try {
      if (call._id) {
        await apiRequest(`/video-calls/${call._id}`, { method: "DELETE" });
      }
      setVideoCalls((current) => current.filter((item) => (item._id || item.id) !== (call._id || call.id)));
      setMessage("Video call deleted.");
    } catch (error) {
      setMessage(error.message || "Video call delete failed.");
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Video Call Schedule</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Scheduled purchase calls list.
        </p>
      </div>

      {message && (
        <p className="mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
          {message}
        </p>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">Call ID</th>
                <th className="px-5 py-4 font-extrabold">Name</th>
                <th className="px-5 py-4 font-extrabold">Phone</th>
                <th className="px-5 py-4 font-extrabold">Category</th>
                <th className="px-5 py-4 font-extrabold">Date / Time</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
                <th className="px-5 py-4 font-extrabold">Action</th>
              </tr>
            </thead>
            <tbody>
              {videoCalls.map((call) => (
                <tr key={call._id || call.id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4 font-extrabold text-slate-950">{call._id || call.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{call.name}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{call.phone}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{call.category}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">
                    <span className="block text-slate-900">{call.date}</span>
                    <span className="text-xs text-slate-500">{call.time}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[call.status]}`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-nowrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(call)}
                        className="inline-flex h-9 items-center gap-1 rounded-full bg-[#e9fbfc] px-3 text-xs font-extrabold text-[#23777f] transition hover:bg-[#4DA7AF] hover:text-white"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteVideoCall(call)}
                        className="inline-flex h-9 items-center gap-1 rounded-full bg-red-50 px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-950">Edit Video Call</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">Update the schedule details.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCall(null);
                  setEditForm(null);
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close edit modal"
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveVideoCall();
              }}
              className="grid gap-4"
            >
              <input value={editForm.name} onChange={(event) => updateEditField("name", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white" placeholder="Name" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={editForm.phone} onChange={(event) => updateEditField("phone", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white" placeholder="Phone" />
                <input value={editForm.category} onChange={(event) => updateEditField("category", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white" placeholder="Category" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <input type="date" value={editForm.date} onChange={(event) => updateEditField("date", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white" />
                <input value={editForm.time} onChange={(event) => updateEditField("time", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white" placeholder="Time" />
                <select value={editForm.status} onChange={(event) => updateEditField("status", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white">
                  {["Scheduled", "Pending", "Completed"].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setEditForm(null)} className="h-11 rounded-2xl bg-slate-100 px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-800 hover:text-white">Cancel</button>
                <button type="submit" className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#4DA7AF] px-5 text-sm font-extrabold text-white transition hover:bg-[#23777f]">
                  <Check size={16} />
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
