import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";

const statusStyles = {
  Open: "bg-yellow-50 text-yellow-700",
  Replied: "bg-blue-50 text-blue-700",
  New: "bg-yellow-50 text-yellow-700",
  Contacted: "bg-blue-50 text-blue-700",
  Closed: "bg-green-50 text-green-700",
};

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEnquiries = async () => {
      try {
        const result = await apiRequest("/enquiries");
        setEnquiries(result.data || []);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load enquiries.");
      } finally {
        setLoading(false);
      }
    };

    loadEnquiries();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateValue));
  };

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
              {loading && (
                <tr>
                  <td className="px-5 py-8 text-center text-sm font-bold text-slate-500" colSpan="7">
                    Loading enquiries...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td className="px-5 py-8 text-center text-sm font-bold text-red-600" colSpan="7">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && enquiries.length === 0 && (
                <tr>
                  <td className="px-5 py-8 text-center text-sm font-bold text-slate-500" colSpan="7">
                    No enquiries found.
                  </td>
                </tr>
              )}

              {!loading && !error && enquiries.map((enquiry) => (
                <tr key={enquiry._id} className="border-b border-slate-100 text-sm">
                  <td className="px-5 py-4 font-extrabold text-slate-950">{enquiry._id?.slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{enquiry.name}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{enquiry.phone}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{enquiry.category || "-"}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">
                    {[enquiry.productDetails, enquiry.branch, enquiry.message].filter(Boolean).join(" | ") || "-"}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{formatDate(enquiry.createdAt)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[enquiry.status] || statusStyles.New}`}>
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
