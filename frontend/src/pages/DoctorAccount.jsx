import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaLock, FaUserMd } from "react-icons/fa";

const DoctorAccount = () => {
  const user = useSelector((state) => state.auth?.user);

  const [fullName, setFullName] = useState(user?.name || "");
  const [specialty, setSpecialty] = useState("Emergency medicine");
  const [password, setPassword] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    // API call can be added here
    alert("Account updated successfully");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      // API call can be added here
      alert("Account deleted");
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent flex justify-center items-start p-4 md:p-10 overflow-x-hidden">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-center text-blue-600 mb-6">
          Account Information
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-600">
            Email:
          </label>
          <p className="text-gray-800 mt-1 flex items-center gap-2 text-base">
            <FaEnvelope className="text-blue-600" />
            {user?.email || "doctor@email.com"}
            <span className="text-green-500 ml-auto">✔</span>
          </p>
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="text-base font-semibold text-gray-600">
            Full Name
          </label>
          <div className="flex items-center mt-1 p-3 border rounded-md focus-within:ring-2 focus-within:ring-blue-500 bg-white">
            <FaUser className="text-blue-600 mr-3" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full outline-none bg-transparent text-base"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-base font-semibold text-gray-600">
            Password
          </label>
          <div className="flex items-center mt-1 p-3 border rounded-md focus-within:ring-2 focus-within:ring-blue-500 bg-white">
            <FaLock className="text-blue-600 mr-3" />
            <input
              type="password"
              placeholder="••••••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none bg-transparent text-base"
            />
          </div>
        </div>

        {/* Specialty */}
        <div className="mb-6">
          <label className="text-base font-semibold text-gray-600">
            Specialty*
          </label>
          <div className="flex items-center mt-1 p-3 border rounded-md focus-within:ring-2 focus-within:ring-blue-500 bg-white relative">
            <FaUserMd className="text-blue-600 mr-3" />
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full outline-none bg-transparent appearance-none cursor-pointer text-base"
            >
              <option>Emergency medicine</option>
              <option>General medicine</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Pediatrics</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition text-base"
        >
          Update
        </button>

        <button
          onClick={handleDelete}
          className="w-full mt-4 bg-blue-400 text-white py-3 rounded-md font-semibold hover:bg-blue-500 transition text-base"
        >
          🗑 Delete Account
        </button>
      </div>
    </div>
  );
};

export default DoctorAccount;
