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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleSelectUser = (email) => {
    setSelectedUsers((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((u) => u.email));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBatchStatus = async (status) => {
    for (const email of selectedUsers) {
      try {
        await axios.put("http://localhost:5000/api/auth/user/update-status", {
          email,
          status,
        });
        setUsers((prev) =>
          prev.map((u) => (u.email === email ? { ...u, status } : u))
        );
      } catch (err) {
        setNotification({
          isOpen: true,
          title: "Error",
          message: `Failed to update status for ${email}`,
          type: "error",
        });
      }
    }
    setNotification({
      isOpen: true,
      title: "Status Updated",
      message: `Selected users have been ${status}.`,
      type: "success",
    });
    setSelectedUsers([]);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users/all");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Failed to fetch users.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pending-users");
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch pending users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingUsers();
  }, []);

  const handleToggleStatus = async (email) => {
    const user = users.find((u) => u.email === email);
    const newStatus = user.status === "disabled" ? "enabled" : "disabled";
console.log("Sending to backend:", { email, status: newStatus });

    try {
      await axios.put("http://localhost:5000/api/auth/user/update-status", {
        email,
        status: newStatus,
      });

      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, status: newStatus } : u))
      );

      setNotification({
        isOpen: true,
        title: "Status Updated",
        message: `${user.fullName || user.email} is now ${newStatus}.`,
        type: "success",
      });
    } catch (err) {
      console.error("Failed to update status", err);
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Failed to update user status.",
        type: "error",
      });
    }
  };

  // Merge users and pending users, always showing rejected users (from either list) with status 'rejected'
  // 1. Build a map of users by email, preferring rejected status if present
  const userMap = new Map();
  // Add all users from main users array
  users.forEach(u => {
    userMap.set(u.email, { ...u });
  });
  // Add/override with pending users
  pendingUsers.forEach(u => {
    if (u.status === 'rejected') {
      userMap.set(u.email, { ...u });
    } else if (!userMap.has(u.email)) {
      userMap.set(u.email, { ...u });
    }
  });
  // If a user is in both lists and is rejected in either, set status to rejected
  users.forEach(u => {
    const pending = pendingUsers.find(p => p.email === u.email);
    if (pending && (pending.status === 'rejected' || u.status === 'rejected')) {
      userMap.set(u.email, { ...u, status: 'rejected' });
    }
  });
  let allUsers = Array.from(userMap.values());

  const filteredUsers = allUsers.filter((user) => {
    const lowerSearch = searchTerm.toLowerCase();
    const roleMatch =
      roleFilter === "all" || user.role?.toLowerCase() === roleFilter;
    return (
      roleMatch && user.fullName?.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    
    <div
  className=" px-4 py-6 text-black min-h-screen"
  style={{
    maxWidth: "1400px", // or whatever wide value you want
    width: "100%", 
    background: "linear-gradient(0deg, rgb(255, 255, 255), rgba(219, 239, 245, 1))",
    borderRadius: "40px",
    border: "5px solid bg-gray",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 30px 30px -20px",
  }}
>

      {/* Batch Enable/Disable Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className="px-4 py-2 rounded-lg bg-green-500 text-black font-semibold disabled:opacity-50"
          disabled={selectedUsers.length === 0}
          onClick={() => handleBatchStatus("enabled")}
        >
          Enable
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50"
          disabled={selectedUsers.length === 0}
          onClick={() => handleBatchStatus("disabled")}
        >
          Disable
        </button>
      </div>
      
      <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Admin Panel</h2>
      <p className="text-center text-gray-400 text-lg mb-6">
        Manage users, update their roles, or enable/disable access.
      </p>

      {/* Role Filters */}
        <div className="mb-6 flex justify-center gap-4">
          {["student", "doctor"].map((role) => (
            <button
              key={role}
              className={`px-4 py-2 rounded-lg ${
                roleFilter === role
                  ? "bg-blue-400 text-white font-semibold"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
              onClick={() => setRoleFilter(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          style={{
    width: "100%",
    background: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "20px",
    marginTop: "15px",
    boxShadow: "#cff0ff 0px 10px 10px -5px",
    borderInline: "2px solid transparent",
    color: "#000",
    outline: "none",
    fontSize: "14px"
  }}
  onFocus={(e) =>
    (e.target.style.borderInline = "2px solid #12b1d1")
  }
  onBlur={(e) =>
    (e.target.style.borderInline = "2px solid transparent")
  }
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading users...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 overflow-x-auto w-[700px] ml-0">
          <table className="min-w-[700px] table-fixed text-sm sm:text-base">
            <thead>
              <tr className="bg-white text-black text-left">
                <th className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={e => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.email}
                    className={`border-b border-gray-700 hover:bg-gray-700/50 transition ${(user.status === 'disabled' || user.status === 'rejected') ? 'opacity-60 bg-gray-900' : ''}`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.email)}
                        onChange={() => handleSelectUser(user.email)}
                        disabled={user.status === 'rejected'}
                      />
                    </td>
                    <td className={`p-3 ${user.status === 'disabled' || user.status === 'rejected' ? 'line-through text-gray-400' : user.status === 'pending' ? 'text-yellow-400 font-semibold' : ''}`}>{user.fullName}</td>
                    <td className={`p-3 ${user.status === 'disabled' || user.status === 'rejected' ? 'text-gray-400' : user.status === 'pending' ? 'text-yellow-400 font-semibold' : ''}`}>{user.email}</td>
                    <td className={`p-3 capitalize ${user.status === 'disabled' || user.status === 'rejected' ? 'text-gray-400' : user.status === 'pending' ? 'text-yellow-400 font-semibold' : ''}`}>{user.role}</td>
                    <td className={`p-3 capitalize ${user.status === 'disabled' || user.status === 'rejected' ? 'text-gray-400' : user.status === 'pending' ? 'text-yellow-400 font-semibold' : ''}`}>{user.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedUser && (
        <EditUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onUpdate={(updatedUser) => {
            setUsers((prev) =>
              prev.map((u) =>
                u.email === selectedUser.email ? { ...u, ...updatedUser } : u
              )
            );
            setNotification({
              isOpen: true,
              title: "Updated",
              message: `${updatedUser.fullName || selectedUser.email}'s profile updated successfully.`,
              type: "success",
            });
            setIsModalOpen(false);
          }}
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
