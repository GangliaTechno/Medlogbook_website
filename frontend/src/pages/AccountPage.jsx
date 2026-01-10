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

  /* ================= DROPDOWN VALUES (ONLY YOUR VALUES) ================= */

  const trainingYearsIndia = [
    "Residency",
    "Postgraduate year 1",
    "Internship",
    "Resident medical officer",
  ];

  const trainingYearsOther = [
    "Medical Year 1",
    "Medical Year 2",
    "Medical Year 3",
  ];

  const hospitalsIndia = [
    "KMC Manipal",
    "AIIMS Delhi",
    "Fortis Hospital",
  ];

  const hospitalsOther = [
    "Mayo Clinic",
    "Cleveland Clinic",
    "Johns Hopkins Hospital",
  ];

  const specialtiesIndia = [
    "Allergy",
    "Cardiology",
    "Dermatology",
    "Emergency medicine",
  ];

  const specialtiesOther = [
    "Oncology",
    "Pediatrics",
    "Neurology",
  ];

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

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If country changes → reset dependent fields
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
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-14 w-14 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const isIndia = formData.country === "India";

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center px-4 py-8"
      style={{ backgroundImage: `url(${medicalBg})` }}
    >
      {/* GLASS CARD */}
      <div className="w-full max-w-xl bg-white/85 backdrop-blur-sm rounded-[32px] shadow-2xl p-8">
        <h2 className="text-center text-3xl font-bold text-blue-700 mb-2">
          Account Information
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Manage your account details
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="font-semibold">Email</label>
          <div className="flex items-center gap-2 bg-white rounded-full px-5 py-3 shadow">
            <span className="flex-1 text-gray-700">{formData.email}</span>
            <FaCheckCircle className="text-green-500" />
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="font-semibold">New Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-2 px-5 py-3 rounded-full shadow outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Country (WORKING) */}
        <div className="mb-5">
          <label className="font-semibold">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full mt-2 px-5 py-3 rounded-full shadow bg-white"
          >
            <option value="">Select country</option>
            <option value="India">India</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Training Year */}
        <div className="mb-5">
          <label className="font-semibold">Training Year</label>
          <select
            name="trainingYear"
            value={formData.trainingYear}
            onChange={handleChange}
            className="w-full mt-2 px-5 py-3 rounded-full shadow bg-white"
            disabled={!formData.country}
          >
            <option value="">Select training year</option>
            {(isIndia ? trainingYearsIndia : trainingYearsOther).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Hospital */}
        <div className="mb-5">
          <label className="font-semibold">Hospital</label>
          <select
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            className="w-full mt-2 px-5 py-3 rounded-full shadow bg-white"
            disabled={!formData.country}
          >
            <option value="">Select hospital</option>
            {(isIndia ? hospitalsIndia : hospitalsOther).map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Specialty */}
        <div className="mb-8">
          <label className="font-semibold">Specialty</label>
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            className="w-full mt-2 px-5 py-3 rounded-full shadow bg-white"
            disabled={!formData.country}
          >
            <option value="">Select specialty</option>
            {(isIndia ? specialtiesIndia : specialtiesOther).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow hover:scale-105 transition"
          >
            Update
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow hover:scale-105 transition"
          >
            <FaTrash className="inline mr-1" /> Delete
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
