import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Notification from "../Components/Notification";
import axios from "axios";
import {
  FaArrowLeft,
  FaTasks,
  FaFileAlt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaUserFriends,
  FaUserMd,
  FaBuilding
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";


const AssignTaskPage = () => {
  const doctor = useSelector((state) => state.auth.user);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showTasksPopup, setShowTasksPopup] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [assignmentType, setAssignmentType] = useState("department"); // department or students
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentsList, setStudentsList] = useState([]);

  useEffect(() => {
    if (doctor && doctor.role === "doctor") {
      fetchTasks();
      fetchStudents();
    }
  }, [doctor]);

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

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`https://medlogbook-website.onrender.com/api/tasks?assignedBy=${doctor.email}`);
      const sortedTasks = response.data.sort((a, b) => {
        const dateA = new Date(a.dateAssigned || a.createdAt);
        const dateB = new Date(b.dateAssigned || b.createdAt);
        return dateB - dateA; // newest first
      });
      setAssignedTasks(sortedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://medlogbook-website.onrender.com/api/students");
      setStudentsList(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };
  // In your AssignTaskPage.js, update the taskData object in handleSubmit function:

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor || doctor.role !== "doctor") {
      alert("Only doctors can assign tasks.");
      return;
    }

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      priority,
      targetDate: dueDate,
      assignedBy: doctor.email,
      specialty: doctor.specialty,
      assignmentType,
      department: assignmentType === "department" ? department : null,
      // Use assignedTo for consistency with your database structure
      assignedTo: assignmentType === "students" ? selectedStudents : [],
      // Keep selectedStudents for backward compatibility if needed
      selectedStudents: assignmentType === "students" ? selectedStudents : [],
    };

    try {
      const response = await axios.post("https://medlogbook-website.onrender.com/api/assign-task", taskData);
      if (response.status === 201) {
        setNotification({ message: "Task assigned successfully!", type: "success" });
        // Reset form fields
        setTaskTitle("");
        setTaskDescription("");
        setDueDate("");
        setPriority("");
        setDepartment("");
        setAssignmentType("department");
        setSelectedStudents([]);
        fetchTasks();
      }
    } catch (error) {
      setNotification({
        message: error.response?.data?.error || "Error assigning task",
        type: "error"
      });
      console.error("Error:", error);
    }
  };

  const handlePopupClose = (e) => {
    if (e.target.id === "tasks-popup") setShowTasksPopup(false);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div
      style={{
        maxWidth: "1350px",
        background: "linear-gradient(0deg, rgb(255, 255, 255) 0%, rgba(224, 225, 217, 1) 100%)",
        borderRadius: "40px",
        padding: "25px 35px",
        border: "5px solid rgb(255, 255, 255)",
        boxShadow: "rgba(133, 189, 215, 0.88) 0px 30px 30px -20px",
        margin: "20px auto",
        position: "relative"
      }}
    >

      <button
        onClick={() => setShowTasksPopup(true)}
        className="w-full md:w-auto md:absolute md:top-4 md:right-8 mt-0 mb-4 md:mt-0 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-6 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
      >
        <FaTasks />
        View Assigned Tasks
      </button>

      <h2 className="text-2xl font-bold text-blue-600 mb-6"
        style={{
          textAlign: "center",
          fontWeight: 900,
          fontSize: "30px",
          color: "rgb(37, 99, 235)"
        }}>Assign Task to Students</h2>

      {notification.message && (
        <Notification
          isOpen={!!notification.message}
          onRequestClose={() => setNotification({ message: "", type: "" })}
          message={notification.message}
          type={notification.type}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Task Title</label>
          <div className="flex items-center bg-white border border-slate-100 rounded-[20px] px-4 shadow-[#cff0ff_0px_10px_10px_-5px] focus-within:border-[#12b1d1] transition-all border-2 border-transparent">
            <FaTasks className="text-blue-500 mr-3" />
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full py-4 outline-none text-sm bg-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <div className="flex items-start bg-white border border-slate-100 rounded-[20px] px-4 shadow-[#cff0ff_0px_10px_10px_-5px] focus-within:border-[#12b1d1] transition-all border-2 border-transparent">
            <FaFileAlt className="text-blue-500 mr-3 mt-4" />
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Description"
              rows={4}
              className="w-full py-4 outline-none text-sm bg-transparent resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
          <div className="flex items-center bg-white border border-slate-100 rounded-[20px] px-4 shadow-[#cff0ff_0px_10px_10px_-5px] focus-within:border-[#12b1d1] transition-all border-2 border-transparent">
            <FaCalendarAlt className="text-blue-500 mr-3" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full py-4 outline-none text-sm bg-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Priority</label>
          <div className="flex items-center bg-white border border-slate-100 rounded-[20px] px-4 shadow-[#cff0ff_0px_10px_10px_-5px] focus-within:border-[#12b1d1] transition-all border-2 border-transparent">
            <FaExclamationTriangle className="text-blue-500 mr-3" />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full py-4 outline-none text-sm bg-transparent cursor-pointer"
              required
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Assign To</label>
          <div className="flex items-center bg-white border border-slate-100 rounded-[20px] px-4 shadow-[#cff0ff_0px_10px_10px_-5px] focus-within:border-[#12b1d1] transition-all border-2 border-transparent">
            <FaUserFriends className="text-blue-500 mr-3" />
            <select
              value={assignmentType}
              onChange={(e) => {
                setAssignmentType(e.target.value);
                setSelectedStudents([]);
                setDepartment("");
              }}
              className="w-full py-4 outline-none text-sm bg-transparent cursor-pointer"
            >
              <option value="department">Department</option>
              <option value="students">Specific Students</option>
            </select>
          </div>
        </div>

        {assignmentType === "department" && (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Department</label>
            <div className="flex items-center bg-white border border-slate-100 rounded-[20px] px-4 shadow-[#cff0ff_0px_10px_10px_-5px] focus-within:border-[#12b1d1] transition-all border-2 border-transparent">
              <FaBuilding className="text-blue-500 mr-3" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full py-4 outline-none text-sm bg-transparent cursor-pointer"
                required
              >
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Radiology">Radiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Emergency Medicine">Emergency Medicine</option>
              </select>
            </div>
          </div>
        )}

        {assignmentType === "students" && (
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2">Select Students</label>
            <div style={{
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
              fontSize: "14px",
              overflowY: "auto",
              maxHeight: "150px"

            }}
              onFocus={(e) =>
                (e.target.style.borderInline = "2px solid #12b1d1")
              }
              onBlur={(e) =>
                (e.target.style.borderInline = "2px solid transparent")
              }>
              {studentsList.map((student) => (
                <div key={student.email} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    value={student.email}
                    checked={selectedStudents.includes(student.email)}
                    onChange={(e) => {
                      const email = e.target.value;
                      let updated = [...selectedStudents];
                      if (e.target.checked) {
                        updated.push(email);
                      } else {
                        updated = updated.filter((s) => s !== email);
                      }
                      setSelectedStudents(updated);

                      const firstStudent = studentsList.find(s => s.email === updated[0]);
                      if (firstStudent) {
                        setDepartment(firstStudent.department);
                      } else {
                        setDepartment("");
                      }
                    }}
                    className="mr-2"
                  />
                  <span>
                    {student.fullName} ({student.email}) —{student.department}
                    <em className="text-sm text-gray-500">{student.department}</em>
                  </span>
                </div>
              ))}
            </div>

            <input
              type="text"
              value={department}
              disabled
              className="mt-3 w-full p-3 border rounded-lg white100 text-gray-700"
              placeholder="Auto-selected department"
            />
          </div>
        )}
        <button
          type="submit"
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
          Assign Task
        </button>

      </form>

      {showTasksPopup && (
        <div
          id="tasks-popup"
          onClick={handlePopupClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
        >
          <div className="bg-white/95 rounded-[40px] shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border-4 border-white">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <FaTasks className="text-blue-600" />
                Assigned Tasks
              </h3>
              <button
                onClick={() => setShowTasksPopup(false)}
                className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
              {assignedTasks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {assignedTasks.map((task, index) => {
                    const priorityColor =
                      task.priority === "High" ? "bg-red-500" :
                        task.priority === "Medium" ? "bg-amber-500" : "bg-emerald-500";

                    const priorityBorder =
                      task.priority === "High" ? "border-l-red-500" :
                        task.priority === "Medium" ? "border-l-amber-500" : "border-l-emerald-500";

                    return (
                      <div key={index} className={`group relative bg-white rounded-3xl p-6 border-2 border-slate-100 ${priorityBorder} border-l-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300`}>
                        {/* Priority Badge */}
                        <div className={`absolute top-6 right-6 ${priorityColor} text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm`}>
                          {task.priority}
                        </div>

                        {/* Relative Time */}
                        <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <FaCalendarAlt size={10} />
                          Assigned {timeSince(task.dateAssigned || task.createdAt)}
                        </div>

                        <h4 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors pr-20">
                          {task.title}
                        </h4>

                        <div className="space-y-3">
                          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl italic">
                            "{task.description}"
                          </p>

                          <div className="grid grid-cols-2 gap-y-3 pt-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <FaCalendarAlt className="text-blue-400 shrink-0" />
                              <span className="truncate">Due: {formatDate(task.targetDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <FaBuilding className="text-blue-400 shrink-0" />
                              <span className="truncate">{task.department || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <FaUserMd className="text-blue-400 shrink-0" />
                              <span className="truncate">{task.specialty || "Specialty"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <FaUserFriends className="text-blue-400 shrink-0" />
                              <span className="truncate">
                                {task.assignedTo?.length > 0 && task.assignedTo[0] !== "all"
                                  ? `${task.assignedTo.length} Students`
                                  : task.selectedStudents?.length > 0
                                    ? `${task.selectedStudents.length} Students`
                                    : "Department"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details Footer */}
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <FaUserMd className="text-slate-300" />
                            By: {task.assignedBy}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                  <FaTasks size={48} className="mb-4 opacity-20" />
                  <p className="font-bold">No tasks assigned yet.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">
                {assignedTasks.length} Total Tasks
              </span>
              <button
                onClick={() => setShowTasksPopup(false)}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                <FaArrowLeft size={14} />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTaskPage;