import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Notification from "../Components/Notification";
import loginBg from "../assets/login_bg.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  useEffect(() => {
    if (emailFromState) setEmail(emailFromState);
  }, [emailFromState]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleReset = async () => {
    if (!email) {
      return setNotification({
        isOpen: true,
        title: "Error",
        message: "Please enter your email.",
        type: "error",
      });
    }

    if (!validateEmail(email)) {
      return setNotification({
        isOpen: true,
        title: "Error",
        message: "Please enter a valid email address.",
        type: "error",
      });
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://medlogbook-website.onrender.com/api/auth/forgot-password",
        { email }
      );

      setNotification({
        isOpen: true,
        title: data.success ? "Success" : "Error",
        message: data.success
          ? "A reset link has been sent to your email."
          : "Email not found in our database.",
        type: data.success ? "success" : "error",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        title: "Error",
        message:
          error.response?.data?.message ||
          "Server error. Try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🔥 FULL SCREEN SHARP BACKGROUND */
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* CARD */}
      <div
        className="w-[800px] max-w-[95%] bg-white/90 rounded-[40px] p-8 shadow-2xl"
        style={{
          border: "5px solid white",
          boxShadow: "rgba(133, 189, 215, 0.88) 0px 30px 30px -20px",
        }}
      >
        <h2 className="text-center text-3xl font-extrabold text-blue-700 mb-6">
          Reset Your Password
        </h2>

        <label className="font-bold mb-1 block">Email Address</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-6 py-4 rounded-full shadow-md outline-none
                     focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full mt-6 py-4 rounded-full text-white font-semibold
                     transition-transform hover:scale-[1.03]"
          style={{
            background:
              "linear-gradient(45deg, rgb(16,137,211), rgb(18,177,209))",
          }}
        >
          {loading ? "Sending Link..." : "Send Reset Link"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 py-3 rounded-full text-white font-semibold"
          style={{
            background: "linear-gradient(45deg, #b3d9ff, #7ab8f5)",
          }}
        >
          Back to Login
        </button>
      </div>

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

export default ForgotPassword;
