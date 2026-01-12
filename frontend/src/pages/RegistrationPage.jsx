import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../reducers/authReducer";
import Notification from "../Components/Notification";
import "../styles.css";
import medicalBg from "../assets/medicalBg.png";

import * as Papa from "papaparse";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGlobe,
  FaHospital,
  FaUserMd,
  FaGraduationCap,
  FaFileUpload,
  FaUserGraduate,
} from "react-icons/fa";

/* Helper */
function generateRegistrationCode(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  /* ================= STATE ================= */
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password] = useState(generateRegistrationCode());

  // student-only
  const [studentCountry, setStudentCountry] = useState("");
  const [studentTrainingYear, setStudentTrainingYear] = useState("");
  const [studentHospital, setStudentHospital] = useState("");
  const [studentSpecialty, setStudentSpecialty] = useState("");

  // doctor-only
  const [doctorSpecialty, setDoctorSpecialty] = useState("");

  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  /* ================= DATA ================= */
  const countries = ["India", "United States", "United Kingdom", "Australia"];
  const trainingYears = ["Internship", "PG Year 1", "PG Year 2"];
  const hospitals = ["KMC Manipal", "AIIMS Delhi", "Fortis Hospital"];
  const studentSpecialties = ["Cardiology", "Dermatology", "Emergency Medicine"];
  const doctorSpecialties = ["Cardiology", "Dermatology", "Emergency Medicine", "Neurology", "Oncology"];

  /* ================= ROLE SWITCH ================= */
  const switchRole = (newRole) => {
    setRole(newRole);
    setStudentCountry("");
    setStudentTrainingYear("");
    setStudentHospital("");
    setStudentSpecialty("");
    setDoctorSpecialty("");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!fullName || !email) {
      return setNotification({
        isOpen: true,
        title: "Error",
        message: "Please fill all required fields",
      });
    }

    if (role === "student" && (!studentCountry || !studentTrainingYear || !studentHospital || !studentSpecialty)) {
      return setNotification({
        isOpen: true,
        title: "Error",
        message: "Please fill all student fields",
      });
    }

    if (role === "doctor" && !doctorSpecialty) {
      return setNotification({
        isOpen: true,
        title: "Error",
        message: "Please select doctor specialty",
      });
    }

    const payload = {
      fullName,
      email,
      password,
      role,
      specialty: role === "student" ? studentSpecialty : doctorSpecialty,
      status: "pending",
    };

    if (role === "student") {
      payload.country = studentCountry;
      payload.trainingYear = studentTrainingYear;
      payload.hospital = studentHospital;
    }

    try {
      await dispatch(signupUser(payload)).unwrap();
      setNotification({
        isOpen: true,
        title: "Success",
        message: "Registration completed successfully!",
      });
    } catch (err) {
      setNotification({
        isOpen: true,
        title: "Error",
        message: err?.message || "Registration failed",
      });
    }
  };

  /* ================= CSV AUTO UPLOAD ================= */
  const handleCSVUpload = (file) => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          for (const row of results.data) {
            await dispatch(
              signupUser({
                ...row,
                password: generateRegistrationCode(),
                status: "pending",
              })
            ).unwrap();
          }
          setNotification({
            isOpen: true,
            title: "Success",
            message: "CSV users registered successfully!",
          });
        } catch {
          setNotification({
            isOpen: true,
            title: "Error",
            message: "CSV registration failed",
          });
        }
      },
    });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center font-['Inter'] overflow-x-hidden">
      {/* BACKGROUND LAYER */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${medicalBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.9)",
        }}
      />
      <div className="fixed inset-0 bg-blue-900/10 z-0"></div>

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 w-full px-4 py-8 flex justify-center">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-5 sm:p-10 border border-white/50">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-4xl font-black text-blue-700 tracking-tight leading-tight">
              Register User
            </h2>
            <p className="text-gray-500 mt-2 text-xs sm:text-base">
              Enter details to create a new medical profile
            </p>
          </div>

          {/* ROLE SWITCHER */}
          <div className="flex p-1 bg-gray-100/80 rounded-2xl mb-8 w-full max-w-[280px] sm:max-w-xs mx-auto">
            <button
              onClick={() => switchRole("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                role === "student" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaUserGraduate /> Student
            </button>
            <button
              onClick={() => switchRole("doctor")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                role === "doctor" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaUserMd /> Doctor
            </button>
          </div>

          {/* INPUT FIELDS */}
          <div className="space-y-4">
            <Input icon={<FaUser />} placeholder="Full Name *" value={fullName} onChange={setFullName} />
            <Input icon={<FaEnvelope />} placeholder="Email *" value={email} onChange={setEmail} />
            
            <div className="relative">
              <Input icon={<FaLock />} value={password} readOnly />
              <span className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-blue-400 bg-blue-50 px-2 py-1 rounded">
                AUTO CODE
              </span>
            </div>

            {role === "student" && (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <Select icon={<FaGlobe />} placeholder="Country *" value={studentCountry} onChange={setStudentCountry} options={countries} />
                <Select icon={<FaGraduationCap />} placeholder="Year *" value={studentTrainingYear} onChange={setStudentTrainingYear} options={trainingYears} />
                <Select icon={<FaHospital />} placeholder="Hospital *" value={studentHospital} onChange={setStudentHospital} options={hospitals} />
                <Select icon={<FaUserMd />} placeholder="Specialty *" value={studentSpecialty} onChange={setStudentSpecialty} options={studentSpecialties} />
              </div>
            )}

            {role === "doctor" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <Select icon={<FaUserMd />} placeholder="Medical Specialty *" value={doctorSpecialty} onChange={setDoctorSpecialty} options={doctorSpecialties} />
              </div>
            )}

            {/* CSV SECTION */}
            <div className="mt-6">
               <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-blue-200 bg-blue-50/50 p-4 rounded-2xl cursor-pointer hover:border-blue-400 transition-colors group">
                 <FaFileUpload className="text-blue-500 text-sm group-hover:scale-110 transition-transform" />
                 <span className="text-xs sm:text-sm font-semibold text-blue-700">Batch Upload via CSV</span>
                 <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => handleCSVUpload(e.target.files[0])}
                />
               </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-8 py-3.5 sm:py-4 rounded-2xl text-white font-black text-sm sm:text-lg shadow-xl transition-all active:scale-95 disabled:opacity-50
            bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
          >
            {isLoading ? "PROCESSSING..." : "CREATE ACCOUNT"}
          </button>
        </div>
      </div>

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() => setNotification({ isOpen: false, title: "", message: "" })}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Input = ({ icon, placeholder, value, onChange, readOnly }) => (
  <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus-within:ring-2 focus-within:ring-blue-400 focus-within:bg-white transition-all">
    <span className="text-blue-500 text-base sm:text-lg mr-3 sm:mr-4 flex-shrink-0">{icon}</span>
    <input
      className="w-full outline-none bg-transparent text-gray-800 font-medium placeholder:text-gray-400 text-xs sm:text-sm min-w-0"
      placeholder={placeholder}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  </div>
);

const Select = ({ icon, placeholder, value, onChange, options }) => (
  <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus-within:ring-2 focus-within:ring-blue-400 focus-within:bg-white transition-all">
    <span className="text-blue-500 text-base sm:text-lg mr-3 sm:mr-4 flex-shrink-0">{icon}</span>
    <select
      className="w-full outline-none bg-transparent text-gray-800 font-medium text-xs sm:text-sm appearance-none cursor-pointer min-w-0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" className="text-gray-400">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="text-gray-800">
          {o}
        </option>
      ))}
    </select>
  </div>
);

export default RegistrationPage;