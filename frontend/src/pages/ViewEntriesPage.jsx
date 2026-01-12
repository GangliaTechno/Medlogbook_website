import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Notification from "../Components/Notification";

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-black">
      {/* HEADER */}
      <h2 className="text-xl sm:text-2xl font-semibold text-center text-blue-600 mb-6">
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
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
                {entry.category}
              </h3>

              {/* DATA */}
              <div className="space-y-2 text-sm">
                {Object.entries(entry.data).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:gap-2"
                  >
                    <span className="font-medium text-slate-700 capitalize">
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
                          Download file
                        </a>
                      ) : (
                        value || "N/A"
                      )}
                    </span>
                  </div>
                ))}

                {entry.comments && (
                  <div className="pt-2">
                    <span className="font-medium text-slate-700">
                      Doctor’s Comments:
                    </span>
                    <p className="text-slate-800 mt-1">
                      {entry.comments}
                    </p>
                  </div>
                )}

                {entry.score !== null && entry.score !== undefined && (
                  <div>
                    <span className="font-medium text-slate-700">
                      Score:
                    </span>{" "}
                    <span className="text-slate-900 font-semibold">
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
            mt-6
            w-full sm:w-auto
            px-6
            py-3
            text-white
            font-semibold
            rounded-xl
            bg-gradient-to-r from-blue-600 to-cyan-500
            shadow
            hover:opacity-95
            transition
          "
        >
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
  );
};

export default ViewEntriesPage;
