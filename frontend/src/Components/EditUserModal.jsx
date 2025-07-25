import { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../Components/Notification";

const EditUserModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    trainingYear: "",
    hospital: "",
    specialty: "",
    role: "",
  });

  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        country: user.country || "",
        trainingYear: user.trainingYear || "",
        hospital: user.hospital || "",
        specialty: user.specialty || "",
        role: user.role || "student", // default to student
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


const handleSave = async () => {
  try {
    const originalEmail = user.email;

    // First, update all fields (excluding role)
    await axios.put("http://localhost:5000/api/auth/user/update", {
      originalEmail,
      ...formData,
    });

    // Then, update the role if it has changed
    if (formData.role !== user.role) {
      await axios.put("http://localhost:5000/api/auth/user/update-role", {
        email: originalEmail,
        role: formData.role,
      });
    }

    onUpdate(formData); // Update parent state
    onClose();

    setNotification({
      isOpen: true,
      title: "Success",
      message: "User profile and role updated successfully!",
      type: "success",
    });
  } catch (err) {
    console.error("Update failed", err);
    setNotification({
      isOpen: true,
      title: "Error",
      message: "Failed to update user profile or role.",
      type: "error",
    });
  }
};


  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md backdrop-brightness-75 flex items-center justify-center z-50 text-white">
        <div className="bg-gradient-to-br from-gray-500 via-gray-900 to-gray p-1 md:p-4 rounded-xl shadow-4xl w-[90%] max-w-lg transition-all border-1">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Edit User</h2>

          <div className="space-y-4 text-white">
            <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
            <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />

            {/* 🔁 Role Selector */}
            <div className="flex flex-col">
              <label htmlFor="role" className="mb-1 text-sm">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="white800 text-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                <option value="student">Student</option>
                <option value="doctor">Doctor</option>
                </select>
            </div>

            {/* 🔁 Conditional fields based on role */}
            {formData.role === "student" && (
              <>
                <InputField label="Country" name="country" value={formData.country} onChange={handleChange} />
                <InputField label="Training Year" name="trainingYear" value={formData.trainingYear} onChange={handleChange} />
                <InputField label="Hospital" name="hospital" value={formData.hospital} onChange={handleChange} />
              </>
            )}
            {(formData.role === "student" || formData.role === "doctor") && (
              <InputField label="Specialty" name="specialty" value={formData.specialty} onChange={handleChange} />
            )}
          </div>

          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              onClick={onClose}
              className="text-white underline hover:text-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2 rounded-md transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </>
  );
};

const InputField = ({ label, name, value, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1 text-sm text-white">{label}</label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="bg-transparent border border-gray-400 rounded-md px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default EditUserModal;
