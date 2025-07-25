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

const API_URL = "http://localhost:5000/api/auth";

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
        // Fetch user data
        const userResponse = await axios.get(
          `${API_URL}/userDetails/${userEmail}`
        );
        if (userResponse.data) {
          setUserData(userResponse.data);
        } else {
          throw new Error("No user data received");
        }

        // Fetch entries
        const formattedEmail =
          typeof userEmail === "object" ? userEmail.email : userEmail;
        const entriesResponse = await axios.get(
          `http://localhost:5000/api/logentry/${encodeURIComponent(
            formattedEmail
          )}`
        );
        if (Array.isArray(entriesResponse.data)) {
          setEntries(entriesResponse.data);
          setFilteredEntries(entriesResponse.data);  // initially show all
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
    setFilteredEntries([]);  // wait until user clicks Apply
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

    // Auto-close after 3 sec
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

  // ✅ Show success notification
  setNotification({
    isOpen: true,
    message: "Custom date range applied! Now you may proceed to download the report.",
    type: "success",
  });

  // ✅ Auto-close after 3 seconds
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
  
    // Header
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
  
      // TOC
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Table of Contents", 10, 20);
      autoTable(doc, {
        startY: 30,
        head: [["Section", "Page"]],
        body: [["Jobs", 2], ["Logbook Entries", 3], ["Other Activities", 4]],
      });
  
      // Jobs
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
  
      // Logbook Entries
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
  
      // Other Activities
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Other Activities", 10, 20);
      doc.setFontSize(12);
      doc.text("No activities have been performed that relate to this report section", 10, 30);
  
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 180, 290);
      }
  
      // Save file
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

  // ✅ Convert logo image to base64
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
            // ✅ Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "Medical Logbook Report",
                size: 48, // 24pt font (big title)
                bold: true,
                color: "2E74B5", // Blue color
              }),
            ],
          }),


          
          new Paragraph({ text: "", spacing: { after: 1000 } }),
          // ✅ User Info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Prepared for: ${capitalize(userData.fullName)}`,
                size: 28, // 14pt font
                color: "000000", // black
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
            
            // ✅ Logo image
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: base64Image.split(",")[1], // strip base64 prefix
                  transformation: { width: 250, height: 250 },
                }),
              ],
            }),
            
            new Paragraph({ children: [new PageBreak()] }),
            
            // ✅ Table of Contents
            new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "Table of Contents",
                size: 32,  // ✅ 16 is default; 32 means bigger
                bold: true,
                color: "2E74B5", // optional, makes it bluish like Word heading
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

            // ✅ New Page (Page Break)
            new Paragraph({ children: [new PageBreak()] }),

            // ✅ Jobs Section
            new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "Jobs",
                size: 32,  // ✅ 16 is default; 32 means bigger
                bold: true,
                color: "2E74B5", // optional, makes it bluish like Word heading
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

            // ✅ New Page
            new Paragraph({ children: [new PageBreak()] }),

            // ✅ Logbook Entries Section
            new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "Logbook Entries",
                size: 32,  // ✅ 16 is default; 32 means bigger
                bold: true,
                color: "2E74B5", // optional, makes it bluish like Word heading
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

                  // ✅ Add comments row
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

                  // ✅ Add score row
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

            // ✅ New Page
            new Paragraph({ children: [new PageBreak()] }),

            // ✅ Other Activities Section
            new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "Other Activities",
                size: 32,  // ✅ 16 is default; 32 means bigger
                bold: true,
                color: "2E74B5", // optional, makes it bluish like Word heading
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

    // ✅ Save .docx
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Medical_Logbook_Report_${new Date().toISOString().split("T")[0]}.docx`);
    });
  });
};


  return (
    <div className="flex text-black">
      <div className="flex-1 p-5">
        
        <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Create Report</h2>
        {loading ? (
          <p>Loading user details...</p>
        ) : error ? (
          <p className="text-[#721c24] bg-[#f8d7da] border-l-2 border-[#dc2545]">{error}</p>
        ) : (
          <>
            <p className="text-center text-teal-50">Download preformatted logbook reports.</p>
            <div className="grid gap-4 [&>div]:flex [&>div]:flex-col [&_label]:mb-1.5 [&_label]:font-bold [&_input]:p-3 [&_input]:mb-4 [&_input]:rounded-md [&_input]:border-0 [&_input]:bg-white/20 [&_input]:placeholder:text-gray-300 [&_select]:p-3 [&_select]:rounded-md [&_select]:border [&_select]:border-gray-300 [&_select]:text-gray-300 [&_select]:bg-white/20 [&_select]:mb-4 [&_option]:white">
              <div>
                <label>Name *</label>
                <input type="text" value={userData.fullName || ""} readOnly 
                style={{
    width: "100%",
    background: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "20px",
    marginTop: "15px",
    boxShadow: "#cff0ff 0px 10px 10px -5px",
    borderInline: "2px solid transparent",
    color: "#000",
    outline: "none",
    fontSize: "14px"
  }}
  onFocus={(e) =>
    (e.target.style.borderInline = "2px solid #12b1d1")
  }
  onBlur={(e) =>
    (e.target.style.borderInline = "2px solid transparent")
  }/>
              </div>
              <div>
                <label>Report *</label>
                <select style={{
    width: "100%",
    background: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "20px",
    marginTop: "15px",
    boxShadow: "#cff0ff 0px 10px 10px -5px",
    borderInline: "2px solid transparent",
    color: "#000",
    outline: "none",
    fontSize: "14px"
  }}
  onFocus={(e) =>
    (e.target.style.borderInline = "2px solid #12b1d1")
  }
  onBlur={(e) =>
    (e.target.style.borderInline = "2px solid transparent")
  }>
                  <option>Logbook Report</option>
                </select>
              </div>
              <div>
                <label>Report Format *</label>
                <select
                  value={reportFormat}
                  onChange={(e) =>
                    dispatch(setReportFormat(e.target.value))
                  }
                  style={{
    width: "100%",
    background: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "20px",
    marginTop: "15px",
    boxShadow: "#cff0ff 0px 10px 10px -5px",
    borderInline: "2px solid transparent",
    color: "#000",
    outline: "none",
    fontSize: "14px"
  }}
  onFocus={(e) =>
    (e.target.style.borderInline = "2px solid #12b1d1")
  }
  onBlur={(e) =>
    (e.target.style.borderInline = "2px solid transparent")
  }
                >
                  <option>Summary Report</option>
                  <option>Full Disclosure Report</option>
                </select>
              </div>
              <div>
                <label>Report File Type *</label>
                <select
                  value={reportFileType}
                  onChange={(e) =>
                    dispatch(setReportFileType(e.target.value))
                  }
                  style={{
    width: "100%",
    background: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "20px",
    marginTop: "15px",
    boxShadow: "#cff0ff 0px 10px 10px -5px",
    borderInline: "2px solid transparent",
    color: "#000",
    outline: "none",
    fontSize: "14px"
  }}
  onFocus={(e) =>
    (e.target.style.borderInline = "2px solid #12b1d1")
  }
  onBlur={(e) =>
    (e.target.style.borderInline = "2px solid transparent")
  }
                >
                  <option>PDF (non-editable format)</option>
                  <option>Docx (editable format)</option>
                </select>
              </div>
              <div>
              <label>Date Filter *</label>
              <select
                onChange={(e) => handleDateFilter(e.target.value)}
                className="p-3 rounded-md border border-gray-300 text-gray-300 bg-white/20 mb-4"
                style={{
    width: "100%",
    background: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "20px",
    marginTop: "15px",
    boxShadow: "#cff0ff 0px 10px 10px -5px",
    borderInline: "2px solid transparent",
    color: "#000",
    outline: "none",
    fontSize: "14px"
  }}
  onFocus={(e) =>
    (e.target.style.borderInline = "2px solid #12b1d1")
  }
  onBlur={(e) =>
    (e.target.style.borderInline = "2px solid transparent")
  }
              >
                <option value="all">Complete Report (All Entries)</option>
                <option value="10days">Last 10 Days</option>
                <option value="1month">Last 1 Month</option>
                <option value="1year">Last 1 Year</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>

            {/* ✅ Show Custom Date Inputs only if filter === "custom" */}
            {selectedFilter === "custom" && (
              <div className="flex gap-4 mb-4">
                <div>
                  <label>From *</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="p-3 rounded-md border border-gray-300 text-gray-300 bg-white/20"
                    style={{
    width: "100%",
    background: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "20px",
    marginTop: "15px",
    boxShadow: "#cff0ff 0px 10px 10px -5px",
    borderInline: "2px solid transparent",
    color: "#000",
    outline: "none",
    fontSize: "14px"
  }}
  onFocus={(e) =>
    (e.target.style.borderInline = "2px solid #12b1d1")
  }
  onBlur={(e) =>
    (e.target.style.borderInline = "2px solid transparent")
  }
                  />
                </div>
                <div>
                  <label>To *</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="p-3 rounded-md border border-gray-300 text-gray-300 bg-white/20"
                    style={{
    width: "100%",
    background: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "20px",
    marginTop: "15px",
    boxShadow: "#cff0ff 0px 10px 10px -5px",
    borderInline: "2px solid transparent",
    color: "#000",
    outline: "none",
    fontSize: "14px"
  }}
  onFocus={(e) =>
    (e.target.style.borderInline = "2px solid #12b1d1")
  }
  onBlur={(e) =>
    (e.target.style.borderInline = "2px solid transparent")
  }
                  />
                </div>
                {/* Apply Button */}
                <button
                  type="button"
                  onClick={applyCustomRange}
                  className="bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white px-6 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition duration-300 mx-auto block"
                >
                  Apply
                </button>
                </div>
            )}
              {/* Download Button */}
              <button
              onClick={() => {
                if (reportFileType.startsWith("PDF")) {
                  generatePDF();
                } else {
                  generateDocx();
                }
              }}
              className="bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white px-6 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition duration-300 mx-auto block"
            >
              Download Report
            </button>
            </div>
          </>
        )}
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


