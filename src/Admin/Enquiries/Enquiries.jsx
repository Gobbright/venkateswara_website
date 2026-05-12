import { enquiries } from "../data/adminData";

const statusStyles = {
  Open: "bg-yellow-50 text-yellow-700",
  Replied: "bg-blue-50 text-blue-700",
  Closed: "bg-green-50 text-green-700",
};

export default function Enquiries() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Enquiry Form List</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Customer enquiry submissions.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">Enquiry ID</th>
                <th className="px-5 py-4 font-extrabold">Name</th>
                <th className="px-5 py-4 font-extrabold">Phone</th>
                <th className="px-5 py-4 font-extrabold">Category</th>
                <th className="px-5 py-4 font-extrabold">Message</th>
                <th className="px-5 py-4 font-extrabold">Date</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4 font-extrabold text-slate-950">{enquiry.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{enquiry.name}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{enquiry.phone}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{enquiry.category}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{enquiry.message}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{enquiry.date}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[enquiry.status]}`}>
                      {enquiry.status}
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
