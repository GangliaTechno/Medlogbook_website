import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaCheckCircle,
  FaLock,
  FaGlobe,
  FaGraduationCap,
  FaHospital,
  FaUserMd,
  FaEnvelope
} from "react-icons/fa";
import Notification from "../Components/Notification";
import { updateUserLocally } from "../reducers/authReducer";
import medicalBg from "../assets/medicalBg.png";
import studentPanelBg from "../assets/studentPanelBg_updated.png";

const AccountPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userEmail = user?.email?.email || user?.email || "";
  const userRole = user?.role || localStorage.getItem('role') || 'student';

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    country: "",
    trainingYear: "",
    hospital: "",
    specialty: "",
  });

  /* ================= FETCH USER ================= */

  useEffect(() => {
    if (!userEmail) return;

    fetch(
      `https://medlogbook-website.onrender.com/api/auth/user/${encodeURIComponent(
        userEmail
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          email: data.email || "",
          password: "",
          country: data.country || "",
          trainingYear: data.trainingYear || "",
          hospital: data.hospital || "",
          specialty: data.specialty || "",
        });
      })
      .finally(() => setLoading(false));
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setFormData({
        ...formData,
        country: value,
        trainingYear: "",
        hospital: "",
        specialty: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    fetch("https://medlogbook-website.onrender.com/api/auth/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, originalEmail: userEmail }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(updateUserLocally(data.user));
        setNotification({
          isOpen: true,
          message: "Account updated successfully",
          type: "success",
        });
      });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    await fetch(
      `https://medlogbook-website.onrender.com/api/auth/user/delete/${encodeURIComponent(
        formData.email
      )}`,
      { method: "DELETE" }
    );

    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isIndia = formData.country === "India";

  return (
    <div
      className="max-w-7xl mx-auto min-h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10 px-4 sm:px-6 flex items-center justify-center"
      style={{
        backgroundImage: `url(${studentPanelBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight mb-2">
            Account Settings
          </h1>
          <p className="text-base text-slate-500">
            View your profile details and update your password.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-500"></div>

          <div className="p-8 sm:p-10">
            {/* Email Section */}
            <div className="mb-8">
              <label className="block text-base font-bold text-slate-700 mb-2 ml-1">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <FaEnvelope className="text-blue-500" />
                <span className="flex-1 text-base font-medium text-slate-600 truncate">
                  {formData.email}
                </span>
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                  <FaCheckCircle className="text-sm" />
                  <span className="text-xs font-bold uppercase tracking-wide">Verified</span>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="mb-8">
              <label className="block text-base font-bold text-slate-700 mb-2 ml-1">
                New Password
              </label>
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <FaLock className="text-blue-500 mr-3" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter a new password to update"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent text-base font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full my-8"></div>

            {/* Grid Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Country */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-2 ml-1">
                  Country
                </label>
                <div className={`relative flex items-center ${userRole === 'student' ? 'bg-slate-50' : 'bg-white'} border border-slate-200 rounded-xl px-4 py-3 ${userRole !== 'student' ? 'focus-within:ring-2 focus-within:ring-blue-500 transition-all' : ''}`}>
                  <FaGlobe className={`${userRole === 'student' ? 'text-slate-400' : 'text-blue-500'} mr-3`} />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={userRole === 'student'}
                    className={`w-full appearance-none bg-transparent text-base font-medium ${userRole === 'student' ? 'text-slate-500 cursor-not-allowed' : 'text-slate-700 cursor-pointer'} focus:outline-none`}
                  >
                    <option value="">Select country</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Training Year */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-2 ml-1">
                  Training Year
                </label>
                <div className={`relative flex items-center ${userRole === 'student' ? 'bg-slate-50' : 'bg-white'} border border-slate-200 rounded-xl px-4 py-3 ${userRole !== 'student' ? 'focus-within:ring-2 focus-within:ring-blue-500 transition-all' : ''}`}>
                  <FaGraduationCap className={`${userRole === 'student' ? 'text-slate-400' : 'text-blue-500'} mr-3`} />
                  <select
                    name="trainingYear"
                    value={formData.trainingYear}
                    onChange={handleChange}
                    disabled={userRole === 'student'}
                    className={`w-full appearance-none bg-transparent text-base font-medium ${userRole === 'student' ? 'text-slate-500 cursor-not-allowed' : 'text-slate-700 cursor-pointer'} focus:outline-none`}
                  >
                    <option value="">Select year</option>
                    {(isIndia
                      ? ["Residency", "Postgraduate year 1", "Internship", "Resident medical officer"]
                      : ["Medical Year 1", "Medical Year 2", "Medical Year 3"]
                    ).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Hospital */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-2 ml-1">
                  Hospital
                </label>
                <div className={`relative flex items-center ${userRole === 'student' ? 'bg-slate-50' : 'bg-white'} border border-slate-200 rounded-xl px-4 py-3 ${userRole !== 'student' ? 'focus-within:ring-2 focus-within:ring-blue-500 transition-all' : ''}`}>
                  <FaHospital className={`${userRole === 'student' ? 'text-slate-400' : 'text-blue-500'} mr-3`} />
                  <select
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    disabled={userRole === 'student'}
                    className={`w-full appearance-none bg-transparent text-base font-medium ${userRole === 'student' ? 'text-slate-500 cursor-not-allowed' : 'text-slate-700 cursor-pointer'} focus:outline-none`}
                  >
                    <option value="">Select hospital</option>
                    {(isIndia
                      ? ["KMC Manipal", "AIIMS Delhi", "Fortis Hospital"]
                      : ["Mayo Clinic", "Cleveland Clinic", "Johns Hopkins Hospital"]
                    ).map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-2 ml-1">
                  Specialty
                </label>
                <div className={`relative flex items-center ${userRole === 'student' ? 'bg-slate-50' : 'bg-white'} border border-slate-200 rounded-xl px-4 py-3 ${userRole !== 'student' ? 'focus-within:ring-2 focus-within:ring-blue-500 transition-all' : ''}`}>
                  <FaUserMd className={`${userRole === 'student' ? 'text-slate-400' : 'text-blue-500'} mr-3`} />
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    disabled={userRole === 'student'}
                    className={`w-full appearance-none bg-transparent text-base font-medium ${userRole === 'student' ? 'text-slate-500 cursor-not-allowed' : 'text-slate-700 cursor-pointer'} focus:outline-none`}
                  >
                    <option value="">Select specialty</option>
                    {(isIndia
                      ? ["Allergy", "Cardiology", "Dermatology", "Emergency medicine"]
                      : ["Oncology", "Pediatrics", "Neurology"]
                    ).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
              >
                Save Changes
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-100 py-3.5 rounded-xl text-base font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <FaTrash className="group-hover:scale-110 transition-transform" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() =>
          setNotification({ ...notification, isOpen: false })
        }
        title="Notification"
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default AccountPage;
