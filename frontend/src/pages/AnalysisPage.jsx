import React, { useEffect, useState } from "react";
import GoalProgression from "../pages/GoalProgression"; // or wherever it's located
// Adjust the path as needed

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell
} from "recharts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const AnalysisPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    const userEmail = user.email.email || user.email;

    fetch(`http://localhost:5000/api/logentry/${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Fetched log entries:", data);
        setEntries(data);
      })
      .catch((err) => {
        console.error("Error fetching log entries:", err);
      });
  }, [user, navigate]);

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
    <div className="p-5">
      <div className="text-center mb-8">
  
  <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Student Analysis</h2>
  <p className="mt-2 text-gray-900 text-lg">Gain insights and track your progress over time</p>
</div>

      {entries.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 mt-10">
          <div className="p-5 rounded-lg shadow-md">
            <h2 className="text-center text-xl font-semibold mb-5 text-black">Entries Per Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getCategoryCounts()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fill: 'black', fontSize: 16 }} />
                <YAxis tick={{ fill: 'black', fontSize: 16 }} />
                <Tooltip />
                <Bar dataKey="entries" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-5 rounded-lg shadow-md">
            <h2 className="text-center text-xl font-semibold mb-5 text-black">Average Score Per Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={getAverageScores()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" tick={{ fill: 'black', fontSize: 16 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'black', fontSize: 16 }} />
                <Radar name="Score" dataKey="averageScore" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-5 rounded-lg shadow-md">
            <h2 className="text-center text-xl font-semibold mb-5 text-black">Entries Per Month</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getEntriesPerMonth()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: 'black', fontSize: 16 }} />
                <YAxis tick={{ fill: 'black', fontSize: 16 }} />
                <Tooltip />
                <Line type="monotone" dataKey="entries" stroke="#ff7300" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-5 rounded-lg shadow-md">
            <h2 className="text-center text-xl font-semibold mb-5 text-black">Category Contribution (%)</h2>
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
  <Pie
    data={getCategoryPercentage()}
    dataKey="value"
    nameKey="name"
    outerRadius={120}
    fill="#8884d8"
    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`} // Optional: better label
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
      ) : (
        <p className="mt-10 text-gray-500">Loading or no data available...</p>
      )}
       <hr className="my-10 border-gray-600" />
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">🎯 Goal Progression</h2>
        <div className="bg-white p-6 rounded-lg shadow">
  <GoalProgression />
</div>
      </div>
    </div>
  );
};

export default AnalysisPage;
