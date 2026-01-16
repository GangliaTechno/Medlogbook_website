import React, { useEffect, useState } from "react";
import { FaEnvelope, FaCheckCircle, FaClock, FaUser, FaInfoCircle } from "react-icons/fa";
import Notification from "../Components/Notification";
import medicalBg from "../assets/medicalBg.png";

const AdminSupportPage = () => {
  const [queries, setQueries] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  /* ================= FETCH QUERIES ================= */
  useEffect(() => {
    fetch("https://medlogbook-website.onrender.com/api/support/all")
      .then((res) => res.json())
      .then((data) => setQueries(data))
      .catch(() => {
        setNotification({
          isOpen: true,
          title: "Error",
          message: "Failed to load support queries",
          type: "error",
        });
      });
  }, []);

  /* ================= RESOLVE QUERY ================= */
  const handleResolve = async (id) => {
    try {
      const res = await fetch(
        `https://medlogbook-website.onrender.com/api/support/resolve/${id}`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error();

      setQueries((prev) =>
        prev.map((q) =>
          q._id === id ? { ...q, status: "resolved" } : q
        )
      );

      setNotification({
        isOpen: true,
        title: "Success",
        message: "Query marked as resolved",
        type: "success",
      });
    } catch {
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Failed to resolve query",
        type: "error",
      });
    }
  };

  /* ================= FILTER ================= */
  const filteredQueries =
    filter === "all"
      ? queries
      : queries.filter((q) => q.status === filter);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex justify-center px-3 py-6 sm:px-6 sm:py-10"
      style={{ backgroundImage: `url(${medicalBg})` }}
    >
      {/* MAIN GLASS PANEL */}
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/50">

        {/* Header Section */}
        <div className="p-6 sm:p-10 text-center border-b border-gray-100">
          <h2 className="text-2xl sm:text-4xl font-black text-blue-700 tracking-tight">
            Support Queries
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Manage and respond to user support requests
          </p>
        </div>

        {/* Filter Section - Responsive Scrollable on Mobile */}
        <div className="p-4 sm:p-6 bg-gray-50/50">
          <div className="grid grid-cols-3 sm:flex sm:flex-nowrap justify-center gap-2 sm:gap-3">
            {["pending", "resolved", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 sm:px-6 py-2.5 rounded-xl font-bold text-[10px] sm:text-sm uppercase tracking-wider transition-all shadow-sm flex items-center justify-center
                  ${filter === f
                    ? f === "pending" ? "bg-amber-400 text-amber-900"
                      : f === "resolved" ? "bg-emerald-500 text-white"
                        : "bg-blue-600 text-white"
                    : "bg-white text-gray-400 hover:text-gray-600 border border-gray-100"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 sm:p-10 space-y-6 flex-1">
          {filteredQueries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <FaInfoCircle className="text-5xl mb-4 opacity-20" />
              <p className="text-lg font-medium">No {filter} queries found</p>
            </div>
          ) : (
            filteredQueries.map((query) => (
              <div
                key={query._id}
                className="bg-white rounded-3xl border border-blue-100 shadow-md hover:shadow-xl transition-shadow p-5 sm:p-8"
              >
                <div className="flex flex-col gap-4">
                  {/* Status & Date Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border
                      ${query.status === "resolved"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                        : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                      {query.status}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                      <FaClock /> {new Date(query.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-blue-400 uppercase">User Details</p>
                      <p className="text-gray-900 font-bold text-sm sm:text-base">{query.studentName}</p>
                      <p className="text-gray-500 text-xs truncate">{query.studentEmail}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-blue-400 uppercase">Issue Category</p>
                      <p className="text-blue-700 font-bold text-sm sm:text-base">{query.supportType}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Message Detail</p>
                    <p className="text-gray-700 text-sm leading-relaxed italic">
                      "{query.detail}"
                    </p>
                  </div>

                  {/* Actions - Stacks on Mobile */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={`mailto:${query.studentEmail}?subject=Support Response: ${query.supportType}`}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                                 bg-blue-600 text-white font-bold text-sm shadow-lg hover:bg-blue-700 transition active:scale-95"
                    >
                      <FaEnvelope /> Send Email
                    </a>

                    {query.status !== "resolved" && (
                      <button
                        onClick={() => handleResolve(query._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                                   bg-emerald-500 text-white font-bold text-sm shadow-lg hover:bg-emerald-600 transition active:scale-95"
                      >
                        <FaCheckCircle /> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() =>
          setNotification({ ...notification, isOpen: false })
        }
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default AdminSupportPage;