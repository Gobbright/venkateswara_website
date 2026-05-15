import { useEffect, useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await apiRequest("/auth/users");
        setUsers(result.data);
      } catch (error) {
        setUsers([]);
        setMessage(error.message || "Users load failed.");
      }
    };

    loadUsers();
  }, []);

  const startEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      phone: user.phone || "",
      email: user.email || "",
      city: user.city || "",
      status: user.status || "Active",
    });
    setMessage("");
  };

  const updateEditField = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const saveUser = async () => {
    if (!editingUser || !editForm.name.trim() || !editForm.email.trim()) {
      setMessage("Enter the name and email address.");
      return;
    }

    try {
      if (editingUser._id) {
        const result = await apiRequest(`/auth/users/${editingUser._id}`, {
          method: "PUT",
          body: JSON.stringify(editForm),
        });
        setUsers((current) => current.map((user) => (user._id === editingUser._id ? result.data : user)));
      } else {
        setUsers((current) =>
          current.map((user) => ((user.id || user._id) === (editingUser.id || editingUser._id) ? { ...user, ...editForm } : user))
        );
      }
      setEditingUser(null);
      setEditForm(null);
      setMessage("User updated.");
    } catch (error) {
      setMessage(error.message || "User update failed.");
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete user ${user.name}?`)) {
      return;
    }

    try {
      if (user._id) {
        await apiRequest(`/auth/users/${user._id}`, { method: "DELETE" });
      }
      setUsers((current) => current.filter((item) => (item._id || item.id) !== (user._id || user.id)));
      setMessage("User deleted.");
    } catch (error) {
      setMessage(error.message || "User delete failed.");
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Users</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          All customer data list.
        </p>
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
                <th className="px-5 py-4 font-extrabold">User ID</th>
                <th className="px-5 py-4 font-extrabold">Name</th>
                <th className="px-5 py-4 font-extrabold">Phone</th>
                <th className="px-5 py-4 font-extrabold">Email</th>
                <th className="px-5 py-4 font-extrabold">City</th>
                <th className="px-5 py-4 font-extrabold">Orders</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
                <th className="px-5 py-4 font-extrabold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4">
                    <p className="font-extrabold text-slate-950">{user.userCode || user.id || "-"}</p>
                    {user._id && <p className="mt-1 text-xs font-bold text-slate-400">{String(user._id).slice(-6).toUpperCase()}</p>}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{user.name}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{user.phone}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{user.email}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{user.city || "-"}</td>
                  <td className="px-5 py-4 font-extrabold text-[#23777f]">{user.orders || 0}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#e9fbfc] px-3 py-1 text-xs font-extrabold text-[#23777f]">
                      {user.status || "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-nowrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(user)}
                        className="inline-flex h-9 items-center gap-1 rounded-full bg-[#e9fbfc] px-3 text-xs font-extrabold text-[#23777f] transition hover:bg-[#4DA7AF] hover:text-white"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user)}
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
                <h3 className="text-xl font-extrabold text-slate-950">Edit User</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">Update the customer details.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
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
                saveUser();
              }}
              className="grid gap-4"
            >
              <input value={editForm.name} onChange={(event) => updateEditField("name", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white" placeholder="Name" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={editForm.phone} onChange={(event) => updateEditField("phone", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white" placeholder="Phone" />
                <input value={editForm.email} onChange={(event) => updateEditField("email", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white" placeholder="Email" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={editForm.city} onChange={(event) => updateEditField("city", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white" placeholder="City" />
                <select value={editForm.status} onChange={(event) => updateEditField("status", event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-[#4DA7AF] focus:bg-white">
                  {["Active", "New", "Blocked"].map((status) => (
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
