import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../reducers/authReducer";
import Notification from "../Components/Notification"; // Import Notification Component
import "../styles.css"; // Ensure correct path to styles.css
import * as Papa from "papaparse";

// Helper function to generate a random code
function generateRegistrationCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [role, setRole] = useState("student");

  const [selectedDoctorSpecialty, setSelectedDoctorSpecialty] = useState("");

  const doctorSpecialties = ["Allergy", "Cardiology", "Dermatology", "Emergency medicine", "Oncology", "Pediatrics", "Neurology"];


  const [notification, setNotification] = useState({ isOpen: false, title: "", message: "" });

  const countries = ["India", "United States", "United Kingdom", "Australia", "Canada", "Germany"];
  const trainingYearsIndia = ["Residency", "Postgraduate year 1", "Internship", "Resident medical officer", "Postgraduate year 2", "Postgraduate year 3", "Postgraduate year 4", "Postgraduate year 5", "Consultant"];
  const trainingYearsOther = ["Medical Year 1", "Medical Year 2", "Medical Year 3"];
  const hospitalsIndia = ["KMC Manipal", "AIIMS Delhi", "Fortis Hospital"];
  const hospitalsOther = ["Mayo Clinic", "Cleveland Clinic", "Johns Hopkins Hospital"];
  const specialtiesIndia = ["Allergy", "Cardiology", "Dermatology", "Emergency medicine"];
  const specialtiesOther = ["Oncology", "Pediatrics", "Neurology"];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // Password should be auto-generated and displayed, not editable
  const [password, setPassword] = useState(() => generateRegistrationCode(10));
  // Confirm password is not needed since password is auto-generated
  const [selectedCountry, setSelectedCountry] = useState("");
  const [trainingYears, setTrainingYears] = useState([]);
  const [selectedTrainingYear, setSelectedTrainingYear] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const handleRoleToggle = () => {
    setRole(role === "student" ? "doctor" : "student");
  };

  const handleCountryChange = (event) => {
    const country = event.target.value;
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
    setSelectedTrainingYear("");
    setSelectedHospital("");
    setSelectedSpecialty("");
  };



  const handleSubmit = async () => {
    console.log("🔹 handleSubmit triggered! Role:", role);

    if (!fullName || !email || !password) {
      console.log("❌ Missing text-red-600 fields:", {
        fullName, email, password
      });
      setNotification({ isOpen: true, title: "Error", message: "Please fill in all text-red-600 fields." });
      return;
    }

    // Validate fields based on role
    if (role === "student" && (!selectedCountry || !selectedTrainingYear || !selectedHospital || !selectedSpecialty)) {
      console.log("❌ Missing student fields");
      setNotification({ isOpen: true, title: "Error", message: "Please fill in all text-red-600 student fields." });
      return;
    }

    if (role === "doctor" && !selectedDoctorSpecialty) {
      console.log("❌ Missing doctor specialty:", selectedDoctorSpecialty);
      setNotification({ isOpen: true, title: "Error", message: "Please select a specialty for doctor." });
      return;
    }

    // Generate a registration code
    const registrationCode = generateRegistrationCode();

    const userData = {
      fullName,
      email,
      password,
      role,
      specialty: role === "student" ? selectedSpecialty : selectedDoctorSpecialty,
      registrationCode, // Add the generated code
    };

    // Only add student fields if role is student
    if (role === "student") {
      userData.country = selectedCountry;
      userData.trainingYear = selectedTrainingYear;
      userData.hospital = selectedHospital;
    }

    console.log("✅ Submitting Registration Data:", userData);

    try {
      console.log("🚀 Sending API request...");
      await dispatch(signupUser(userData)).unwrap();
      console.log("🎉 Registration Successful!");
      setNotification({ isOpen: true, title: "Success", message: "Registration successful! you can now login." });
    
      setTimeout(() => {
        navigate("/admin/register"); // Pass email to verify-otp page if needed
      }, 1000); // you can reduce timeout to 1s or even navigate immediately
    
    } catch (err) {
      console.error("❌ Registration Error:", err);
      setNotification({ isOpen: true, title: "Error", message: err.error || "Registration failed" });
    }
  };
   
  const handleCSVUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async function (results) {
      console.log("🟢 CSV Parsed:", results.data);

      // Validate and filter out invalid rows
      const validUsers = results.data
        .filter(row => {
          // Check if required fields exist and are not empty
          // Handle different CSV formats - check for Email or E-mail
          const email = row['Email'] || row['E-mail'];
          const fullName = row['Full Name'];
          const specialty = row['Specialty'];
          
          const hasRequiredFields = fullName && email && specialty;
          if (!hasRequiredFields) {
            console.warn("⚠️ Skipping row with missing required fields:", row);
            return false;
          }
          return true;
        })
        .map((row) => {
          // Determine role: if there's a Role column use it, 
          // otherwise check for Student ID vs Employee ID, 
          // or default based on file context
          let role = 'student'; // default
          
          if (row['Role']) {
            role = row['Role'].toLowerCase().trim();
          } else if (row['Employee ID']) {
            role = 'doctor'; // Employee ID suggests doctor
          } else if (row['Student ID']) {
            role = 'student'; // Student ID suggests student
          }
          
          const email = row['Email'] || row['E-mail'];
          
          const userData = {
            fullName: row['Full Name'].trim(),
            email: email.trim(),
            password: generateRegistrationCode(10),
            role: role,
            specialty: row['Specialty'].trim(),
            registrationCode: generateRegistrationCode(),
          };

          // Only add student fields if role is student and fields exist
          if (role === "student") {
            if (row['Country']) userData.country = row['Country'].trim();
            if (row['Training Year']) userData.trainingYear = row['Training Year'].trim();
            if (row['Hospital']) userData.hospital = row['Hospital'].trim();
          }

          return userData;
        });

      if (validUsers.length === 0) {
        setNotification({
          isOpen: true,
          title: "Error",
          message: "No valid users found in CSV. Please check the format.",
        });
        return;
      }

      let successCount = 0;
      let failCount = 0;
      const errors = [];

      for (const user of validUsers) {
        try {
          await dispatch(signupUser(user)).unwrap();
          console.log(`✅ Registered ${user.email}`);
          successCount++;
        } catch (err) {
          console.error(`❌ Failed to register ${user.email}:`, err);
          errors.push(`${user.email}: ${err.message || 'Unknown error'}`);
          failCount++;
        }
      }

      const message = `✔️ ${successCount} succeeded, ❌ ${failCount} failed.${
        errors.length > 0 ? `\nErrors: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}` : ''
      }`;

      setNotification({
        isOpen: true,
        title: "Bulk Registration Complete",
        message: message,
      });
    },
    error: function(error) {
      console.error("❌ CSV Parse Error:", error);
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Failed to parse CSV file. Please check the format.",
      });
    }
  });
};

  return (
    <div
  className="max-w-[1350px] bg-white/10 p-6 mx-auto my-12 rounded-lg shadow-md text-black 
             [&_label]:mb-1.5 [&_label]:font-bold [&_input]:p-3 [&_input]:mb-4 
             [&_input]:rounded-md [&_input]:border-0 [&_input]:bg-white/20 
             [&_input]:placeholder:text-gray-300 [&_select]:p-3 [&_select]:rounded-md 
             [&_select]:border [&_select]:border-gray-300 [&_select]:text-gray-300 
             [&_select]:bg-white/20 [&_select]:mb-4 [&_option]:white"
  style={{
    background: "linear-gradient(0deg, rgb(255, 255, 255) 0%, rgba(219, 239, 245, 1) 100%)",
    borderRadius: "40px",
    padding: "25px 35px",
    border: "5px solid rgb(255, 255, 255)",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 30px 30px -20px",
    margin: "20px auto",
    position: "relative"
  }}
>

      <div className="relative" >
        
        <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Welcome to MedicalLogBook!</h2>
        <p className="text-sm mb-5 text-center">To configure your account, please provide details about your current medical training.</p>

      </div>

      {/* Notification Modal */}
      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() => setNotification({ isOpen: false })}
        title={notification.title}
        message={notification.message}
      />

      {/* Show Student Fields */}


      <div className="flex flex-col">
        <div className="flex">
          <label>Full Name <span className="text-red-600">*</span>
          </label>

          <button className={`ml-auto !w-24 px-5 py-2 -mt-1 mb-2 text-[16px] text-white rounded-full cursor-pointer ${role === "student" ? "bg-blue-400" : "bg-blue-300"}`} onClick={handleRoleToggle}>
            {role === "student" ? "Student" : "Doctor"}
          </button>
        </div>

        <input type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} 
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
  }/>
      </div>

      <div className="flex flex-col">
        <label className="">Email <span className="text-red-600">*</span></label>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} 
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
  }/>
      </div>

      <div className="flex flex-col">
        <label>Password <span className="text-red-600">*</span></label>
        <input
          type="text"
          value={password}
          readOnly
          className="white200 text-black cursor-not-allowed"
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
        <span className="text-xs text-gray-400">This password is auto-generated and cannot be changed.</span>
      </div>
      {role === "student" && (
        <>
          <div className="flex flex-col">
            <label>Country <span className="text-red-600">*</span></label>
            <select value={selectedCountry} onChange={handleCountryChange}
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
  } >
              <option value="">Select a country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {selectedCountry && (
            <>
              <div className="flex flex-col">
                <label>Training Year <span className="text-red-600">*</span></label>
                <select value={selectedTrainingYear} onChange={(e) => setSelectedTrainingYear(e.target.value)}
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
  }>
                  <option value="">Select your training year</option>
                  {trainingYears.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label>Hospital <span className="text-red-600">*</span></label>
                <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)} style={{
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
  }>
                  <option value="">Select a hospital</option>
                  {hospitals.map((hospital, index) => (
                    <option key={index} value={hospital}>{hospital}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label>Specialty <span className="text-red-600">*</span></label>
                <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} style={{
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
  }>
                  <option value="">Select a specialty</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </>

      )}

      {/* Show Doctor Fields */}

      {role === "doctor" && (

        <div className="flex flex-col">
          <label>Specialty <span className="text-red-600">*</span></label>
          <select value={selectedDoctorSpecialty} onChange={(e) => setSelectedDoctorSpecialty(e.target.value)}  style={{
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
  }>
            <option value="">Select a specialty</option>
            {doctorSpecialties.map((specialty, index) => (
              <option key={index} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>

      )}


      <button className="w-full p-3 rounded-full cursor-pointer bg-[#008080] transition ease duration-300 hover:bg-[#015b5b] font-medium text-white"
     style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
     onClick={() => {
        console.log("🟢 Button clicked! Role:", role);
        handleSubmit();
      }} disabled={isLoading || (role === "student" && !selectedCountry)}>
        {isLoading ? "Registering..." : "Set up Logbook!"}
      </button>
      {/* CSV Upload Button */}
      <div className="flex flex-col mb-4">
  <label className="font-bold mb-1.5">Upload CSV for Bulk Registration</label>
  <input
    type="file"
    accept=".csv"
    onChange={(e) => handleCSVUpload(e)}
    className="p-2 rounded-md bg-white/20 text-gray-300"
  />
  <span className="text-xs text-gray-400 mt-1">CSV should include: fullName, email, role, specialty, country, trainingYear, hospital</span>
</div>

      {/* Go Back Button */}
      <button className="w-full px-6 py-3 rounded-[16px] cursor-pointer flex justify-center items-center gap-1.5 mt-2 text-white font-semibold transition-transform duration-200 shadow-md"
  style={{
    background: "linear-gradient(45deg, #b3d9ff, #7ab8f5)", // light blue tones
    boxShadow: "0 6px 12px rgba(122, 184, 245, 0.3)",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
   onClick={() => navigate("/")}>Go Back</button>

    </div>
  );
};

export default RegistrationPage;