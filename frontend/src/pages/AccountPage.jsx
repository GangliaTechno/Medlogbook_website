import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaCheckCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { updateUserLocally } from "../reducers/authReducer";
import Notification from "../Components/Notification";


const AccountPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userEmail = user?.email?.email || user?.email || "";
  const dispatch = useDispatch();
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    country: "",
    trainingYear: "",
    hospital: "",
    specialty: "",
  });


  const [loading, setLoading] = useState(true); // ✅ Loader state
  const [memberSince, setMemberSince] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [role, setRole] = useState("");

  const trainingYearsIndia = ["Residency", "Postgraduate year 1", "Internship", "Resident medical officer"];
  const trainingYearsOther = ["Medical Year 1", "Medical Year 2", "Medical Year 3"];
  const hospitalsIndia = ["KMC Manipal", "AIIMS Delhi", "Fortis Hospital"];
  const hospitalsOther = ["Mayo Clinic", "Cleveland Clinic", "Johns Hopkins Hospital"];
  const specialtiesIndia = ["Allergy", "Cardiology", "Dermatology", "Emergency medicine"];
  const specialtiesOther = ["Oncology", "Pediatrics", "Neurology"];

  const [availableTrainingYears, setAvailableTrainingYears] = useState([]);
  const [availableHospitals, setAvailableHospitals] = useState([]);
  const [availableSpecialties, setAvailableSpecialties] = useState([]);

  useEffect(() => {
    if (!userEmail) return;

    fetch(`http://localhost:5000/api/auth/user/${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          console.error("User data fetch failed:", data?.error || "Unknown error");
          return;
        }
        setRole(data.role || "student");
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          password: data.password,
          country: data.country || "",
          trainingYear: data.trainingYear || "",
          hospital: data.hospital || "",
          specialty: data.specialty || "",
        });

        setMemberSince(new Date(data.createdAt).toLocaleDateString());

        if (data.country === "India") {
          setAvailableTrainingYears(trainingYearsIndia);
          setAvailableHospitals(hospitalsIndia);
          setAvailableSpecialties(specialtiesIndia);
        } else {
          setAvailableTrainingYears(trainingYearsOther);
          setAvailableHospitals(hospitalsOther);
          setAvailableSpecialties(specialtiesOther);
        }
      })
      .catch((error) => console.error("Error fetching user details:", error))
      .finally(() => setLoading(false)); // ✅ Hide loader after fetch
  }, [userEmail]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setFormData({ ...formData, country });

    if (country === "India") {
      setAvailableTrainingYears(trainingYearsIndia);
      setAvailableHospitals(hospitalsIndia);
      setAvailableSpecialties(specialtiesIndia);
    } else {
      setAvailableTrainingYears(trainingYearsOther);
      setAvailableHospitals(hospitalsOther);
      setAvailableSpecialties(specialtiesOther);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const updatedUser = { ...formData, originalEmail: userEmail, };
    if (role === "doctor") {
      delete updatedUser.country;
      delete updatedUser.hospital;
      delete updatedUser.trainingYear;
    }

    fetch("http://localhost:5000/api/auth/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) 
        setNotification({
        isOpen: true,
        message: data.error,
        type: "error",
      });
        else {
        setNotification({
        isOpen: true,
        message: "Profile updated successfully!",
        type: "success",
      });
        dispatch(updateUserLocally(data.user));}
      })
      .catch((err) => {
        console.error("Update error:", err);
        setNotification({
        isOpen: true,
        message: "Failed to update profile.",
        type: "error",
      });
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    setLoading(true);

    fetch(`http://localhost:5000/api/auth/user/delete/${encodeURIComponent(formData.email)}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
        setNotification({
        isOpen: true,
        message: data.error,
        type: "error",
      });
    }
        else {
          setNotification({
          isOpen: true,
          message: "Account deleted!",
          type: "success",
        });
          setTimeout(() => navigate("/"), 2000);
        }
      })
      .catch((err) => {
        console.error("Delete error:", err);
        setNotification({
        isOpen: true,
        message: "Failed to delete account.",
        type: "error",
      });
      })
      .finally(() => {
      setLoading(false);
      setTimeout(() => setNotification((prev) => ({ ...prev, isOpen: false })), 3000);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1e2a38] text-black">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-teal-400"></div>
      </div>
    );
  }

  return (
   <div
  className="w-[80%] flex flex-col m-auto p-5 rounded-[30px] font-arial text-black 
    [&_label]:mb-1.5 [&_label]:font-bold 
    [&_input]:p-3 [&_input]:mb-4 [&_input]:rounded-[16px] [&_input]:border-0 [&_input]:bg-white/30 [&_input]:placeholder:text-gray-200 
    [&_select]:p-3 [&_select]:rounded-[16px] [&_select]:border [&_select]:border-gray-300 [&_select]:text-gray-100 [&_select]:bg-white/20 [&_select]:mb-4 
    [&_option]:bg-gray-800"
  style={{
    background: "linear-gradient(135deg, #dbeeff, #f0f7ff)",
    color: "#1c1c1c",
    boxShadow: "0px 15px 30px rgba(0, 123, 255, 0.1)"
  }}
>

      <ToastContainer />
      
       <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Account Information</h2>

      <p className="flex items-center mb-6">
        <strong>Email:&nbsp;</strong> {formData.email} <FaCheckCircle className="text-black ml-1" />
      </p>

    {role === "admin" ? (
      <>
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          readOnly
          disabled
          onChange={handleChange}
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
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          placeholder="Enter full name"
          value={formData.fullName}
          disabled
          onChange={handleChange}
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

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter new password"
          value={formData.password}
          onChange={handleChange}
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
      </>
    ) : role === "doctor" ? (
      
      <>
      <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          placeholder="Enter full name"
          value={formData.fullName}
          disabled
          onChange={handleChange}
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

      <label className="block text-lg font-semibold mb-1">Password</label>
      <input
        type="password"
        name="password"
        placeholder="Enter new password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-600 focus:outline-none"
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
      
    <label>Specialty*</label>
    <select name="specialty" value={formData.specialty} disabled onChange={handleChange}
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
      <option value="">Select specialty</option>
      {specialtiesIndia.concat(specialtiesOther).map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </>
) : (
  <>
  <label className="block text-lg font-semibold mb-1">Password</label>
      <input
        type="password"
        name="password"
        placeholder="Enter new password"
        value={formData.password}

        onChange={handleChange}
        className="w-full p-3 mb-4 rounded white800 border border-gray-600 focus:outline-none"
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

    <label>Country*</label>
    <select name="country" value={formData.country} disabled onChange={handleCountryChange}
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
      <option value="">Select a country</option>
      <option value="India">India</option>
      <option value="United States">United States</option>
      <option value="United Kingdom">United Kingdom</option>
      <option value="Australia">Australia</option>
      <option value="Canada">Canada</option>
      <option value="Germany">Germany</option>
    </select>

    <label>Training Year*</label>
    <select name="trainingYear" value={formData.trainingYear} disabled onChange={handleChange}
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
      <option value="">Select training year</option>
      {availableTrainingYears.map((year) => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>

    <label>Hospital*</label>
    <select name="hospital" value={formData.hospital} disabled onChange={handleChange}
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
      <option value="">Select hospital</option>
      {availableHospitals.map((h) => (
        <option key={h} value={h}>{h}</option>
      ))}
    </select>

    <label>Specialty*</label>
    <select name="specialty" value={formData.specialty} disabled onChange={handleChange}
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
      <option value="">Select specialty</option>
      {availableSpecialties.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </>
)}
    <button
  onClick={handleUpdate}
  className=" px-6 py-3 rounded-[20px] cursor-pointer font-semibold text-white shadow-md transition-transform duration-200"
  style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  Update
</button>



      {role !== "admin" && (
       <button
  className="px-6 py-3 rounded-[16px] cursor-pointer flex justify-center items-center gap-1.5 mt-2 text-white font-semibold transition-transform duration-200 shadow-md"
  style={{
    background: "linear-gradient(45deg, #b3d9ff, #7ab8f5)", // light blue tones
    boxShadow: "0 6px 12px rgba(122, 184, 245, 0.3)",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  onClick={handleDelete}
>
  <FaTrash /> Delete Account
</button>

      )}
      <Notification
      isOpen={notification.isOpen}
      onRequestClose={() => setNotification({ ...notification, isOpen: false })}
      title="Notification"
      message={notification.message}
      type={notification.type}
    />
    </div>
  );
};

export default AccountPage;
