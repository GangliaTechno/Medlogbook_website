import React, { useState } from "react";
import { FaUsers, FaUserGraduate, FaUserMd } from "react-icons/fa";
import medicalBg from "../assets/medicalBg.png";

const AdminUserTable = ({ users, onApprove, onReject }) => {
  const [filter, setFilter] = useState("all");

  const filteredUsers =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  return (
    /* 🌄 SHARP BACKGROUND */
    <div
      className="relative min-h-screen w-full flex justify-center items-start py-14"
      style={{
        backgroundImage: `url(${medicalBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "contrast(1.15) saturate(1.15)",
      }}
    >
      {/* light overlay (no blur) */}
      <div className="absolute inset-0 bg-white/30"></div>

      {/* 🧊 TABLE CARD */}
      <div
        className="relative z-10 bg-white/95 rounded-3xl shadow-2xl px-8 py-6"
        style={{ width: "70%", maxWidth: "1100px" }}
      >
        {/* TITLE */}
        <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-8">
          Registered Users
        </h2>

        {/* FILTER BUTTONS */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            <FaUsers size={18} /> All
          </button>

          <button
            onClick={() => setFilter("student")}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold ${
              filter === "student"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            <FaUserGraduate size={18} /> Students
          </button>

          <button
            onClick={() => setFilter("doctor")}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold ${
              filter === "doctor"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            <FaUserMd size={18} /> Doctors
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-blue-100">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.email}
                    className={`transition ${
                      index % 2 === 0
                        ? "bg-blue-50"
                        : "bg-white"
                    } hover:bg-blue-100`}
                  >
                    <td className="px-5 py-3 font-semibold text-gray-800">
                      {user.fullName}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-5 py-3 capitalize">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "student"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === "approved"
                            ? "bg-green-200 text-green-800"
                            : user.status === "rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {user.status || "pending"}
                      </span>
                    </td>
                    <td className="px-5 py-3 flex gap-2">
                      <button
                        className="bg-green-500 text-white px-4 py-1 rounded-full text-xs hover:bg-green-600"
                        onClick={() => onApprove(user.email)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded-full text-xs hover:bg-red-600"
                        onClick={() => onReject(user.email)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserTable;
