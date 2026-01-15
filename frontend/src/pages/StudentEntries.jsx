import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Notification from "../Components/Notification";
import parseCsvBreakdown from "../utils/parseCsvBreakdown";
import {
  FaArrowLeft,
  FaUserGraduate,
  FaClipboardList,
  FaCheckCircle,
  FaSearch,
  FaCalendarAlt,
  FaEraser,
  FaStethoscope,
  FaFileAlt,
  FaDownload,
  FaCommentMedical,
  FaStar,
  FaRobot,
  FaEdit,
  FaChevronDown,
  FaPaperPlane,
  FaUpload,
  FaTrash,
  FaPlus,
  FaMapMarkerAlt,
  FaUserFriends,
  FaUserMd,
  FaVenusMars,
  FaCheckDouble,
  FaShieldAlt,
  FaNotesMedical,
  FaHashtag,
  FaFileUpload,
  FaSave,
  FaRegEdit
} from "react-icons/fa";
import studentPanelBg from "../assets/studentPanelBg.png";


const StudentEntries = () => {

  const USE_MOCK_AI_SUMMARY = true;

  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student || {};
  const [summaries, setSummaries] = useState({});
  const [isSummarizing, setIsSummarizing] = useState({});

  const [editingSummary, setEditingSummary] = useState({});

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


  const [reviewedEntries, setReviewedEntries] = useState([]);
  const [notReviewedEntries, setNotReviewedEntries] = useState([]);
  const [selectedTab, setSelectedTab] = useState("not-reviewed");
  const [comments, setComments] = useState({});
  const [scores, setScores] = useState({});
  const [enhanceComment, setEnhanceComment] = useState({});
  const [scoreBreakdown, setScoreBreakdown] = useState({});
  const [scoresBreakdownVisible, setScoresBreakdownVisible] = useState({});

  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    if (student.email) {
      fetch(
        `https://medlogbook-website.onrender.com/api/logentry/review-status/${encodeURIComponent(
          student.email
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          setReviewedEntries(data.reviewed);
          setNotReviewedEntries(data.notReviewed);
        })
        .catch((error) =>
          console.error(`Error fetching logs for ${student.email}:`, error)
        );
    }
  }, [student]);

  const rawEntries =
    selectedTab === "reviewed" ? reviewedEntries : notReviewedEntries;

  const displayedEntries = rawEntries.filter((entry) => {
    const matchesCategory = entry.categoryName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const entryDate = entry.data?.Date
      ? new Date(entry.data.Date).toISOString().slice(0, 10)
      : null;

    const matchesDate = filterDate === "" || entryDate === filterDate;

    return matchesCategory && matchesDate;
  });

  const isUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const handleCommentChange = (entryId, value) => {
    setComments({ ...comments, [entryId]: value });
  };

  const handleScoreChange = (entryId, value) => {
    setScores({ ...scores, [entryId]: value });
  };


  const handleLabelChange = (entryId, index, newLabel) => {
    setScoreBreakdown((prev) => {
      const updated = [...(prev[entryId] || [])];
      updated[index] = { ...updated[index], label: newLabel };
      return { ...prev, [entryId]: updated };
    });
  };

  const handleValueChange = (entryId, index, value) => {
    setScoreBreakdown((prev) => {
      const updated = [...(prev[entryId] || [])];
      updated[index] = { ...updated[index], value: Number(value) };
      return { ...prev, [entryId]: updated };
    });

    setScores((prev) => {
      const updated = [...(scoreBreakdown[entryId] || [])];
      updated[index] = { ...updated[index], value: Number(value) };
      const total = updated.reduce((acc, item) => acc + (item.value || 0), 0);
      return { ...prev, [entryId]: total };
    });
  };

  const handleMaxChange = (entryId, index, value) => {
    setScoreBreakdown((prev) => {
      const updated = [...(prev[entryId] || [])];
      updated[index] = { ...updated[index], max: Number(value) };
      return { ...prev, [entryId]: updated };
    });
  };

  const addBreakdown = (entryId) => {
    setScoreBreakdown((prev) => ({
      ...prev,
      [entryId]: [
        ...(prev[entryId] || []),
        { label: "", value: 0, max: 10 },
      ],
    }));
  };

  const removeBreakdown = (entryId, index) => {
    const updated = [...(scoreBreakdown[entryId] || [])];
    updated.splice(index, 1);
    const total = updated.reduce((acc, item) => acc + Number(item.value || 0), 0);
    setScoreBreakdown((prev) => ({ ...prev, [entryId]: updated }));
    setScores((prev) => ({ ...prev, [entryId]: total }));
  };

  const handleReviewSubmit = async (entryId) => {
    const comment = comments[entryId];
    const score = scores[entryId];

    if (!comment || !score) {
      setNotification({
        isOpen: true,
        message: "Please enter both comment and score before submitting.",
        type: "warning",
      });
      return;
    }

    try {
      const response = await fetch("https://medlogbook-website.onrender.com/api/logentry/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId,
          comments: comment,
          score: score,
          enhance: enhanceComment[entryId] || false,
          scoreBreakdown: scoreBreakdown[entryId] || [],
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setNotification({
          isOpen: true,
          message: `Review submitted:\nComment: ${comment}\nScore: ${score}`,
          type: "success",
        });

        setReviewedEntries([...reviewedEntries, result.updatedEntry]);
        setNotReviewedEntries(
          notReviewedEntries.filter((entry) => entry._id !== entryId)
        );
        setComments((prev) => ({ ...prev, [entryId]: "" }));
        setScores((prev) => ({ ...prev, [entryId]: "" }));
        setEnhanceComment((prev) => ({ ...prev, [entryId]: false }));
        setScoreBreakdown((prev) => ({ ...prev, [entryId]: [] }));
      } else {
        setNotification({
          isOpen: true,
          message: `Error: ${result.error}`,
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        isOpen: true,
        message: "Failed to submit review.",
        type: "error",
      });
    }
  };

  const handleGenerateSummary = async (entry) => {
    const entryId = entry._id;
    setIsSummarizing((prev) => ({ ...prev, [entryId]: true }));

    /* ===========================
       🧪 DEMO / MOCK AI RESPONSE
       =========================== */
    if (USE_MOCK_AI_SUMMARY) {
      setTimeout(() => {
        const demoSummary = `
This entry describes a clinical admission involving a ${entry.data?.Age || "young"} year old ${entry.data?.Gender || "patient"
          } who was clerked in the ${entry.data?.Location || "department"}.

The patient presented with ${entry.data?.Problem || "a documented medical concern"} and was assessed appropriately.
Initial evaluation and documentation were completed as per clinical standards.

The recorded outcome for this encounter was "${entry.data?.Outcome || "reviewed"}".
Overall, the entry demonstrates appropriate clinical reasoning, documentation quality, and patient management.
      `.trim();

        setSummaries((prev) => ({
          ...prev,
          [entryId]: demoSummary,
        }));

        setNotification({
          isOpen: true,
          message: "Demo AI summary generated successfully.",
          type: "success",
        });

        setIsSummarizing((prev) => ({ ...prev, [entryId]: false }));
      }, 1200); // simulate AI processing delay

      return; // ⛔ skip real API
    }

    /* ===========================
       🔥 REAL GEMINI FLOW (UNCHANGED)
       =========================== */
    try {
      const formData = new FormData();
      const dataWithoutPII = { ...entry.data };
      delete dataWithoutPII.Name;
      delete dataWithoutPII.PatientName;
      delete dataWithoutPII.Location;

      formData.append("entryData", JSON.stringify(dataWithoutPII));

      // If a file is present, append it (only first file if multiple)
      for (const key in entry.data) {
        if (
          typeof entry.data[key] === "string" &&
          entry.data[key].startsWith("/uploads/")
        ) {
          const fileUrl = `https://medlogbook-website.onrender.com${entry.data[key]}`;
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          formData.append("file", blob, "attachedFile.txt");
          break; // only attach one file
        }
      }

      const response = await fetch(
        "https://medlogbook-website.onrender.com/api/ai/summarize",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSummaries((prev) => ({ ...prev, [entryId]: data.summary }));
        setNotification({
          isOpen: true,
          message: "Summary generated successfully.",
          type: "success",
        });
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Summary generation failed:", error);
      setNotification({
        isOpen: true,
        message: "Failed to generate summary.",
        type: "error",
      });
    } finally {
      setIsSummarizing((prev) => ({ ...prev, [entryId]: false }));
    }
  };


  return (
    <div
      className="w-full min-h-screen overflow-x-hidden p-4 sm:p-6"
      style={{
        backgroundImage: `url(${studentPanelBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >

      <button
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl mb-6 shadow-sm transition-all active:scale-95 font-bold"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        Back
      </button>


      <h2 className="text-xl md:text-3xl font-black text-blue-600 mb-8 text-center flex items-center justify-center gap-3"
        style={{
          color: "rgb(16, 137, 211)"
        }}>
        <FaUserGraduate />
        Entries for {student.fullName}
      </h2>

      {/* Filters */}
      <div className="flex justify-center mb-6">
        <button
          className={`flex items-center gap-2 px-8 py-2.5 rounded-full mx-2 font-bold transition-all ${selectedTab === "not-reviewed"
            ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
            : "bg-blue-100 text-blue-500 hover:bg-blue-200"
            }`}
          onClick={() => setSelectedTab("not-reviewed")}
        >
          <FaClipboardList />
          Not Reviewed
        </button>
        <button
          className={`flex items-center gap-2 px-8 py-2.5 rounded-full mx-2 font-bold transition-all ${selectedTab === "reviewed"
            ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
            : "bg-blue-100 text-blue-500 hover:bg-blue-200"
            }`}
          onClick={() => setSelectedTab("reviewed")}
        >
          <FaCheckDouble />
          Reviewed
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="relative w-full sm:w-auto">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 rounded-2xl border border-slate-200 bg-white text-black placeholder:text-gray-400 w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none shadow-sm"
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="pl-12 pr-6 py-3 rounded-2xl border border-slate-200 bg-white text-black focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none shadow-sm"
          />
        </div>
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterDate("");
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all active:scale-95 shadow-sm"
        >
          <FaEraser />
          Clear Filters
        </button>
      </div>

      {/* Entries */}
      {displayedEntries.length === 0 ? (
        <p className="text-center text-gray-400">
          No {selectedTab.replace("-", " ")} entries found.
        </p>
      ) : (
        displayedEntries.map((entry) => (
          <div
            key={entry._id}
            className="relative p-4 md:p-6 mb-8"
            style={{
              borderRadius: "28px",
              background: "#ffffff",
              border: "1px solid #afd4f8",
              boxShadow: "0 10px 25px rgba(82, 173, 229, 0.12)"
            }}
          >

            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
              <FaStethoscope className="text-blue-500" /> {capitalize(entry.categoryName)}
            </h3>

            <div className="mb-4">
              {Object.entries(entry.data).map(([key, value]) => (
                <p key={key} className="text-slate-700 text-sm mb-3 flex items-start gap-2">
                  <span className="text-blue-400 mt-1 shrink-0">{getFieldIcon(key)}</span>
                  <span className="flex-1">
                    <strong className="text-slate-800 font-bold capitalize">{key.replace(/_/g, " ")}:</strong>{" "}
                    {typeof value === "string" && value.startsWith("/uploads/") ? (
                      <a
                        href={`https://medlogbook-website.onrender.com${value}`}
                        download
                        className="text-teal-600 underline"
                      >
                        📄 Download File
                      </a>
                    ) : typeof value === "string" && isUrl(value) ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 underline"
                      >
                        📄 View File
                      </a>
                    ) : typeof value === "string" ? (
                      capitalize(value)
                    ) : (
                      value || "N/A"
                    )}
                  </span>
                </p>
              ))}
            </div>

            {selectedTab === "reviewed" ? (
              <>
                <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <p className="text-slate-800 text-sm mb-2 flex items-center gap-2">
                    <FaCommentMedical className="text-blue-500" />
                    <strong className="font-bold">Doctor's Comments:</strong>
                    <span className="italic">"{entry.comments}"</span>
                  </p>
                  <p className="text-slate-800 text-sm flex items-center gap-2">
                    <FaStar className="text-amber-400" />
                    <strong className="font-bold">Score:</strong>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-black text-xs">
                      {entry.score} / 100
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col w-full">
                  <div className="relative">
                    <FaCommentMedical className="absolute left-4 top-4 text-slate-300 pointer-events-none" />
                    <textarea
                      className="w-full min-h-[100px] pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-black resize-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                      placeholder="Write your professional feedback here..."
                      value={comments[entry._id] || ""}
                      onChange={(e) =>
                        handleCommentChange(entry._id, e.target.value)
                      }
                    />
                  </div>
                  <button
                    onClick={() => handleGenerateSummary(entry)}
                    disabled={isSummarizing[entry._id]}
                    className="group flex items-center justify-center gap-3 text-sm mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSummarizing[entry._id] ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FaRobot className="text-lg animate-pulse" />
                    )}
                    {isSummarizing[entry._id] ? "Processing AI Summary..." : "Generate AI Medical Summary"}
                  </button>
                  {summaries[entry._id] && (
                    <div className="mt-4 bg-white p-5 rounded-xl border-l-4 border-teal-500 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-blue-700 text-sm flex items-center gap-2">
                          <FaRobot />
                          AI Generated Medical Summary
                        </strong>

                        <button
                          onClick={() =>
                            setEditingSummary((prev) => ({
                              ...prev,
                              [entry._id]: !prev[entry._id],
                            }))
                          }
                          className="text-xs text-blue-600 hover:underline"
                        >
                          <span className="flex items-center gap-1">
                            {editingSummary[entry._id] ? <FaSave /> : <FaRegEdit />}
                            {editingSummary[entry._id] ? "Save" : "Edit"}
                          </span>
                        </button>
                      </div>

                      {editingSummary[entry._id] ? (
                        <textarea
                          className="w-full min-h-[120px] p-3 rounded-md border bg-gray-50 text-black"
                          value={summaries[entry._id]}
                          onChange={(e) =>
                            setSummaries((prev) => ({
                              ...prev,
                              [entry._id]: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <p className="text-gray-800 whitespace-pre-line leading-relaxed text-sm">
                          {summaries[entry._id]}
                        </p>
                      )}
                    </div>
                  )}

                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`enhance-${entry._id}`}
                      checked={enhanceComment[entry._id] || false}
                      onChange={(e) =>
                        setEnhanceComment((prev) => ({
                          ...prev,
                          [entry._id]: e.target.checked,
                        }))
                      }
                    />
                    <label
                      htmlFor={`enhance-${entry._id}`}
                      className="text-slate-700 font-bold text-sm cursor-pointer flex items-center gap-2"
                    >
                      <FaEdit className="text-blue-400" />
                      AI Enhance Feedback?
                    </label>
                  </div>

                  <div className="relative">
                    <FaStar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Score"
                      className="w-24 py-2 pl-9 pr-2 rounded-xl bg-slate-100 text-slate-800 font-black border-none text-center outline-none"
                      value={scores[entry._id] || ""}
                      readOnly
                    />
                  </div>

                  <button
                    onClick={() =>
                      setScoresBreakdownVisible((prev) => ({
                        ...prev,
                        [entry._id]: !prev[entry._id],
                      }))
                    }
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <FaChevronDown className={`transition-transform duration-300 ${scoresBreakdownVisible[entry._id] ? "rotate-180" : ""}`} />
                    Detailed Scoring
                  </button>

                  <button
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-lg shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 transition-all active:scale-95"
                    onClick={() => handleReviewSubmit(entry._id)}
                  >
                    <FaPaperPlane />
                    Submit Review
                  </button>
                </div>

                {scoresBreakdownVisible[entry._id] && (
                  <div className="mt-4 w-full bg-slate-50/50 rounded-3xl border border-slate-100 p-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="border-2 border-dashed border-blue-200 rounded-2xl p-4 mb-6 bg-white flex items-center gap-4 group hover:border-blue-400 transition-all">
                      <div className="bg-blue-50 p-3 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <FaUpload size={20} />
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept=".csv"
                          id={`csv-upload-${entry._id}`}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const csvText = evt.target.result;
                              // Parse CSV: label,value,max, skip header if present
                              let lines = csvText.split(/\r?\n/).filter(Boolean);
                              if (lines.length && lines[0].toLowerCase().replace(/\s/g, "") === "label,value,max") {
                                lines = lines.slice(1);
                              }
                              const parsedBreakdown = lines.map((line) => {
                                const [label, value, max] = line.split(",").map((s) => s.trim());
                                return {
                                  label: label || "",
                                  value: value ? Number(value) : 0,
                                  max: max ? Number(max) : 10,
                                };
                              });
                              setScoreBreakdown((prev) => ({
                                ...prev,
                                [entry._id]: parsedBreakdown,
                              }));
                              setScores((prev) => ({
                                ...prev,
                                [entry._id]: parsedBreakdown.reduce((acc, item) => acc + (item.value || 0), 0),
                              }));
                            };
                            reader.readAsText(file);
                          }}
                          className="hidden"
                        />
                        <label htmlFor={`csv-upload-${entry._id}`} className="cursor-pointer">
                          <p className="text-sm font-black text-slate-800">Import Scoring Criteria</p>
                          <p className="text-xs text-slate-500">Click to upload .csv template</p>
                        </label>
                      </div>
                    </div>

                    <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                      <FaClipboardList className="text-blue-500" />
                      Detailed Breakdown
                    </h3>
                    <div className="flex flex-col gap-2">
                      {(() => {
                        const breakdown = scoreBreakdown[entry._id] || [];
                        // Remove heading row if present (label,value,max)
                        const filteredBreakdown = breakdown.filter(
                          item => item.label.toLowerCase().replace(/\s/g, "") !== "label"
                        );
                        // Find all main labels (no colon)
                        const mainLabels = filteredBreakdown.filter(item => !item.label.includes(":"));
                        // For each main label, find its sublabels
                        return mainLabels.map((mainItem, mainIdx) => {
                          const subLabels = breakdown
                            .map((item, idx) => ({ ...item, idx }))
                            .filter(item => item.label.startsWith(mainItem.label + ":"));
                          // If there are sublabels, main max and value are sum of sublabel maxes/values; otherwise, use main label's own
                          const mainMax = subLabels.length > 0
                            ? subLabels.reduce((acc, sub) => acc + (sub.max || 0), 0)
                            : mainItem.max;
                          const mainValue = subLabels.length > 0
                            ? subLabels.reduce((acc, sub) => acc + (sub.value || 0), 0)
                            : mainItem.value || 0;
                          const mainIdxInBreakdown = breakdown.findIndex(item => item === mainItem);
                          return (
                            <React.Fragment key={mainItem.label + mainIdx}>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Label"
                                  value={mainItem.label}
                                  onChange={e => handleLabelChange(entry._id, breakdown.indexOf(mainItem), e.target.value)}
                                  className="bg-white border text-black text-sm font-semibold rounded px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                  readOnly={subLabels.length > 0}
                                  style={subLabels.length > 0 ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                                />
                                <div className="flex gap-2 items-center bg-white rounded px-3 py-2 w-32 justify-center">
                                  {/* Main label value and max are sum of sublabels if present, else from CSV */}
                                  {subLabels.length > 0 ? (
                                    <>
                                      <span className="bg-gray-100 text-black text-sm font-semibold w-10 text-center rounded border border-gray-200">{mainValue}</span>
                                      <span className="text-black text-sm font-semibold">/</span>
                                      <span className="bg-gray-100 text-black text-sm font-semibold w-10 text-center rounded border border-gray-200">{mainMax}</span>
                                    </>
                                  ) : (
                                    <>
                                      <input
                                        type="number"
                                        min="0"
                                        value={mainItem.value || 0}
                                        onChange={e => handleValueChange(entry._id, breakdown.indexOf(mainItem), e.target.value)}
                                        className="bg-white text-black text-sm font-semibold w-10 text-center focus:outline-none"
                                      />
                                      <span className="text-black text-sm font-semibold">/</span>
                                      <input
                                        type="number"
                                        min="1"
                                        value={mainItem.max}
                                        onChange={e => handleMaxChange(entry._id, breakdown.indexOf(mainItem), e.target.value)}
                                        className="bg-white text-black text-sm font-semibold w-10 text-center focus:outline-none"
                                      />
                                    </>
                                  )}
                                </div>
                                <button
                                  onClick={() => removeBreakdown(entry._id, breakdown.indexOf(mainItem))}
                                  className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                  title="Remove"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                              {/* Render sublabels indented */}
                              {subLabels.map(subItem => (
                                <div
                                  key={subItem.label + subItem.idx}
                                  className="flex gap-2 items-center ml-8"
                                >
                                  <input
                                    type="text"
                                    placeholder="Sub-label"
                                    value={subItem.label.includes(":") ? subItem.label.split(":").slice(1).join(":") : subItem.label}
                                    onChange={e => {
                                      // When editing, update the full label (main:sublabel)
                                      const mainLabel = mainItem.label;
                                      const newSubLabel = e.target.value;
                                      handleLabelChange(entry._id, subItem.idx, mainLabel + ":" + newSubLabel);
                                    }}
                                    className="bg-white border text-black text-sm font-semibold rounded px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-teal-400 pl-8"
                                  />
                                  <div className="flex gap-2 items-center bg-white rounded px-3 py-2 w-32 justify-center">
                                    <input
                                      type="number"
                                      min="0"
                                      value={subItem.value || 0}
                                      onChange={e => handleValueChange(entry._id, subItem.idx, e.target.value)}
                                      className="bg-white text-black text-sm font-semibold w-10 text-center focus:outline-none"
                                    />
                                    <span className="text-black text-sm font-semibold">/</span>
                                    <input
                                      type="number"
                                      min="1"
                                      value={subItem.max}
                                      onChange={e => handleMaxChange(entry._id, subItem.idx, e.target.value)}
                                      className="bg-white text-black text-sm font-semibold w-10 text-center focus:outline-none"
                                    />
                                  </div>
                                  <button
                                    onClick={() => removeBreakdown(entry._id, subItem.idx)}
                                    className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title="Remove"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </div>
                              ))}
                            </React.Fragment>
                          );
                        });
                      })()}
                    </div>
                    <button
                      onClick={() => addBreakdown(entry._id)}
                      className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-black px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all"
                    >
                      <FaPlus size={12} />
                      Add Manual Criteria
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() =>
          setNotification((prev) => ({ ...prev, isOpen: false }))
        }
        title="Notification"
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default StudentEntries;