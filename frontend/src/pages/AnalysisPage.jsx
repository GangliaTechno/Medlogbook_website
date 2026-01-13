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
        font-['Manrope']
        max-w-7xl
        mx-auto
        pt-20
        px-4
        pb-10
        sm:pt-8
        sm:px-6
        lg:px-10
        min-h-full
        bg-gradient-to-br from-blue-50 via-white to-blue-50
        rounded-3xl
        shadow-sm
        border
        border-slate-100
      "
    >
      <div className="space-y-8 sm:space-y-10">

        {/* HEADER */}
        <header className="border-b border-slate-100 pb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight">
            Analysis & Trends
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Gain insights into your clinical activity. Track your logging frequency, category distribution, and progress towards your training goals.
          </p>
        </header>

        {/* SUMMARY STATS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard label="Total Entries" value={totalEntries} icon="📚" />
          <StatCard label="Categories" value={categoryCounts.length} icon="🏷️" />
          <StatCard
            label="Peak Month"
            value={entriesByMonth.at(-1)?.month?.split(' ')[0] || "-"}
            subValue={entriesByMonth.at(-1)?.month?.split(' ')[1] || ""}
            icon="📅"
          />
          <StatCard
            label="Avg / Month"
            value={
              entriesByMonth.length
                ? Math.round(totalEntries / entriesByMonth.length)
                : 0
            }
            icon="📊"
          />
        </section>

        {/* ACTIVITY TREND */}
        <section className="space-y-4">
          <SectionTitle title="Activity Trend" subtitle="Entries logged over time" />
          <Card>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={entriesByMonth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: "#1d4ed8", stroke: "white", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </section>

        {/* DISTRIBUTION & SHARE */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4">
            <SectionTitle title="Entries by Category" subtitle="Volume per category" />
            <Card>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryCounts} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="category"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="space-y-4">
            <SectionTitle title="Category Share" subtitle="Distribution percentage" />
            <Card>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryPercentage}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    cornerRadius={6}
                  >
                    {categoryPercentage.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend/Key could go here if needed, or simple percentage list */}
            </Card>
          </div>
        </section>

        {/* GOALS */}
        <section className="space-y-4 relative z-0">
          <SectionTitle title="Goals & Progress" subtitle="Track your target milestones" />
          <Card allowOverflow>
            <GoalProgression />
          </Card>
        </section>

      </div>
    </div>
  );
};

/* ---------------- UI PRIMITIVES ---------------- */

const SectionTitle = ({ title, subtitle }) => (
  <div className="flex flex-col">
    <h2 className="text-lg font-bold text-slate-800 tracking-tight">
      {title}
    </h2>
    {subtitle && <span className="text-xs text-slate-500 font-medium">{subtitle}</span>}
  </div>
);

const Card = ({ children, allowOverflow = false }) => (
  <div
    className={`
      bg-white
      border
      border-slate-200
      rounded-2xl
      p-5
      sm:p-6
      shadow-sm
      hover:shadow-md
      transition-shadow
      duration-300
      ${allowOverflow ? "overflow-visible" : "overflow-hidden"}
    `}
  >
    {children}
  </div>
);

const StatCard = ({ label, value, subValue, icon }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-32 sm:h-36 relative overflow-hidden group">
    {/* Decorative BG Element */}
    <div className="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] grayscale group-hover:scale-110 transition-transform duration-500 select-none">
      {icon}
    </div>

    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg opacity-80">{icon}</span>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
    </div>

    <div>
      <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        {value}
      </p>
      {subValue && <p className="text-xs text-slate-400 font-medium mt-0.5">{subValue}</p>}
    </div>
  </div>
);

export default AnalysisPage;
