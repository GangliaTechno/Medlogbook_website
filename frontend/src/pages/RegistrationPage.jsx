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

  // common
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

  const studentSpecialties = [
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
  ];

  const doctorSpecialties = [
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Neurology",
    "Oncology",
  ];

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

    if (
      role === "student" &&
      (!studentCountry ||
        !studentTrainingYear ||
        !studentHospital ||
        !studentSpecialty)
    ) {
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
                fullName: row.fullName,
                email: row.email,
                password: generateRegistrationCode(),
                role: row.role,
                specialty: row.specialty,
                country: row.country,
                trainingYear: row.trainingYear,
                hospital: row.hospital,
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

  /* ================= UI ================= */

  return (
    <div
      className="relative w-full overflow-y-auto px-6 py-10"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${medicalBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "contrast(1.05) saturate(1.05)",
      }}
    >
      {/* SHARP OVERLAY */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(255,255,255,0.35), rgba(255,255,255,0.35))",
        }}
      ></div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto bg-[#e9f7fb] rounded-[32px] p-10 shadow-xl">
        <h2 className="text-center text-3xl font-extrabold text-blue-600 mb-6">
          Register User
        </h2>

        {/* ROLE BUTTONS */}
        <div className="flex gap-6 justify-center mb-8">
          <button
            onClick={() => switchRole("student")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold ${
              role === "student"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-600"
            }`}
          >
            <FaUserGraduate /> Student
          </button>

          <button
            onClick={() => switchRole("doctor")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold ${
              role === "doctor"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-600"
            }`}
          >
            <FaUserMd /> Doctor
          </button>
        </div>

        {/* COMMON */}
        <Input icon={<FaUser />} placeholder="Full Name *" value={fullName} onChange={setFullName} />
        <Input icon={<FaEnvelope />} placeholder="Email *" value={email} onChange={setEmail} />
        <Input icon={<FaLock />} value={password} readOnly />

        {/* STUDENT */}
        {role === "student" && (
          <div key="student-form">
            <Select icon={<FaGlobe />} placeholder="Country *" value={studentCountry} onChange={setStudentCountry} options={countries} />
            <Select icon={<FaGraduationCap />} placeholder="Training Year *" value={studentTrainingYear} onChange={setStudentTrainingYear} options={trainingYears} />
            <Select icon={<FaHospital />} placeholder="Hospital *" value={studentHospital} onChange={setStudentHospital} options={hospitals} />
            <Select icon={<FaUserMd />} placeholder="Specialty *" value={studentSpecialty} onChange={setStudentSpecialty} options={studentSpecialties} />
          </div>
        )}

        {/* DOCTOR */}
        {role === "doctor" && (
          <div key="doctor-form">
            <Select icon={<FaUserMd />} placeholder="Specialty *" value={doctorSpecialty} onChange={setDoctorSpecialty} options={doctorSpecialties} />
          </div>
        )}

        {/* CSV */}
        <div className="flex items-center mb-6 bg-white rounded-full shadow px-5 py-4">
          <FaFileUpload className="text-blue-400 mr-3" />
          <input
            type="file"
            accept=".csv"
            className="w-full"
            onChange={(e) => handleCSVUpload(e.target.files[0])}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-4 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 to-cyan-500"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </div>

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() =>
          setNotification({ isOpen: false, title: "", message: "" })
        }
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Input = ({ icon, placeholder, value, onChange, readOnly }) => (
  <div className="flex items-center mb-5 bg-white rounded-full shadow px-5 py-4">
    <span className="text-blue-400 mr-3">{icon}</span>
    <input
      className="w-full outline-none bg-transparent"
      placeholder={placeholder}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  </div>
);

const Select = ({ icon, placeholder, value, onChange, options }) => (
  <div className="flex items-center mb-5 bg-white rounded-full shadow px-5 py-4">
    <span className="text-blue-400 mr-3">{icon}</span>
    <select
      className="w-full outline-none bg-transparent"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

export default RegistrationPage;
