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
    <div className="font-['Manrope'] min-h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10 px-4 sm:px-6 flex items-center justify-center">

      <div className="w-full max-w-2xl">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
            Doctor Profile
          </h1>
          <p className="text-slate-500">
            Manage your credentials and medical specialty.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-500"></div>

          <div className="p-8 sm:p-10">

            {/* Email Section */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <span className="flex-1 text-sm font-medium text-slate-600 truncate">
                  {user?.email || "doctor@example.com"}
                </span>
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                  <span className="text-xs font-bold uppercase tracking-wide">Verified</span>
                </div>
              </div>
            </div>

            {/* Name & Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Specialty */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Medical Specialty
              </label>
              <div className="relative">
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow cursor-pointer"
                >
                  <option>Emergency medicine</option>
                  <option>General medicine</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
              >
                Update Profile
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-100 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
              >
                Delete Account
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAccount;
