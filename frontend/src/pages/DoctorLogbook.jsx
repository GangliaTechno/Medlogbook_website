import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const DoctorLogbook = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  // ✅ Get logged-in doctor from Redux
  const doctor = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!doctor || doctor.role !== "doctor") {
      console.error("No doctor logged in");
      return;
    }

    // ✅ FIXED: Use backticks for template literal
    fetch(`https://medlogbook-website.onrender.com/api/auth/users?specialty=${encodeURIComponent(doctor.specialty)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        return response.json();
      })
      .then((studentsData) => {
        console.log("✅ Filtered Students:", studentsData);
        setStudents(studentsData);
      })
      .catch((error) => console.error("❌ Error fetching students:", error));
  }, [doctor]); // ✅ Re-run if doctor changes

  const handleViewEntries = (student) => {
    navigate("/student-entries", { state: { student } });
  };

  return (

    <div className="flex h-screen text-black">
      <div className="flex-grow px-6 py-10 max-w-4xl mx-auto">
        
        <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Doctor Logbook - View Student Entries</h2>

        {students.length === 0 ? (
          <p className="text-center text-gray-400">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white text-gray-800">
                  <th className="p-3 text-left">Student Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Actions</th>

                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="odd:bg-gray even:bg-gray-800"
                  >
                    <td className="p-3">{student.fullName}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">
                      <button
                         className=" px-6 py-3 rounded-[20px] cursor-pointer font-semibold text-white shadow-md transition-transform duration-200"
  style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        onClick={() => handleViewEntries(student)}

                      >
                        View Entries
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorLogbook;
