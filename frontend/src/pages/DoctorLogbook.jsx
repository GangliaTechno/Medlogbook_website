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
    navigate("/doctor/student-entries", { state: { student } });
  };

  return (

  return (
    <div className="font-['Manrope'] min-h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10 px-4 sm:px-8">

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight mb-2">
            Student Overview
          </h1>
          <p className="text-slate-500 text-lg">
            Select a student to view and review their logbook entries.
          </p>
        </div>

        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <p className="text-slate-400 font-medium text-lg">No students found matching your specialty.</p>
          </div>
        ) : (
          /* Responsive Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center sm:items-start group"
              >
                {/* Avatar Placeholder */}
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {student.fullName ? student.fullName.charAt(0).toUpperCase() : "?"}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1">{student.fullName}</h3>
                <p className="text-slate-500 text-sm mb-6">{student.email}</p>

                <button
                  onClick={() => handleViewEntries(student)}
                  className="w-full mt-auto bg-white border-2 border-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                >
                  View Logbook Entries
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  );
};

export default DoctorLogbook;
