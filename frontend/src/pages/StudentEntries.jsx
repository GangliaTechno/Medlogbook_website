import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorSidebar from "../Components/DoctorSidebar";
import Notification from "../Components/Notification";
import parseCsvBreakdown from "../utils/parseCsvBreakdown";


const StudentEntries = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student || {};
  const [summaries, setSummaries] = useState({});
  const [isSummarizing, setIsSummarizing] = useState({});

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

  try {
    const formData = new FormData();
    const dataWithoutPII = { ...entry.data };
    delete dataWithoutPII.Name;
    delete dataWithoutPII.PatientName;
    delete dataWithoutPII.Location;

    formData.append("entryData", JSON.stringify(dataWithoutPII));

    // If a file is present, append it (only first file if multiple)
    for (const key in entry.data) {
      if (typeof entry.data[key] === "string" && entry.data[key].startsWith("/uploads/")) {
        const fileUrl = `https://medlogbook-website.onrender.com${entry.data[key]}`;
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        formData.append("file", blob, "attachedFile.txt");
        break; // only attach one file
      }
    }

    const response = await fetch("https://medlogbook-website.onrender.com/api/ai/summarize", {
      method: "POST",
      body: formData,
    });

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
    <div className="flex h-screen bg-white">
      <DoctorSidebar />

      <div className="flex-grow p-5 overflow-y-auto">
        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mb-4"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        
        <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Entries for {student.fullName}</h2>

        {/* Filters */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 rounded-full mx-2 ${
              selectedTab === "not-reviewed"
                ? "bg-blue-400 text-white"
                : "bg-blue-300 text-white"
            }`}
            onClick={() => setSelectedTab("not-reviewed")}
          >
            Not Reviewed
          </button>
          <button
            className={`px-6 py-2 rounded-full mx-2 ${
              selectedTab === "reviewed"
                ? "bg-blue-400 text-white"
                : "bg-blue-300 text-white"
            }`}
            onClick={() => setSelectedTab("reviewed")}
          >
            Reviewed
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-full border bg-white text-black placeholder:text-gray-500"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 rounded-full border bg-white text-black"
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterDate("");
            }}
            className="px-4 py-2 rounded-md bg-red-600 text-white"
          >
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
              className="relative bg-[#717c9350] p-6 rounded-lg mb-8 shadow-md"
               style={{
    borderRadius: "50px",
    background: "#e0e0e0ff",
    boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff"
  }}
            >
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <span>🩺</span> {capitalize(entry.categoryName)}
              </h3>

              <div className="mb-4">
                {Object.entries(entry.data).map(([key, value]) => (
                  <p key={key} className="text-black text-sm mb-2">
                    <strong>{capitalize(key.replace(/_/g, " "))}:</strong>{" "}
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
                  </p>
                ))}
              </div>

              {selectedTab === "reviewed" ? (
                <>
                  <p className="text-black text-sm mb-2">
                    <strong>Doctor's Comments:</strong> {entry.comments}
                  </p>
                  <p className="text-black text-sm">
                    <strong>Score:</strong> {entry.score}/100
                  </p>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col w-full">
                    <textarea
                      className="w-full min-h-[80px] p-3 rounded-md border border-gray-300 bg-white text-black resize-none"
                      placeholder="Write a comment..."
                      value={comments[entry._id] || ""}
                      onChange={(e) =>
                        handleCommentChange(entry._id, e.target.value)
                      }
                    />
                    <button
                      onClick={() => handleGenerateSummary(entry)}
                      disabled={isSummarizing[entry._id]}
                      className="text-xs mt-1 w-max bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md disabled:opacity-50"
                      style={{
    display: "block",
    width: "100%",
    fontWeight: "bold",
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    color: "white",
    paddingBlock: "15px",
    margin: "20px auto",
    borderRadius: "20px",
    boxShadow: "rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px",
    border: "none",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.03)";
    e.currentTarget.style.boxShadow = "rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px";
  }}
  onMouseDown={(e) => {
    e.currentTarget.style.transform = "scale(0.95)";
    e.currentTarget.style.boxShadow = "rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px";
  }}
  onMouseUp={(e) => {
    e.currentTarget.style.transform = "scale(1.03)";
    e.currentTarget.style.boxShadow = "rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px";
  }}
                    >
                      {isSummarizing[entry._id] ? "Generating..." : "Generate Summary from Entry"}
                    </button>
                    {summaries[entry._id] && (
                      <div className="mt-2 bg-white p-3 rounded-full text-sm text-blue border-l-4 border-teal-500"
                      >
                        <strong>Generated Summary:</strong> {summaries[entry._id]}
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
                        className="text-black"
                      >
                        Enhance comment
                      </label>
                    </div>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Score"
                      className="w-20 py-2 px-2 rounded-md bg-white text-black border text-center"
                      value={scores[entry._id] || ""}
                      readOnly
                      style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                    />

                    <button
                      onClick={() =>
                        setScoresBreakdownVisible((prev) => ({
                          ...prev,
                          [entry._id]: !prev[entry._id],
                        }))
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md"
                        style={{
    background: "linear-gradient(45deg, #8abff4ff, #7ab8f5)", // light blue tones
    boxShadow: "0 6px 12px rgba(122, 184, 245, 0.3)",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      Score Valuation ⬇
                    </button>

                    <button
                      className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md"
                       style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      onClick={() => handleReviewSubmit(entry._id)}
                    >
                      Submit Review
                    </button>
                  </div>

                  {scoresBreakdownVisible[entry._id] && (
                    <div className="mt-2 w-full max-w-2xl rounded bg-white shadow-sm p-6">
                      <div className="border-2 border-blue-300 rounded-lg p-3 mb-2 bg-blue-50 flex items-center gap-2">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const csvText = evt.target.result;
                              // Parse CSV: label,value,max, skip header if present
                              let lines = csvText.split(/\r?\n/).filter(Boolean);
                              if (lines.length && lines[0].toLowerCase().replace(/\s/g,"") === "label,value,max") {
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
                          className="mt-0"
                        />
                        <span className="text-xs text-blue-700 font-medium ml-2">Choose CSV file</span>
                      </div>

                      <h3 className="text-sm font-bold text-black mb-2">Score Breakdown</h3>
                      <div className="flex flex-col gap-2">
                        {(() => {
                          const breakdown = scoreBreakdown[entry._id] || [];
                          // Remove heading row if present (label,value,max)
                          const filteredBreakdown = breakdown.filter(
                            item => item.label.toLowerCase().replace(/\s/g,"") !== "label"
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
                                    className="ml-1 text-red-400 hover:text-red-600 text-base font-bold"
                                    title="Remove"
                                  >
                                    ✖
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
                                      className="ml-1 text-red-400 hover:text-red-600 text-base font-bold"
                                      title="Remove"
                                    >
                                      ✖
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
                        className="mt-2 text-xs text-blue-500 hover:underline font-semibold"
                      >
                        + Add Breakdown
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
    </div>
  );
};

export default StudentEntries;