import React, { useEffect, useState } from "react";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import Notification from "../Components/Notification";

const AdminSupport = () => {
  const [queries, setQueries] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [notification, setNotification] = useState({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
    });

  // ✅ Fetch queries
  useEffect(() => {
    fetch("http://localhost:5000/api/support/all")
      .then((res) => res.json())
      .then((data) => setQueries(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Handle resolve
  const handleResolve = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/support/resolve/${id}`, {
        method: "PUT",
      });

      if (res.ok) {
        setNotification({
        isOpen: true,
        title: "Success",
        message: "Marked as resolved",
        type: "success",
      });
        setQueries((prev) =>
          prev.map((q) => (q._id === id ? { ...q, status: "resolved" } : q))
        );
      } else {
        setNotification({
        isOpen: true,
        title: "Error",
        message: "Failed to mark as resolved",
        type: "error",
      });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Something went wrong",
        type: "error",
      });
    }
  };

  const filteredQueries = queries.filter((q) =>
    filter === "all" ? true : q.status === filter
  );

  return (
    <div className="ml-0 p-8 text-black  min-h-screen">
      
      <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Support Queries</h2>

      {/* ✅ Toggle Buttons */}
      <div className="mb-6 flex gap-3">
        {["pending", "resolved", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              filter === f
                ? f === "pending"
                  ? "bg-yellow-500 text-black"
                  : f === "resolved"
                  ? "bg-green-500 text-black"
                  : "bg-blue-500 text-black"
                : "bg-white hover:bg-white"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ✅ Query Cards */}
      <div className="space-y-6" 
      >
        {filteredQueries.map((query) => (
          <div
            key={query._id}
            className="bg-white p-6 rounded-lg shadow-lg"
            style={{
    borderRadius: "50px",
    background: "#e0e0e0",
    boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff"
  }}
          >
            <p className="mb-1">
              <span className="font-bold text-black">Name:</span>{" "}
              {query.studentName}
            </p>
            <p className="mb-1">
              <span className="font-bold text-black">Email:</span>{" "}
              {query.studentEmail}
            </p>
            <p className="mb-1">
              <span className="font-bold text-black">Type:</span>{" "}
              {query.supportType}
            </p>
            <p className="mb-1">
              <span className="font-bold text-black">Detail:</span>{" "}
              {query.detail}
            </p>
            <p className="mb-1">
              <span className="font-bold text-black">Status:</span>{" "}
              <span
                className={
                  query.status === "resolved" ? "text-green-600" : "text-yellow-600"
                }
              >
                {query.status}
              </span>
            </p>
            <p className="mb-4">
              <span className="font-bold text-black">Submitted:</span>{" "}
              {new Date(query.submittedAt).toLocaleString()}
            </p>

            {/* ✅ Action Buttons */}
            <div className="flex gap-3">
              {/* Send Email */}
              <a
                href={`mailto:${query.studentEmail}?subject=${encodeURIComponent(
                  "Support Response"
                )}&body=${encodeURIComponent(`Hi ${query.studentName},\n\n`)}`}
                className="px-10 py-2 rounded-[16px] cursor-pointer flex justify-center items-center gap-1.5 mt-2 text-white font-semibold transition-transform duration-200 shadow-md"
  style={{
    background: "linear-gradient(45deg, #b3d9ff, #7ab8f5)", // light blue tones
    boxShadow: "0 6px 12px rgba(122, 184, 245, 0.3)",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <FaEnvelope /> Send Email
              </a>

              {/* Mark Resolved */}
              {query.status !== "resolved" && (
                <button
                  onClick={() => handleResolve(query._id)}
                  className=" px-10 py-2 rounded-[20px] cursor-pointer font-semibold text-white shadow-md transition-transform duration-200"
  style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <FaCheckCircle /> Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}

        {/* No Queries */}
        {filteredQueries.length === 0 && (
          <p className="text-gray-400 text-lg">No {filter} queries found.</p>
        )}
      </div>
      {/* Notification Modal */}
            <Notification
              isOpen={notification.isOpen}
              onRequestClose={() => setNotification({ ...notification, isOpen: false })}
              title={notification.title}
              message={notification.message}
              type={notification.type}
            />
    </div>
  );
};

export default AdminSupport;
