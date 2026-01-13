import React, { useState } from "react";
import { useSelector } from "react-redux";

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
    <div className="flex-1 min-h-screen bg-transparent flex justify-center items-start p-4 md:p-10">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-center text-teal-600 mb-6">
          Account Information
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-600">
            Email:
          </label>
          <p className="text-gray-800 mt-1 flex items-center gap-2">
            {user?.email || "doctor@email.com"}
            <span className="text-green-500">✔</span>
          </p>
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-600">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-600">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Specialty */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-600">
            Specialty*
          </label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option>Emergency medicine</option>
            <option>General medicine</option>
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Pediatrics</option>
          </select>
        </div>

        {/* Buttons */}
        <button
          onClick={handleUpdate}
          className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700 transition"
        >
          Update
        </button>

        <button
          onClick={handleDelete}
          className="w-full mt-4 bg-blue-400 text-white py-3 rounded-md font-semibold hover:bg-blue-500 transition"
        >
          🗑 Delete Account
        </button>
      </div>
    </div>
  );
};

export default DoctorAccount;
