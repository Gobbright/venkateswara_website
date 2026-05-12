import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/users`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Users load panna mudiyala.");
        }

        if (isMounted) {
          setUsers(result.data || []);
          setStatus("ready");
        }
      } catch {
        if (isMounted) {
          setStatus("error");
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Users</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          All customer data list.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">User ID</th>
                <th className="px-5 py-4 font-extrabold">Name</th>
                <th className="px-5 py-4 font-extrabold">Phone</th>
                <th className="px-5 py-4 font-extrabold">Email</th>
                <th className="px-5 py-4 font-extrabold">Joined</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" && (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-sm font-bold text-slate-500">
                    Users loading...
                  </td>
                </tr>
              )}

              {status === "error" && (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-sm font-bold text-red-600">
                    Users load panna mudiyala. Backend running nu check pannunga.
                  </td>
                </tr>
              )}

              {status === "ready" && users.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-sm font-bold text-slate-500">
                    Innum registered users illa.
                  </td>
                </tr>
              )}

              {status === "ready" && users.map((user, index) => (
                <tr key={user._id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4 font-extrabold text-slate-950">
                    USR-{String(index + 1).padStart(3, "0")}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{user.name}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{user.phone || "-"}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{user.email}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "-"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#e9fbfc] px-3 py-1 text-xs font-extrabold text-[#23777f]">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
