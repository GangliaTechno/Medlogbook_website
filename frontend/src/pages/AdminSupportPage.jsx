import React, { useEffect, useState } from "react";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
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
    /* FULL PAGE MEDICAL BACKGROUND (MATCHES ACCOUNT PAGE) */
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center px-4 py-8"
      style={{ backgroundImage: `url(${medicalBg})` }}
    >
      {/* GLASS PANEL (MATCHED) */}
      <div className="w-full max-w-5xl bg-white/85 backdrop-blur-sm rounded-[32px] shadow-2xl p-8">
        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-blue-700 mb-2">
          Support Queries
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Manage and respond to user support requests
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {["pending", "resolved", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-semibold shadow transition
                ${
                  filter === f
                    ? f === "pending"
                      ? "bg-yellow-400 text-black"
                      : f === "resolved"
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                    : "bg-blue-200 text-blue-900"
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Query Cards */}
        <div className="space-y-8">
          {filteredQueries.length === 0 ? (
            <p className="text-center text-gray-500 py-24">
              No {filter} queries found
            </p>
          ) : (
            filteredQueries.map((query) => (
              <div
                key={query._id}
                className="bg-white rounded-[28px] border border-blue-200 shadow-lg p-6"
              >
                <div className="grid gap-2 text-gray-800 text-[16px]">
                  <p><strong>Name:</strong> {query.studentName}</p>
                  <p><strong>Email:</strong> {query.studentEmail}</p>
                  <p><strong>Type:</strong> {query.supportType}</p>
                  <p><strong>Detail:</strong> {query.detail}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        query.status === "resolved"
                          ? "text-green-600 font-semibold"
                          : "text-yellow-600 font-semibold"
                      }
                    >
                      {query.status}
                    </span>
                  </p>
                  <p>
                    <strong>Submitted:</strong>{" "}
                    {new Date(query.submittedAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <a
                    href={`mailto:${query.studentEmail}?subject=Support Response`}
                    className="flex items-center gap-2 px-6 py-2 rounded-full
                               bg-gradient-to-r from-blue-500 to-cyan-500
                               text-white font-semibold shadow hover:scale-105 transition"
                  >
                    <FaEnvelope /> Send Email
                  </a>

                  {query.status !== "resolved" && (
                    <button
                      onClick={() => handleResolve(query._id)}
                      className="flex items-center gap-2 px-6 py-2 rounded-full
                                 bg-gradient-to-r from-green-500 to-emerald-500
                                 text-white font-semibold shadow hover:scale-105 transition"
                    >
                      <FaCheckCircle /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notification */}
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
