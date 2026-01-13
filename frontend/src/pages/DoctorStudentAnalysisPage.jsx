import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const DoctorStudentAnalysisPage = () => {
  const [studentScores, setStudentScores] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const doctor = useSelector((state) => state.auth.user);
  // ✅ Popup State
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStudentEntries, setSelectedStudentEntries] = useState([]);


  // ✅ Fetch Student List
  useEffect(() => {
    if (!doctor || doctor.role !== "doctor") {
      navigate("/login");
      return;
    }

    fetch(`https://medlogbook-website.onrender.com/api/auth/users?specialty=${encodeURIComponent(doctor.specialty)}`)
      .then((response) => response.json())
      .then((students) => {
        const studentPromises = students.map((student) =>
          fetch(`https://medlogbook-website.onrender.com/api/logentry/average-score/${encodeURIComponent(student.email)}`)
            .then((res) => res.json())
            .then((data) => ({
              name: student.fullName,
              averageScore: Math.min((data.averageScore || 0), 100),
              email: student.email,
            }))
        );

        Promise.all(studentPromises).then((results) => {
          setStudentScores(results);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error("Error fetching student scores:", error);
        setLoading(false);
      });
  }, [doctor, navigate]);

  // ✅ Fetch Selected Student's Log Entries
  useEffect(() => {
    if (selectedStudent) {
      fetch(`https://medlogbook-website.onrender.com/api/logentry/${encodeURIComponent(selectedStudent)}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("📊 Fetched log entries:", data);
          setEntries(data);
        })
        .catch((err) => console.error("Error fetching log entries:", err));
    }
  }, [selectedStudent]);

  // ✅ Handle View Entries Button Click
  const handleViewEntries = (studentEmail) => {
    setSelectedStudent(studentEmail);
    setIsPopupOpen(true);

    // Fetch the entries for the selected student
    fetch(`https://medlogbook-website.onrender.com/api/logentry/${encodeURIComponent(studentEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Fetched log entries for selected student:", data);
        setSelectedStudentEntries(data);
      })
      .catch((err) => console.error("Error fetching student log entries:", err));
  };



  // ✅ Entries per Category
  const getCategoryCounts = () => {
    const counts = {};
    entries.forEach((entry) => {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({
      category,
      entries: count,
    }));
  };

  // ✅ Average Score per Category
  const getAverageScores = () => {
    const scores = {};
    entries.forEach((entry) => {
      if (entry.score !== null && entry.score !== undefined) {
        if (!scores[entry.category]) scores[entry.category] = { total: 0, count: 0 };
        scores[entry.category].total += entry.score;
        scores[entry.category].count += 1;
      }
    });
    return Object.entries(scores).map(([category, { total, count }]) => ({
      category,
      averageScore: (total / count).toFixed(2),
    }));
  };

  // ✅ Entries Per Month
  const getEntriesPerMonth = () => {
    const monthCounts = {};
    entries.forEach((entry) => {
      const date = new Date(entry.data.date || entry.createdAt || new Date());
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    });
    return Object.entries(monthCounts)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([month, count]) => ({ month, entries: count }));
  };

  // ✅ Category Percentages
  const getCategoryPercentage = () => {
    const counts = {};
    entries.forEach((entry) => {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    });

    const totalEntries = entries.length;

    return Object.entries(counts).map(([category, count]) => ({
      name: category,
      value: parseFloat(((count / totalEntries) * 100).toFixed(2)),
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50">





      <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6 text-center"
        style={{
          color: "rgb(16, 137, 211)"
        }}>Student Average Scores</h2>

      {/* Student Average Score Chart */}
      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : studentScores.some(student => student.averageScore > 0) ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={studentScores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="averageScore" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-red-500">No entries yet. Please check again later.</p>
      )}

      {/* Student List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Students List</h2>

        {/* ================= DESKTOP / TABLET TABLE ================= */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email ID</th>
                <th className="px-4 py-2 border">Average Score</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentScores.map((student, index) => (
                <tr key={index} className="text-center">
                  <td className="px-4 py-2 border">{student.name}</td>
                  <td className="px-4 py-2 border">{student.email}</td>
                  <td className="px-4 py-2 border">{student.averageScore}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleViewEntries(student.email)}
                    >
                      View Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE VIEW (CARDS) ================= */}
        <div className="sm:hidden space-y-4">
          {studentScores.map((student, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 border"
            >
              <p className="text-sm">
                <span className="font-semibold">Name:</span> {student.name}
              </p>
              <p className="text-sm break-all">
                <span className="font-semibold">Email:</span> {student.email}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Average Score:</span>{" "}
                {student.averageScore}
              </p>

              <button
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
                onClick={() => handleViewEntries(student.email)}
              >
                View Analysis
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Student Analysis Popup */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50"

          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-8 relative w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
              onClick={() => setIsPopupOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">
              Analysis for {selectedStudent}
            </h2>

            {/* Check if the student has entries */}
            {entries.length === 0 || getAverageScores().every((item) => item.averageScore === "0.00") ? (
              <p className="text-center text-red-500 font-semibold text-lg py-6">
                No entries yet. Please check again later.
              </p>
            ) : (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                {/* Entries Per Category */}
                <div className="p-5 rounded-lg shadow-md border border-gray-200 white50">
                  <h2 className="text-center text-xl font-semibold mb-5">Entries Per Category</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getCategoryCounts()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="entries" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Average Score Per Category */}
                <div className="p-5 rounded-lg shadow-md border border-gray-200 white50">
                  <h2 className="text-center text-xl font-semibold mb-5">Average Score Per Category</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={getAverageScores()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Score" dataKey="averageScore" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Entries Per Month */}
                <div className="p-5 rounded-lg shadow-md border border-gray-200 white50">
                  <h2 className="text-center text-xl font-semibold mb-5">Entries Per Month</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getEntriesPerMonth()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="entries" stroke="#ff7300" strokeWidth={2} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Contribution */}
                <div className="p-5 rounded-lg shadow-md border border-gray-200 white50">
                  <h2 className="text-center text-xl font-semibold mb-5">Category Contribution (%)</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getCategoryPercentage()}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        fill="#8884d8"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      >
                        {getCategoryPercentage().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  );
};

export default DoctorStudentAnalysisPage;


