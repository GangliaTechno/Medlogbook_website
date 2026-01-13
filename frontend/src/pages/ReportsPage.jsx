import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import gangliaLogo from "../assets/ganglia-logo.png";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, SimpleField, HeadingLevel, PageBreak, ImageRun } from "docx";
import { saveAs } from "file-saver";

import {
  setFromDate,
  setToDate,
  setReportFormat,
  setReportFileType,
} from "../reducers/reportsReducer";
import "../styles.css";
import Notification from "../Components/Notification";

const API_URL = "https://medlogbook-website.onrender.com/api/auth";

const ReportsPage = () => {
  const dispatch = useDispatch();

  const userEmail = useSelector((state) => state.auth.user?.email);
  const { fromDate, toDate, reportFormat, reportFileType } = useSelector(
    (state) => state.reports
  );

  const [userData, setUserData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) {
        setNotification({
          isOpen: true,
          message: "User email not available. Please log in again.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get(
          `${API_URL}/userDetails/${userEmail}`
        );
        if (userResponse.data) {
          setUserData(userResponse.data);
        } else {
          throw new Error("No user data received");
        }

        const formattedEmail =
          typeof userEmail === "object" ? userEmail.email : userEmail;
        const entriesResponse = await axios.get(
          `https://medlogbook-website.onrender.com/api/logentry/${encodeURIComponent(
            formattedEmail
          )}`
        );
        if (Array.isArray(entriesResponse.data)) {
          setEntries(entriesResponse.data);
          setFilteredEntries(entriesResponse.data);
        } else {
          throw new Error("No entries data received");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const handleDateFilter = (filterType) => {
    setSelectedFilter(filterType);

    if (filterType === "custom") {
      setFilteredEntries([]);
      return;
    }

    let fromDate;
    const now = new Date();

    switch (filterType) {
      case "10days":
        fromDate = new Date();
        fromDate.setDate(now.getDate() - 10);
        break;
      case "1month":
        fromDate = new Date();
        fromDate.setMonth(now.getMonth() - 1);
        break;
      case "1year":
        fromDate = new Date();
        fromDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
      default:
        setFilteredEntries(entries);
        return;
    }

    const filtered = entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= fromDate && entryDate <= now;
    });

    setFilteredEntries(filtered);
  };

  const applyCustomRange = () => {
    if (!customFrom || !customTo) {
      setNotification({
        isOpen: true,
        message: "Please select both From and To dates!",
        type: "error",
      });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
      return;
    }

    const from = new Date(customFrom);
    const to = new Date(customTo);

    const filtered = entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= from && entryDate <= to;
    });

    setFilteredEntries(filtered);

    setNotification({
      isOpen: true,
      message: "Custom date range applied! Now you may proceed to download the report.",
      type: "success",
    });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isOpen: false }));
    }, 3000);
  };

  const generatePDF = () => {
    if (!userData) {
      setNotification({
        isOpen: true,
        message: "User details are missing! Cannot generate report.",
        type: "error",
      });
      return;
    }

    const capitalize = (str) =>
      str
        .toString()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

    const beautifyKey = (key) =>
      key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    const title = "Medical Logbook Report";
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 20);

    doc.setFontSize(14);
    const lines = [
      `Prepared for: ${capitalize(userData.fullName || "N/A")}`,
      `Hospital: ${capitalize(userData.selectedHospital || "N/A")}`,
      `Specialty: ${capitalize(userData.selectedSpecialty || "N/A")}`,
      `Training Year: ${capitalize(userData.selectedTrainingYear || "N/A")}`,
      `Reporting Period: ${fromDate} - ${toDate}`,
    ];

    let y = 30;
    lines.forEach((line) => {
      const textWidth = doc.getTextWidth(line);
      doc.text(line, (pageWidth - textWidth) / 2, y);
      y += 10;
    });

    const img = new Image();
    img.src = gangliaLogo;

    img.onload = function () {
      doc.addImage(img, "PNG", 75, y + 10, 70, 70);

      doc.addPage();
      doc.setFontSize(16);
      doc.text("Table of Contents", 10, 20);
      autoTable(doc, {
        startY: 30,
        head: [["Section", "Page"]],
        body: [["Jobs", 2], ["Logbook Entries", 3], ["Other Activities", 4]],
      });

      doc.addPage();
      doc.setFontSize(16);
      doc.text("Jobs", 10, 20);
      autoTable(doc, {
        startY: 30,
        body: [
          ["Training Year", capitalize(userData.selectedTrainingYear || "N/A")],
          ["Specialty", capitalize(userData.selectedSpecialty || "N/A")],
        ],
      });

      doc.addPage();
      doc.setFontSize(16);
      doc.text("Logbook Entries", 10, 30);

      if (filteredEntries.length > 0) {
        filteredEntries.forEach((entry, index) => {
          const entryTitleY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 30;
          doc.setFontSize(14);
          doc.text(`Entry ${index + 1}: ${capitalize(entry.category)}`, 10, entryTitleY);

          const rows = Object.entries(entry.data).map(([key, value]) => {
            const isLink =
              typeof value === "string" &&
              (value.toLowerCase().startsWith("http") || value.toLowerCase().startsWith("/uploads"));

            const displayValue = isLink ? value : capitalize(value || "N/A");

            return [beautifyKey(key), displayValue];
          });

          if (entry.comments) {
            rows.push(["Doctor's Comments", capitalize(entry.comments)]);
          }

          if (entry.score !== null && entry.score !== undefined) {
            rows.push(["Score", `${entry.score} / 100`]);
          }

          autoTable(doc, {
            startY: entryTitleY + 10,
            margin: { bottom: 30 },
            body: rows,
            theme: "grid",
            styles: { fontSize: 11 },
          });
        });
      } else {
        doc.setFontSize(12);
        doc.text("No log entries available.", 10, 40);
      }

      doc.addPage();
      doc.setFontSize(16);
      doc.text("Other Activities", 10, 20);
      doc.setFontSize(12);
      doc.text("No activities have been performed that relate to this report section", 10, 30);

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 180, 290);
      }

      doc.save(`Medical_Logbook_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    };
  };

  const generateDocx = () => {
    if (!userData) {
      setNotification({
        isOpen: true,
        message: "User details are missing! Cannot generate report.",
        type: "error",
      });
      return;
    }

    const capitalize = (str) =>
      str?.toString().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || "N/A";

    const beautifyKey = (key) =>
      key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

    const imgPromise = fetch(gangliaLogo)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
      );

    imgPromise.then((base64Image) => {
      const doc = new Document({
        sections: [
          {
            properties: {
              footers: {
                default: new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun("Page "),
                    new SimpleField("PAGE"),
                    new TextRun(" of "),
                    new SimpleField("NUMPAGES"),
                  ],
                }),
              },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
                children: [
                  new TextRun({
                    text: "Medical Logbook Report",
                    size: 48,
                    bold: true,
                    color: "2E74B5",
                  }),
                ],
              }),

              new Paragraph({ text: "", spacing: { after: 1000 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Prepared for: ${capitalize(userData.fullName)}`,
                    size: 28,
                    color: "000000",
                  }),
                ],
              }),
              new Paragraph({ text: "", spacing: { after: 20 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Hospital: ${capitalize(userData.selectedHospital)}`,
                    size: 28,
                    color: "000000",
                  }),
                ],
              }),
              new Paragraph({ text: "", spacing: { after: 20 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Specialty: ${capitalize(userData.selectedSpecialty)}`,
                    size: 28,
                    color: "000000",
                  }),
                ],
              }),
              new Paragraph({ text: "", spacing: { after: 20 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Training Year: ${capitalize(userData.selectedTrainingYear)}`,
                    size: 28,
                    color: "000000",
                  }),
                ],
              }),
              new Paragraph({ text: "", spacing: { after: 20 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Reporting Period: ${fromDate} - ${toDate}`,
                    size: 28,
                    color: "000000",
                  }),
                ],
              }),

              new Paragraph({ text: "", spacing: { after: 3500 } }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: base64Image.split(",")[1],
                    transformation: { width: 250, height: 250 },
                  }),
                ],
              }),

              new Paragraph({ children: [new PageBreak()] }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: "Table of Contents",
                    size: 32,
                    bold: true,
                    color: "2E74B5",
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `1. Jobs`,
                    size: 28,
                    color: "000000",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `2. Logbook Entries`,
                    size: 28,
                    color: "000000",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `3. Other Activities`,
                    size: 28,
                    color: "000000",
                  }),
                ],
              }),

              new Paragraph({ text: "", spacing: { after: 300 } }),

              new Paragraph({ children: [new PageBreak()] }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: "Jobs",
                    size: 32,
                    bold: true,
                    color: "2E74B5",
                  }),
                ],
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("Training Year")] }),
                      new TableCell({ children: [new Paragraph(capitalize(userData.selectedTrainingYear))] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("Specialty")] }),
                      new TableCell({ children: [new Paragraph(capitalize(userData.selectedSpecialty))] }),
                    ],
                  }),
                ],
              }),

              new Paragraph({ text: "", spacing: { after: 300 } }),

              new Paragraph({ children: [new PageBreak()] }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: "Logbook Entries",
                    size: 32,
                    bold: true,
                    color: "2E74B5",
                  }),
                ],
              }),
              ...(filteredEntries.length > 0
                ? filteredEntries.flatMap((entry, index) => {
                  const rows = Object.entries(entry.data).map(([key, value]) => {
                    const displayValue = typeof value === "string" ? capitalize(value) : String(value);
                    return new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(beautifyKey(key))] }),
                        new TableCell({ children: [new Paragraph(displayValue)] }),
                      ],
                    });
                  });

                  if (entry.comments) {
                    rows.push(
                      new TableRow({
                        children: [
                          new TableCell({ children: [new Paragraph("Doctor's Comments")] }),
                          new TableCell({ children: [new Paragraph(capitalize(entry.comments))] }),
                        ],
                      })
                    );
                  }

                  if (entry.score !== null && entry.score !== undefined) {
                    rows.push(
                      new TableRow({
                        children: [
                          new TableCell({ children: [new Paragraph("Score")] }),
                          new TableCell({ children: [new Paragraph(`${entry.score} / 100`)] }),
                        ],
                      })
                    );
                  }

                  return [
                    new Paragraph({
                      text: `Entry ${index + 1}: ${capitalize(entry.category)}`,
                      heading: HeadingLevel.HEADING3,
                      spacing: { after: 200 },
                    }),
                    new Table({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      rows,
                    }),
                    new Paragraph({ text: "", spacing: { after: 300 } }),
                  ];
                })
                : [
                  new Paragraph({
                    text: "No log entries available.",
                    italics: true,
                  }),
                ]),

              new Paragraph({ children: [new PageBreak()] }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: "Other Activities",
                    size: 32,
                    bold: true,
                    color: "2E74B5",
                  }),
                ],
              }),
              new Paragraph({
                text: "No activities have been performed that relate to this report section.",
                italics: true,
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `Medical_Logbook_Report_${new Date().toISOString().split("T")[0]}.docx`);
      });
    });
  };

  return (
    <div className="font-['Manrope'] min-h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-10 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight mb-3">
            Generate Reports
          </h1>
          <p className="text-slate-500 text-lg">
            Export your logbook data for annual reviews or personal records.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-500"></div>

          <div className="p-8 sm:p-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading your profile...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                <p className="text-red-600 font-medium mb-2">Something went wrong</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                  <div className="bg-slate-50 border border-slate-200 text-slate-500 rounded-xl px-4 py-3 text-sm font-medium">
                    {userData.fullName || "N/A"}
                  </div>
                </div>

                {/* Report Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Report Type</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow cursor-pointer">
                      <option>Logbook Report</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {/* Format & File Type Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Format</label>
                    <div className="relative">
                      <select
                        value={reportFormat}
                        onChange={(e) => dispatch(setReportFormat(e.target.value))}
                        className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow cursor-pointer"
                      >
                        <option>Summary Report</option>
                        <option>Full Disclosure Report</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">File Format</label>
                    <div className="relative">
                      <select
                        value={reportFileType}
                        onChange={(e) => dispatch(setReportFileType(e.target.value))}
                        className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow cursor-pointer"
                      >
                        <option>PDF (Read-only)</option>
                        <option>Docx (Editable)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Date Range</label>
                  <div className="relative">
                    <select
                      onChange={(e) => handleDateFilter(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow cursor-pointer"
                    >
                      <option value="all">All Time</option>
                      <option value="10days">Last 10 Days</option>
                      <option value="1month">Last Month</option>
                      <option value="1year">Last Year</option>
                      <option value="custom">Custom Range...</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {/* Custom Date Inputs */}
                {selectedFilter === "custom" && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-4 items-end animate-fadeIn">
                    <div className="w-full">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">From</label>
                      <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-full">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">To</label>
                      <input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={applyCustomRange}
                      className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (reportFileType.startsWith("PDF")) {
                        generatePDF();
                      } else {
                        generateDocx();
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                  >
                    Download Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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

export default ReportsPage;