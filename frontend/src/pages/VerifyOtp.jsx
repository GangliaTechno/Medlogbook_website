
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import axios from "axios";
import Notification from "../Components/Notification";

const VerifyOtp = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const location = useLocation();
  const email = location.state?.email || ""; // Get email from location state
  useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ isOpen: false, title: "", message: "", type: "info" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.otp) {
      setErrors({ form: "Email and OTP are required." });
      setNotification({ isOpen: true, title: "Error", message: "Email and OTP are required.", type: "error" });
      return;
    }

    try {
      const { data } = await axios.post("https://medlogbook-website.onrender.com/api/auth/verify-otp", formData);
      setNotification({ isOpen: true, title: "Success", message: data.message, type: "success" });

      setTimeout(() => {
        navigate("/", {state: { email: formData.email }});
      }, 2000);
    } catch (error) {
      setNotification({
        isOpen: true,
        title: "Error",
        message: error.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    }
  };

  return (
    <section className="flex justify-center items-center h-full w-full">
      <div className="flex w-[800px] max-w-[90%] bg-white/10 shadow-md rounded-md text-black">
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-center text-xl mb-5 font-bold text-teal-400">Verify Your Email</h2>
          <form onSubmit={handleSubmit}>
            <label className="mb-1 block font-bold">Email</label>
                      <input
                          className="w-full p-3 mb-4 rounded-md bg-white/20 text-black"
                          type="email"
                          placeholder="Enter your email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          readOnly // ⬅️ prevent user from editing
                      />

            <label className="mb-1 block font-bold">OTP Code</label>
            <input
              className="w-full p-3 mb-4 rounded-md bg-white/20 text-black"
              type="text"
              placeholder="Enter the OTP"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full p-3 bg-[#008080] cursor-pointer mb-4 text-sm hover:bg-[#283e3e] transition duration-300 rounded-md"
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
            >
              Verify OTP
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

export default VerifyOtp;
