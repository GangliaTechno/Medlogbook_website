import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../Components/Notification";
import EditUserModal from "../Components/EditUserModal";
import medicalBg from "../assets/medicalBg.png";

import {
  FaUsers,
  FaUserGraduate,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchPendingUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://medlogbook-website.onrender.com/api/auth/users/all"
      );
      setUsers(res.data);
    } catch {
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Failed to fetch users",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get(
        "https://medlogbook-website.onrender.com/api/pending-users"
      );
      setPendingUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const userMap = new Map();
  users.forEach((u) => userMap.set(u.email, { ...u }));
  pendingUsers.forEach((u) => {
    if (u.status === "rejected" || !userMap.has(u.email)) {
      userMap.set(u.email, { ...u });
    }
  });

  const allUsers = Array.from(userMap.values());

  const filteredUsers = allUsers.filter((user) => {
    const search = searchTerm.toLowerCase();
    const roleMatch =
      roleFilter === "all" || user.role?.toLowerCase() === roleFilter;
    return roleMatch && user.fullName?.toLowerCase().includes(search);
  });

  const handleSelectUser = (email) => {
    setSelectedUsers((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedUsers(checked ? filteredUsers.map((u) => u.email) : []);
  };

  const handleBatchStatus = async (status) => {
    try {
      for (const email of selectedUsers) {
        await axios.put(
          "https://medlogbook-website.onrender.com/api/auth/user/update-status",
          { email, status }
        );
      }

      setUsers((prev) =>
        prev.map((u) =>
          selectedUsers.includes(u.email) ? { ...u, status } : u
        )
      );

      setSelectedUsers([]);
      setNotification({
        isOpen: true,
        title: "Success",
        message: `Selected users ${status}`,
        type: "success",
      });
    } catch {
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Batch update failed",
        type: "error",
      });
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${medicalBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "contrast(1.4) saturate(1.4) brightness(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-white/20"></div>

      {/* CONTENT */}
      <div className="relative z-10 px-4 py-8">
        {/* 🔵 LIGHT BLUE PANEL */}
        <div className="max-w-6xl mx-auto bg-blue-50/95 rounded-3xl shadow-2xl p-6">
          <h2 className="text-center text-3xl font-extrabold text-blue-700 mb-1">
            Admin Panel
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Manage users, roles and access
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              disabled={!selectedUsers.length}
              onClick={() => handleBatchStatus("enabled")}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold
              bg-gradient-to-r from-green-500 to-emerald-500
              shadow hover:scale-105 transition disabled:opacity-50"
            >
              <FaCheckCircle /> Enable
            </button>

            <button
              disabled={!selectedUsers.length}
              onClick={() => handleBatchStatus("disabled")}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold
              bg-gradient-to-r from-red-500 to-rose-500
              shadow hover:scale-105 transition disabled:opacity-50"
            >
              <FaTimesCircle /> Disable
            </button>
          </div>

          {/* FILTERS */}
          <div className="flex justify-center gap-4 mb-6">
            <FilterButton
              active={roleFilter === "all"}
              icon={<FaUsers />}
              label="All"
              onClick={() => setRoleFilter("all")}
            />
            <FilterButton
              active={roleFilter === "student"}
              icon={<FaUserGraduate />}
              label="Students"
              onClick={() => setRoleFilter("student")}
            />
            <FilterButton
              active={roleFilter === "doctor"}
              icon={<FaUserMd />}
              label="Doctors"
              onClick={() => setRoleFilter("doctor")}
            />
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 rounded-full shadow mb-6 outline-none"
          />

          {/* TABLE */}
          <div className="overflow-x-auto rounded-xl max-w-5xl mx-auto bg-blue-100">
            <table className="w-full text-sm">
              <thead className="bg-blue-200 text-blue-900">
                <tr>
                  <th className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="bg-blue-50">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.email}
                    onDoubleClick={() => openEditModal(user)}
                    className="border-b border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.email)}
                        onChange={() => handleSelectUser(user.email)}
                      />
                    </td>
                    <td className="p-3">{user.fullName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3 capitalize">{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && selectedUser && (
        <EditUserModal
          isOpen={isModalOpen}
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() =>
          setNotification({ ...notification, isOpen: false })
        }
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

const FilterButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition
    ${
      active
        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow"
        : "bg-gray-200 text-gray-700"
    }`}
  >
    {icon} {label}
  </button>
);

export default AdminPage;
