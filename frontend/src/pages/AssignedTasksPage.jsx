import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const AssignedTasksPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const specialtiesIndia = ["Allergy", "Cardiology", "Dermatology", "Emergency medicine"];
  const specialtiesOther = ["Oncology", "Pediatrics", "Neurology"];
  const allSpecialties = [...specialtiesIndia, ...specialtiesOther];

  useEffect(() => {
    if (user) fetchAllTasks();
  }, [user]);

  const fetchAllTasks = async () => {
    try {
      const allFetchedTasks = [];

      for (const spec of allSpecialties) {
        const res = await axios.get(
          `https://medlogbook-website.onrender.com/api/tasks?specialty=${spec}`
        );
        allFetchedTasks.push(...res.data);
      }

      const userTasks = allFetchedTasks
        .filter((task) => {
          const assignedToSelected = task.selectedStudents?.includes(user.email);
          const assignedToDirect = task.assignedTo?.includes(user.email);
          const assignedToDept =
            (!task.selectedStudents || task.selectedStudents.length === 0) &&
            (!task.assignedTo || task.assignedTo.length === 0 || task.assignedTo.includes("all")) &&
            task.department === user.department;

          return assignedToSelected || assignedToDirect || assignedToDept;
        })
        .sort(
          (a, b) =>
            new Date(b.dateAssigned || b.createdAt) -
            new Date(a.dateAssigned || a.createdAt)
        );

      setFilteredTasks(userTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  const timeSince = (dateString) => {
    if (!dateString) return "Unknown";
    const diff = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    if (hrs < 24) return `${hrs} hr ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div
      className="
      max-w-7xl
      mx-auto
      pt-6
      px-4
      pb-24
      sm:pt-8
      sm:px-6
      lg:px-10
      min-h-fullwhen
      bg-gradient-to-br from-blue-50 via-white to-blue-50
      rounded-3xl
      shadow-sm
      border
      border-slate-100
    "
    >
      <div className="space-y-8 sm:space-y-10">

        {/* Header */}
        <header className="border-b border-slate-100 pb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight">
            Assigned Tasks
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Tasks assigned to you based on your department or specialty. Prioritize and complete them efficiently.
          </p>
        </header>

        {/* Tasks */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTasks.map((task, index) => (
              <div
                key={index}
                className={`
                  group
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-5
                  sm:p-6
                  shadow-sm
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  flex flex-col
                  h-full
                  border-l-4
                  ${task.priority === 'High' ? 'border-l-red-500' :
                    task.priority === 'Medium' ? 'border-l-amber-500' :
                      'border-l-green-500'}
                `}
              >
                {/* Top Row: Priority & Time */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${task.priority === 'High' ? 'bg-red-50 text-red-600' :
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                        'bg-green-50 text-green-600'}
                  `}>
                    {task.priority || "Low Priority"}
                  </div>
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    {timeSince(task.dateAssigned || task.createdAt)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {task.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                  {task.description}
                </p>

                {/* Spacer to push footer down */}
                <div className="mt-auto"></div>

                {/* Divider */}
                <div className="h-px bg-slate-100 w-full mb-4 group-hover:bg-blue-50 transition-colors" />

                {/* Footer Meta Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <MetaItem icon="📅" label="Due Date" value={formatDate(task.targetDate)} />
                  <MetaItem icon="🏥" label="Dept" value={task.department} />
                  <MetaItem icon="🩺" label="Specialty" value={task.specialty} />
                  <MetaItem icon="👤" label="By" value={task.assignedBy} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">All Caught Up!</h3>
            <p className="text-slate-500 max-w-sm mt-2">
              You have no pending tasks assigned at the moment. Enjoy your free time!
            </p>
          </div>
        )}
      </div>
    </div >
  );
};

/* ---------- Meta Item ---------- */

const MetaItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <span className="text-base opacity-70" title={label}>{icon}</span>
    <span className="text-slate-600 font-medium truncate" title={value}>
      {value || "—"}
    </span>
  </div>
);

export default AssignedTasksPage;
