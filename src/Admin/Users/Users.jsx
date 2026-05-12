import { users } from "../data/adminData";

export default function Users() {
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
                <th className="px-5 py-4 font-extrabold">City</th>
                <th className="px-5 py-4 font-extrabold">Orders</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4 font-extrabold text-slate-950">{user.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{user.name}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{user.phone}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{user.email}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{user.city}</td>
                  <td className="px-5 py-4 font-extrabold text-[#23777f]">{user.orders}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#e9fbfc] px-3 py-1 text-xs font-extrabold text-[#23777f]">
                      {user.status}
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
