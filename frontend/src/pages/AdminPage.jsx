import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../Components/Notification";
import EditUserModal from "../Components/EditUserModal";

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

  /* ================= FETCH USERS ================= */

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
    } catch (err) {
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

  /* ================= MERGE USERS ================= */

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

  /* ================= SELECTION ================= */

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

  /* ================= BATCH ACTIONS ================= */

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

  /* ================= EDIT MODAL ================= */

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  /* ================= UI ================= */

  return (
    <div className="w-full min-h-screen px-2 sm:px-4 py-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-4 sm:p-6">
        <h2 className="text-center text-3xl font-extrabold text-blue-600 mb-2">
          Admin Panel
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Manage users, roles and access
        </p>

        {/* Batch buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            disabled={!selectedUsers.length}
            onClick={() => handleBatchStatus("enabled")}
            className="px-4 py-2 bg-green-500 rounded-lg font-semibold disabled:opacity-50"
          >
            Enable
          </button>
          <button
            disabled={!selectedUsers.length}
            onClick={() => handleBatchStatus("disabled")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            Disable
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {["all", "student", "doctor"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                roleFilter === role
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {role.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl shadow mb-6 outline-none"
        />

        {/* Table */}
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm sm:text-base">
              <thead className="bg-gray-100">
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
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.email}
                      onDoubleClick={() => openEditModal(user)}
                      className="border-b hover:bg-gray-50 cursor-pointer"
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
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

export default AdminPage;
