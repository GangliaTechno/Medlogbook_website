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
    if (user) {
      fetchAllTasks();
    }
  }, [user]);

  const fetchAllTasks = async () => {
    try {
      const allFetchedTasks = [];

      for (const spec of allSpecialties) {
        const res = await axios.get(`https://medlogbook-website.onrender.com/api/tasks?specialty=${spec}`);
        allFetchedTasks.push(...res.data);
      }

      const userTasks = allFetchedTasks
        .filter((task) => {
          // Debug logging - you can remove this later
          console.log("Task:", task.title, {
            selectedStudents: task.selectedStudents,
            assignedTo: task.assignedTo,
            department: task.department,
            userDept: user.department,
            userEmail: user.email
          });

          // Check if assigned to specific students via selectedStudents field
          const assignedToStudentViaSelected = task.selectedStudents?.includes(user.email);
          
          // Check if assigned to specific students via assignedTo field (your current data structure)
          const assignedToStudentViaAssignedTo = task.assignedTo?.includes(user.email);
          
          // Check if assigned to department (when both selectedStudents and assignedTo are empty/null)
          const assignedToDept = 
            (!task.selectedStudents || task.selectedStudents.length === 0) &&
            (!task.assignedTo || task.assignedTo.length === 0 || task.assignedTo.includes("all")) &&
            task.department === user.department;

          const shouldInclude = assignedToStudentViaSelected || assignedToStudentViaAssignedTo || assignedToDept;
          console.log("Should include task:", shouldInclude, {
            assignedToStudentViaSelected,
            assignedToStudentViaAssignedTo,
            assignedToDept
          });
          
          return shouldInclude;
        })
        .sort((a, b) => {
          const dateA = new Date(a.dateAssigned || a.createdAt);
          const dateB = new Date(b.dateAssigned || b.createdAt);
          return dateB - dateA; // newest first
        });

      setFilteredTasks(userTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const timeSince = (dateString) => {
    if (!dateString) return "Unknown time";

    const past = new Date(dateString);
    if (isNaN(past.getTime())) return "Invalid date";

    const now = new Date();
    const diffMs = now - past;

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold text-blue-600 mb-6"
        style={{
          textAlign: "center",
          fontWeight: 900,
          fontSize: "30px",
          color: "rgb(16, 137, 211)"
        }}>My Assigned Tasks</h2>
      
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task, index) => (
          <div key={index} className="mb-4 p-6 relative" style={{
            borderRadius: "50px",
            background: "#e0e0e0",
            boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff"
          }}>
            <div className="absolute top-4 right-8 text-sm text-gray-500 font-medium">
              Assigned: {timeSince(task.dateAssigned || task.createdAt)}
            </div>
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Target Date:</strong> {formatDate(task.targetDate)}</p>
            <p><strong>Department:</strong> {task.department}</p>
            <p><strong>Assigned By:</strong> {task.assignedBy}</p>
            <p><strong>Specialty:</strong> {task.specialty}</p>
            <p><strong>Assigned To:</strong>
              {task.selectedStudents?.length > 0
                ? task.selectedStudents.join(", ")
                : task.assignedTo?.length > 0 && !task.assignedTo.includes("all")
                ? task.assignedTo.join(", ")
                : "All in department"}
            </p>
          </div>
        ))
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  );
};

export default AssignedTasksPage;