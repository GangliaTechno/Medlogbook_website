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
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-6 lg:px-10 font-['Inter']">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <header className="space-y-1 px-1">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-blue-700 tracking-tight">
            Assigned Tasks
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Tasks assigned to you based on your department or specialty.
          </p>
        </header>

        {/* Tasks */}
        {filteredTasks.length > 0 ? (
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <div
                key={index}
                className="
                  bg-blue-50/60
                  border
                  border-blue-700
                  rounded-xl
                  px-4
                  py-4
                  sm:px-5
                  sm:py-4
                  shadow-sm
                  transition
                  sm:hover:shadow-blue-200
                  sm:hover:shadow-md
                "
              >
                {/* Title + Time */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm sm:text-lg font-semibold text-blue-900 leading-snug">
                    {task.title}
                  </h3>
                  <span className="text-xs text-blue-700 font-medium">
                    Assigned {timeSince(task.dateAssigned || task.createdAt)}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {task.description}
                </p>

                {/* Divider */}
                <div className="my-3 border-t border-blue-200" />

                {/* Meta info – stacked on mobile */}
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
                  <Meta label="Priority" value={task.priority} />
                  <Meta label="Target Date" value={formatDate(task.targetDate)} />
                  <Meta label="Department" value={task.department} />
                  <Meta label="Specialty" value={task.specialty} />
                  <Meta label="Assigned By" value={task.assignedBy} />
                  <Meta
                    label="Assigned To"
                    value={
                      task.selectedStudents?.length > 0
                        ? task.selectedStudents.join(", ")
                        : task.assignedTo?.length > 0 &&
                          !task.assignedTo.includes("all")
                        ? task.assignedTo.join(", ")
                        : "All in department"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No tasks assigned to you.</p>
        )}
      </div>
    </div>
  );
};

/* ---------- Meta Item ---------- */

const Meta = ({ label, value }) => (
  <div className="flex justify-between sm:flex-col">
    <span className="text-xs font-medium uppercase tracking-wide text-blue-700">
      {label}
    </span>
    <span className="text-sm font-semibold text-slate-900 text-right sm:text-left">
      {value || "—"}
    </span>
  </div>
);

export default AssignedTasksPage;
