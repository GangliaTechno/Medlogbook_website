import React, { useEffect, useState } from "react";
import GoalProgression from "../pages/GoalProgression";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const COLORS = ["#2563eb", "#0ea5e9", "#22c55e", "#f59e0b"];

const AnalysisPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/");
      return;
    }

    const userEmail = user.email.email || user.email;

    fetch(
      `https://medlogbook-website.onrender.com/api/logentry/${encodeURIComponent(
        userEmail
      )}`
    )
      .then((res) => res.json())
      .then(setEntries)
      .catch(console.error);
  }, [user, navigate]);

  /* ---------------- DATA ---------------- */

  const totalEntries = entries.length;

  const categoryCounts = Object.entries(
    entries.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, value]) => ({ category, value }));

  const entriesByMonth = Object.entries(
    entries.reduce((acc, e) => {
      const d = new Date(e.createdAt || new Date());
      const key = `${d.toLocaleString("default", {
        month: "short",
      })} ${d.getFullYear()}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([month, value]) => ({ month, value }));

  const categoryPercentage = categoryCounts.map((c) => ({
    name: c.category,
    value: totalEntries
      ? Number(((c.value / totalEntries) * 100).toFixed(1))
      : 0,
  }));

  /* ---------------- UI ---------------- */

  return (
    <div
      className="
        min-h-[100dvh]
        bg-slate-50
        px-4
        py-6
        pt-20
        pl-16
        sm:px-6
        sm:pt-6
        sm:pl-6
        lg:px-10
        font-['Inter']
      "
    >
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <header>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900">
            Analysis
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-3xl">
            Overview of your clinical activity, trends, and performance.
          </p>
        </header>

        {/* SUMMARY */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Entries" value={totalEntries} />
          <StatCard label="Active Categories" value={categoryCounts.length} />
          <StatCard
            label="Most Active Month"
            value={entriesByMonth.at(-1)?.month || "-"}
          />
          <StatCard
            label="Avg / Month"
            value={
              entriesByMonth.length
                ? Math.round(totalEntries / entriesByMonth.length)
                : 0
            }
          />
        </section>

        {/* ACTIVITY TREND */}
        <section className="space-y-4">
          <SectionTitle title="Activity Trend" />
          <Card>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={entriesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </section>

        {/* DISTRIBUTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <SectionTitle title="Entries by Category" />
            <Card>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="space-y-4">
            <SectionTitle title="Category Share" />
            <Card>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categoryPercentage}
                    dataKey="value"
                    outerRadius={90}
                  >
                    {categoryPercentage.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </section>

        {/* GOALS */}
        <section className="space-y-4 relative z-50">
          <SectionTitle title="Goals & Progress" />
          <Card allowOverflow>
            <GoalProgression />
          </Card>
        </section>

      </div>
    </div>
  );
};

/* ---------------- UI PRIMITIVES ---------------- */

const SectionTitle = ({ title }) => (
  <h2 className="text-sm sm:text-base font-semibold text-slate-800">
    {title}
  </h2>
);

const Card = ({ children, allowOverflow = false }) => (
  <div
    className={`
      bg-white
      border
      border-slate-200
      rounded-lg
      p-4
      sm:p-6
      shadow-sm
      ${allowOverflow ? "overflow-visible relative z-50" : "overflow-hidden"}
    `}
  >
    {children}
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 text-xl font-semibold text-slate-900">
      {value}
    </p>
  </div>
);

export default AnalysisPage;
