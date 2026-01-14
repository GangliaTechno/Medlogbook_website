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
  FaSearch,
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
    return roleMatch && (user.fullName?.toLowerCase().includes(search) || user.email?.toLowerCase().includes(search));
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
    <div className="relative min-h-screen w-full">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${medicalBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "contrast(1.2) brightness(1.1)",
        }}
      />
      <div className="fixed inset-0 bg-white/40 z-0"></div>

      {/* CONTENT */}
      <div className="relative z-10 px-3 py-6 sm:px-6 sm:py-10">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">

          <div className="p-5 sm:p-8 bg-blue-50/50">
            <h2 className="text-center text-2xl sm:text-3xl font-black text-blue-800 mb-1">
              Admin Panel
            </h2>
            <p className="text-center text-sm sm:text-base text-gray-600 mb-8">
              Manage system users and access levels
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                disabled={!selectedUsers.length}
                onClick={() => handleBatchStatus("enabled")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold bg-emerald-500 shadow-lg active:scale-95 transition disabled:opacity-30"
              >
                <FaCheckCircle /> Enable
              </button>

              <button
                disabled={!selectedUsers.length}
                onClick={() => handleBatchStatus("disabled")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold bg-rose-500 shadow-lg active:scale-95 transition disabled:opacity-30"
              >
                <FaTimesCircle /> Disable
              </button>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                <FilterButton active={roleFilter === "all"} icon={<FaUsers />} label="All" onClick={() => setRoleFilter("all")} />
                <FilterButton active={roleFilter === "student"} icon={<FaUserGraduate />} label="Students" onClick={() => setRoleFilter("student")} />
                <FilterButton active={roleFilter === "doctor"} icon={<FaUserMd />} label="Doctors" onClick={() => setRoleFilter("doctor")} />
              </div>

              <div className="relative max-w-2xl mx-auto">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition bg-white"
                />
              </div>
            </div>
          </div>

          {/* TABLE / CARD VIEW */}
          <div className="p-3 sm:p-8">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-blue-100 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="p-4 text-left font-bold">Full Name</th>
                    <th className="p-4 text-left font-bold">Email Address</th>
                    <th className="p-4 text-left font-bold">Role</th>
                    <th className="p-4 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.email}
                      onDoubleClick={() => openEditModal(user)}
                      className="hover:bg-blue-50 transition cursor-pointer"
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded"
                          checked={selectedUsers.includes(user.email)}
                          onChange={() => handleSelectUser(user.email)}
                        />
                      </td>
                      <td className="p-4 font-medium text-gray-900">{user.fullName}</td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 capitalize">{user.role}</span></td>
                      <td className="p-4"><StatusBadge status={user.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.email);
                return (
                  <div
                    key={user.email}
                    className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-sm
          ${isSelected
                        ? 'border-blue-600 bg-blue-100 ring-2 ring-blue-400/20'
                        : 'border-blue-200 bg-blue-50/50'}`}
                    onClick={() => handleSelectUser(user.email)}
                  >
                    {/* Card Header */}
                    <div className={`px-4 py-3 flex items-center justify-between border-b 
          ${isSelected ? 'border-blue-300 bg-blue-200/50' : 'border-blue-100 bg-blue-100/30'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-blue-400 text-blue-600 focus:ring-blue-500"
                          checked={isSelected}
                          readOnly
                        />
                        <p className="font-black text-blue-900 text-sm">{user.fullName}</p>
                      </div>
                      <StatusBadge status={user.status} />
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <div className="flex flex-col gap-1 mb-4">
                        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Email Address</span>
                        <p className="text-gray-700 text-sm truncate font-medium">{user.email}</p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block mb-1">Role</span>
                          <span className="px-3 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 text-xs font-black uppercase">
                            {user.role}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(user);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95 transition"
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedUser && (
        <EditUserModal isOpen={isModalOpen} user={selectedUser} onClose={() => setIsModalOpen(false)} />
      )}

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() => setNotification({ ...notification, isOpen: false })}
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
    className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold transition text-xs sm:text-sm
    ${active ? "bg-blue-600 text-white shadow-lg scale-105" : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"}`}
  >
    {icon} {label}
  </button>
);

const StatusBadge = ({ status }) => {
  const isEnabled = status === "enabled" || status === "active";
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter sm:tracking-normal
      ${isEnabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {status}
    </span>
  );
};

export default AdminPage;