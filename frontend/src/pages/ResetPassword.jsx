import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Notification from "../Components/Notification";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { userId, token } = useParams();

  // const validatePassword = (password) => {
  //   const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  //   return regex.test(password);
  // };

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Please enter both password fields.",
        type: "error",
      });
      return;
    }

    // Commented out validations for testing
    // if (!validatePassword(password)) {
    //   setNotification({
    //     isOpen: true,
    //     title: "Error",
    //     message: "Password must be at least 8 characters long and contain a letter and a number.",
    //     type: "error",
    //   });
    //   return;
    // }

    // if (password !== confirmPassword) {
    //   setNotification({
    //     isOpen: true,
    //     title: "Error",
    //     message: "Passwords do not match.",
    //     type: "error",
    //   });
    //   return;
    // }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${userId}/${token}`,
        { password }
      );

      if (data.success) {
        setNotification({
          isOpen: true,
          title: "Success",
          message: "Your password has been successfully reset.",
          type: "success",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setNotification({
          isOpen: true,
          title: "Error",
          message: data.message || "Failed to reset password. Try again later.",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        isOpen: true,
        title: "Error",
        message: error.response?.data?.message || "Server error. Try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-full w-full">
      <div className="flex w-[800px] max-w-[90%] bg-white/10 shadow-md rounded-md text-white">
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-center text-xl mb-5 font-bold text-teal-400">Reset Your Password</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label className="mb-1 block font-bold">New Password</label>
            <input
              className="w-full p-3 mb-4 rounded-md bg-white/20 text-white"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="mb-1 block font-bold">Confirm New Password</label>
            <input
              className="w-full p-3 mb-4 rounded-md bg-white/20 text-white"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full p-3 bg-[#008080] cursor-pointer mb-4 text-sm hover:bg-[#283e3e] transition duration-300 rounded-md"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

      <Notification
        isOpen={notification.isOpen}
        onRequestClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </section>
  );
};

export default ResetPassword;
