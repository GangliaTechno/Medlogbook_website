import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../reducers/authReducer";
import Notification from "../Components/Notification";
import "../styles.css";

/* Helper */
function generateRegistrationCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [role, setRole] = useState("student");
  const [selectedDoctorSpecialty, setSelectedDoctorSpecialty] = useState("");

  const doctorSpecialties = [
    "Allergy",
    "Cardiology",
    "Dermatology",
    "Emergency medicine",
    "Oncology",
    "Pediatrics",
    "Neurology",
  ];

  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const countries = ["India", "United States", "United Kingdom", "Australia"];
  const trainingYearsIndia = ["Residency", "Internship", "PG Year 1"];
  const trainingYearsOther = ["Medical Year 1", "Medical Year 2"];
  const hospitalsIndia = ["KMC Manipal", "AIIMS Delhi", "Fortis Hospital"];
  const hospitalsOther = ["Mayo Clinic", "Cleveland Clinic"];
  const specialtiesIndia = ["Allergy", "Cardiology", "Dermatology"];
  const specialtiesOther = ["Oncology", "Pediatrics", "Neurology"];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password] = useState(() => generateRegistrationCode(10));
  const [selectedCountry, setSelectedCountry] = useState("");
  const [trainingYears, setTrainingYears] = useState([]);
  const [selectedTrainingYear, setSelectedTrainingYear] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const handleRoleToggle = (val) => setRole(val);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);

    if (country === "India") {
      setTrainingYears(trainingYearsIndia);
      setHospitals(hospitalsIndia);
      setSpecialties(specialtiesIndia);
    } else {
      setTrainingYears(trainingYearsOther);
      setHospitals(hospitalsOther);
      setSpecialties(specialtiesOther);
    }
  };

  const handleSubmit = async () => {
    const userData = {
      fullName,
      email,
      password,
      role,
      specialty: role === "student" ? selectedSpecialty : selectedDoctorSpecialty,
      registrationCode: generateRegistrationCode(),
    };

    if (role === "student") {
      userData.country = selectedCountry;
      userData.trainingYear = selectedTrainingYear;
      userData.hospital = selectedHospital;
    }

    try {
      await dispatch(signupUser(userData)).unwrap();
      setNotification({
        isOpen: true,
        title: "Success",
        message: "Registration successful!",
      });
      setTimeout(() => navigate("/"), 1000);
    } catch {
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Registration failed",
      });
    }
  };

  return (
    /* 🌄 FULL BACKGROUND */
    <div
      className="min-h-screen w-full overflow-y-auto flex justify-center items-start px-4 py-10"
      style={{
        backgroundImage:
          "url('/assets/medical-bg.jpg')", // 🔴 put image in public/assets
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🌫 Overlay */}
      <div className="absolute inset-0 bg-blue-100/70 backdrop-blur-sm"></div>

      {/* 🧊 Glass Card */}
      <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl p-8">
        <h2 className="text-center text-3xl font-extrabold text-blue-700 mb-2">
          Welcome to MedicalLogBook!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          To configure your account, please provide your medical training details.
        </p>

        {/* Toggle */}
        <div className="flex justify-center mb-6 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => handleRoleToggle("student")}
            className={`px-6 py-2 rounded-full font-semibold ${
              role === "student"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            🎓 Student
          </button>
          <button
            onClick={() => handleRoleToggle("doctor")}
            className={`px-6 py-2 rounded-full font-semibold ${
              role === "doctor"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            🩺 Doctor
          </button>
        </div>

        {/* FORM */}
        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mb-4 p-4 rounded-full shadow"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-4 rounded-full shadow"
        />

        <input
          value={password}
          readOnly
          className="w-full mb-4 p-4 rounded-full shadow bg-gray-100"
        />

        {role === "doctor" && (
          <select
            value={selectedDoctorSpecialty}
            onChange={(e) => setSelectedDoctorSpecialty(e.target.value)}
            className="w-full mb-4 p-4 rounded-full shadow"
          >
            <option value="">Select Specialty</option>
            {doctorSpecialties.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}

        {/* BUTTONS */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full mt-4 py-3 rounded-full text-white font-semibold text-lg"
          style={{
            background:
              "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
          }}
        >
          {isLoading ? "Registering..." : "Set up Logbook!"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 py-3 rounded-full bg-gray-200 font-semibold"
        >
          Go Back
        </button>
      </div>

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() => setNotification({ isOpen: false })}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
};

export default RegistrationPage;
