import { videoCalls } from "../data/adminData";

const statusStyles = {
  Scheduled: "bg-blue-50 text-blue-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Completed: "bg-green-50 text-green-700",
};

export default function VideoCalls() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Video Call Schedule</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Scheduled purchase calls list.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">Call ID</th>
                <th className="px-5 py-4 font-extrabold">Name</th>
                <th className="px-5 py-4 font-extrabold">Phone</th>
                <th className="px-5 py-4 font-extrabold">Category</th>
                <th className="px-5 py-4 font-extrabold">Date / Time</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody>
              {videoCalls.map((call) => (
                <tr key={call.id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4 font-extrabold text-slate-950">{call.id}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
