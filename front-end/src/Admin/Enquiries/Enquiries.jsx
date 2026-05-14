import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { enquiries as defaultEnquiries } from "../data/adminData";
import { apiRequest } from "../../utils/api";

const statusStyles = {
  New: "bg-yellow-50 text-yellow-700",
  Contacted: "bg-blue-50 text-blue-700",
  Open: "bg-yellow-50 text-yellow-700",
  Replied: "bg-blue-50 text-blue-700",
  Closed: "bg-green-50 text-green-700",
};

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadEnquiries = async () => {
      try {
        const result = await apiRequest("/enquiries");
        setEnquiries(result.data.length ? result.data : defaultEnquiries);
      } catch (error) {
        setEnquiries(defaultEnquiries);
        setMessage(error.message || "Enquiries load failed.");
      }
    };

    loadEnquiries();
  }, []);

  const deleteEnquiry = async (enquiry) => {
    if (!window.confirm(`${enquiry.name} enquiry delete panna confirm ah?`)) {
      return;
    }

    try {
      if (enquiry._id) {
        await apiRequest(`/enquiries/${enquiry._id}`, { method: "DELETE" });
      }
      setEnquiries((current) => current.filter((item) => (item._id || item.id) !== (enquiry._id || enquiry.id)));
      setMessage("Enquiry deleted.");
    } catch (error) {
      setMessage(error.message || "Enquiry delete failed.");
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Enquiry Form List</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Customer enquiry submissions.
        </p>
      </div>

      {message && (
        <p className="mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
          {message}
        </p>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-4 font-extrabold">Enquiry ID</th>
                <th className="px-5 py-4 font-extrabold">Name</th>
                <th className="px-5 py-4 font-extrabold">Phone</th>
                <th className="px-5 py-4 font-extrabold">Category</th>
                <th className="px-5 py-4 font-extrabold">Message</th>
                <th className="px-5 py-4 font-extrabold">Date</th>
                <th className="px-5 py-4 font-extrabold">Status</th>
                <th className="px-5 py-4 font-extrabold">Action</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry._id || enquiry.id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4 font-extrabold text-slate-950">{enquiry._id || enquiry.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{enquiry.name}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{enquiry.phone}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{enquiry.category || enquiry.email || "-"}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{enquiry.message}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">
                    {enquiry.date || (enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString("en-IN") : "-")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[enquiry.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => deleteEnquiry(enquiry)}
                      className="inline-flex h-9 items-center gap-1 rounded-full bg-red-50 px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
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
