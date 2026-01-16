import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Notification from "../Components/Notification";
import {
  FaBook,
  FaFileAlt,
  FaCalendarAlt,
  FaStar,
  FaDownload,
  FaArrowLeft,
  FaCommentMedical,
  FaMapMarkerAlt,
  FaUserFriends,
  FaUserMd,
  FaVenusMars,
  FaStethoscope,
  FaCheckCircle,
  FaClipboardList,
  FaShieldAlt,
  FaNotesMedical,
  FaHashtag,
  FaFileUpload,
  FaEdit,
  FaSearch
} from "react-icons/fa";
import studentPanelBg from "../assets/studentPanelBg_updated.png";

const ViewEntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const getFieldIcon = (fieldName) => {
    const lower = fieldName.toLowerCase();
    if (lower.includes("location") || lower.includes("site")) return <FaMapMarkerAlt />;
    if (lower.includes("referral")) return <FaUserFriends />;
    if (lower.includes("role") || lower.includes("provider") || lower.includes("supervisor")) return <FaUserMd />;
    if (lower.includes("gender")) return <FaVenusMars />;
    if (lower.includes("specialty") || lower.includes("diagnosis")) return <FaStethoscope />;
    if (lower.includes("outcome") || lower.includes("result") || lower.includes("credits")) return <FaCheckCircle />;
    if (lower.includes("type") || lower.includes("category")) return <FaClipboardList />;
    if (lower.includes("supervision") || lower.includes("level")) return <FaShieldAlt />;
    if (lower.includes("procedure") || lower.includes("reflection") || lower.includes("learning")) return <FaNotesMedical />;
    if (lower.includes("date") || lower.includes("time")) return <FaCalendarAlt />;
    if (lower.includes("number") || lower.includes("count") || lower.includes("hours")) return <FaHashtag />;
    if (lower.includes("file") || lower.includes("upload") || lower.includes("attachment")) return <FaFileUpload />;
    return <FaEdit />;
  };

  useEffect(() => {
    if (!user || !user.email) {
      setNotification({
        isOpen: true,
        message: "Please log in to view entries.",
        type: "error",
      });
      navigate("/");
      return;
    }

    const userEmail = user.email.email || user.email;

    fetch(
      `https://medlogbook-website.onrender.com/api/logentry/${encodeURIComponent(
        userEmail
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch entries.");
        setLoading(false);
      });
  }, [user, navigate]);

  return (
    <div
      className="w-full min-h-screen px-4 sm:px-6 py-6 text-black"
      style={{
        backgroundImage: `url(${studentPanelBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-600 mb-8 flex items-center justify-center gap-3">
          <FaBook className="text-blue-500" />
          My Logbook Entries
        </h2>

        {/* LOADER */}
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-2 py-10">
            <div className="w-10 h-10 border-4 border-blue-300 border-dashed rounded-full animate-spin"></div>
            <p className="text-sm text-slate-600">Loading entries…</p>
          </div>
        )}

        {error && <p className="text-red-500 font-medium">{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <p className="text-slate-600 text-center">No log entries found.</p>
        )}

        {/* ENTRIES */}
        <div className="space-y-4">
          {!loading &&
            entries.map((entry) => (
              <div
                key={entry._id}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm"
              >
                {/* CATEGORY */}
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <FaFileAlt className="text-blue-500" />
                  {entry.category}
                </h3>

                {/* DATA */}
                <div className="space-y-2 text-sm">
                  {Object.entries(entry.data).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:gap-2"
                    >
                      <span className="font-bold text-slate-700 capitalize flex items-center gap-2 min-w-[140px]">
                        <span className="text-blue-400">{getFieldIcon(key)}</span>
                        {key.replace(/_/g, " ")}:
                      </span>

                      <span className="text-slate-800 break-all">
                        {typeof value === "string" &&
                          (value.startsWith("/uploads/") ||
                            value.startsWith("http")) ? (
                          <a
                            href={
                              value.startsWith("/uploads/")
                                ? `https://medlogbook-website.onrender.com${value}`
                                : value
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            <span className="flex items-center gap-1">
                              <FaDownload size={14} />
                              Download file
                            </span>
                          </a>
                        ) : (
                          value || "N/A"
                        )}
                      </span>
                    </div>
                  ))}

                  {entry.comments && (
                    <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <span className="font-bold text-blue-700 flex items-center gap-2 mb-1">
                        <FaCommentMedical />
                        Doctor’s Comments:
                      </span>
                      <p className="text-slate-800 text-sm italic">
                        "{entry.comments}"
                      </p>
                    </div>
                  )}

                  {entry.score !== null && entry.score !== undefined && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <span className="font-bold text-slate-700 flex items-center gap-2">
                        <FaStar className="text-amber-400" />
                        Score:
                      </span>{" "}
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-black">
                        {entry.score} / 100
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* BUTTON */}
        {!loading && (
          <button
            onClick={() => navigate("/jobs")}
            className="
              mt-8
              w-full sm:w-auto
              px-8
              py-4
              text-white
              font-bold
              rounded-2xl
              bg-gradient-to-r from-blue-600 to-cyan-500
              shadow-xl
              shadow-blue-200
              hover:shadow-blue-300
              hover:-translate-y-0.5
              transition-all
              flex
              items-center
              justify-center
              gap-3
              active:scale-95
            "
          >
            <FaArrowLeft />
            Back to Assignment History
          </button>
        )}

        {/* NOTIFICATION */}
        <Notification
          isOpen={notification.isOpen}
          onRequestClose={() =>
            setNotification({ ...notification, isOpen: false })
          }
          title="Notification"
          message={notification.message}
          type={notification.type}
        />
      </div>
    </div>
  );
};

export default ViewEntriesPage;
