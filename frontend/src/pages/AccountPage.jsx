import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaCheckCircle } from "react-icons/fa";
import Notification from "../Components/Notification";
import { updateUserLocally } from "../reducers/authReducer";
import medicalBg from "../assets/medicalBg.png";

const AccountPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userEmail = user?.email?.email || user?.email || "";

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
      className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-cover bg-center"
      style={{ backgroundImage: `url(${medicalBg})` }}
    >
      {/* CARD */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-700 text-center mb-1">
          Account Information
        </h2>
        <p className="text-center text-sm text-slate-600 mb-8">
          Manage your personal and professional details
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <div className="flex items-center gap-3 border border-slate-300 rounded-lg px-4 py-2 bg-slate-50">
            <span className="flex-1 text-sm text-slate-700 truncate">
              {formData.email}
            </span>
            <FaCheckCircle className="text-green-600" />
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Grid for selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white"
            >
              <option value="">Select country</option>
              <option value="India">India</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Training Year
            </label>
            <select
              name="trainingYear"
              value={formData.trainingYear}
              onChange={handleChange}
              disabled={!formData.country}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white disabled:bg-slate-100"
            >
              <option value="">Select training year</option>
              {(isIndia
                ? ["Residency", "Postgraduate year 1", "Internship", "Resident medical officer"]
                : ["Medical Year 1", "Medical Year 2", "Medical Year 3"]
              ).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hospital
            </label>
            <select
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              disabled={!formData.country}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white disabled:bg-slate-100"
            >
              <option value="">Select hospital</option>
              {(isIndia
                ? ["KMC Manipal", "AIIMS Delhi", "Fortis Hospital"]
                : ["Mayo Clinic", "Cleveland Clinic", "Johns Hopkins Hospital"]
              ).map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Specialty
            </label>
            <select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              disabled={!formData.country}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white disabled:bg-slate-100"
            >
              <option value="">Select specialty</option>
              {(isIndia
                ? ["Allergy", "Cardiology", "Dermatology", "Emergency medicine"]
                : ["Oncology", "Pediatrics", "Neurology"]
              ).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-lg text-sm font-semibold"
          >
            Update Account
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 border border-red-500 text-red-600 hover:bg-red-50 py-2.5 rounded-lg text-sm font-semibold"
          >
            <FaTrash className="inline mr-1" /> Delete Account
          </button>
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
    </div>
  );
};

export default AccountPage;
