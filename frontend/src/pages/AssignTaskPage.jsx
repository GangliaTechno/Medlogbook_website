import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Notification from "../Components/Notification";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";


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
        className="w-full md:w-auto md:absolute md:top-0 md:right-0 mt-0 mb-4 md:mt-4 md:mr-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
      >
        View Assigned Tasks
      </button>

      <h2 className="text-2xl font-bold text-blue-600 mb-6"
        style={{
          textAlign: "center",
          fontWeight: 900,
          fontSize: "30px",
          color: "rgb(16, 137, 211)"
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
          <label className="block text-gray-700 font-semibold">Task Title</label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter task title"
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
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Description"
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
          <label className="block text-gray-700 font-semibold">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}

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
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder="Enter task title"
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
              fontSize: "14px",

            }}
            onFocus={(e) =>
              (e.target.style.borderInline = "2px solid #12b1d1")
            }
            onBlur={(e) =>
              (e.target.style.borderInline = "2px solid transparent")
            }
            required
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Assign To</label>
          <select
            value={assignmentType}
            onChange={(e) => {
              setAssignmentType(e.target.value);
              setSelectedStudents([]);
              setDepartment("");
            }}
            placeholder="Enter task title"
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
            <option value="department">Department</option>
            <option value="students">Specific Students</option>
          </select>
        </div>

        {assignmentType === "department" && (
          <div>
            <label className="block text-gray-700 font-semibold">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter task title"
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
          className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-[1200px] max-h-[80vh] overflow-y-auto" style={{
            borderRadius: "50px",
            background: "#e0e0e0",
            boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff"
          }}>
            <h3 className="text-xl font-semibold mb-4">Assigned Tasks</h3>
            {assignedTasks.length > 0 ? (
              assignedTasks.map((task, index) => (
                <div key={index} className="mb-4 p-6  relative" style={{
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
                  <p>
                    <strong>Assigned To:</strong>{" "}
                    {task.assignedTo?.length > 0 && task.assignedTo[0] !== "all"
                      ? task.assignedTo.join(", ")
                      : task.selectedStudents?.length > 0
                        ? task.selectedStudents.join(", ")
                        : `All in ${task.department || "department"}`}
                  </p>

                </div>
              ))
            ) : (
              <p>No tasks assigned yet.</p>
            )}

          </div>
          <button
            onClick={() => setShowTasksPopup(false)}
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 text-xl flex items-center gap-2"
          >
            <FaArrowLeft />
            <span className="text-sm font-semibold">Back</span>
          </button>

        </div>
      )}
    </div>
  );
};

export default AssignTaskPage;