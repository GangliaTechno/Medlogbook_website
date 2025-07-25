import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../reducers/authReducer";
import Image from "../assets/photo/login.mp4";
import Notification from "../Components/Notification";
import { useEffect } from "react";
import LoaderGif from "../assets/loader.gif";

import { useLocation } from "react-router-dom";
const AdminLoginForm = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showLoader, setShowLoader] = useState(true);

  const [notification, setNotification] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const location= useLocation();
  const email = location.state?.email || ""; // Get email from location state 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error, loading } = useSelector((state) => state.auth);
  const videoRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });

    if ((e.target.name === "emailId" || e.target.name === "password") && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play();
    }
  };

  const handleBlur = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };
  useEffect(() => {
    if (email) {
      setFormData((prev) => ({ ...prev, emailId: email }));
    }
  }, [email]);
useEffect(() => {
  const timer = setTimeout(() => {
    setShowLoader(false);
  }, 3000); // 3 seconds

  return () => clearTimeout(timer); // cleanup
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailId || !formData.password) {
      setErrors({ login: "Email and Password are required." });
      setNotification({ isOpen: true, title: "Error", message: "Email and Password are required.", type: "error" });
      return;
    }


  const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      const userRole = result.payload.role; // Extract role from backend response
      console.log("✅ Login successful! Role:", userRole);
  
      if (userRole === "admin") {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
      } else if (userRole === "doctor") {
        navigate("/doctor-home");
      } else {
        navigate("/logbookpage");
      }
      
  
      setNotification({ isOpen: true, title: "Success", message: "Login successful! Redirecting...", type: "success" });
    // } else {
    //   console.log("❌ Invalid credentials");
    //   setErrors({ login: "Invalid email or password. Please register." });
    //   setNotification({ isOpen: true, title: "Error", message: "Invalid email or password.", type: "error" });
    // }
    } else if (result.payload?.error === "Account pending approval") {
  console.log("⏳ Approval pending");
  setErrors({ login: "Approval pending. Please wait for admin approval." });
  setNotification({ isOpen: true, title: "Pending", message: "Approval pending. Please wait for admin approval.", type: "warning" });
} else {
  console.log("❌ Invalid credentials");
  setErrors({ login: "Invalid email or password. Please register." });
  setNotification({ isOpen: true, title: "Error", message: "Invalid email or password.", type: "error" });
}
};




  const handleRegister = () => {
    navigate("/register");
  };

  const isForgotPasswordVisible = formData.emailId.toLowerCase() !== "admin@gmail.com";

  return (
    <section className="flex justify-center items-center h-full w-full">
      
      <div className="flex w-[800px] max-w-[90%] bg-white/10 shadow-md rounded-md text-black"
       style={{
    maxWidth: "1350px",
    background: "linear-gradient(0deg, rgb(255, 255, 255) 0%, rgba(219, 239, 245, 1) 100%)",
    borderRadius: "40px",
    padding: "25px 35px",
    border: "5px solid rgb(255, 255, 255)",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 30px 30px -20px",
    margin: "20px auto",
    position: "relative"
  }}>
        <div className="flex-1 p-8 flex flex-col justify-center">
         
          <h2 className="text-2xl font-bold text-blue-600 mb-6"
      style={{
    textAlign: "center",
    fontWeight: 900,
    fontSize: "30px",
    color: "rgb(16, 137, 211)"
  }}>Login</h2>
          <form onSubmit={handleSubmit}>
            <label className="mb-1 block font-bold">Email</label>
            <input
              className="w-full p-3 mb-4 rounded-md bg-white"
              type="email"
              placeholder="Enter your email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
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
              required
              
            />
            {errors.emailId && <div className="text-red-800 bg-red-200 border-l-2 border-red-500">{errors.emailId}</div>}

            <label className="mb-1 block font-bold">Password</label>
            <input
              className="w-full p-3 mb-4 rounded-md bg-black/20"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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
              required
            />
            {/* {errors.password && <div className="error">{errors.password}</div>}
            {errors.login && <div className="error">{errors.login}</div>} */}

            {isForgotPasswordVisible && (
              <button
              type="button"
              className="w-full px-6 py-3 rounded-[16px] cursor-pointer flex justify-center items-center gap-1.5 mt-2 text-white font-semibold transition-transform duration-200 shadow-md"
  style={{
    background: "linear-gradient(45deg, #b3d9ff, #7ab8f5)", // light blue tones
    boxShadow: "0 6px 12px rgba(122, 184, 245, 0.3)",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={() => navigate("/forgot-password", { state: { email: formData.emailId } })}
            >
              Forgot Password?
            </button>
            
            )}

            <div className="flex mt-5 gap-4">
              <button type="submit" className="w-full px-6 py-3 rounded-[20px] cursor-pointer font-semibold text-white shadow-md transition-transform duration-200"
  style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    boxShadow: "rgba(133, 189, 215, 0.88) 0px 10px 15px -10px",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              {/*<button type="button" onClick={handleRegister} className="w-full p-3 bg-[#44266c] cursor-pointer mb-4 text-sm hover:bg-[#261d32] transition duration-300 rounded-md">
                Register
              </button>*/}
            </div>
          </form>
        </div>
        {/*<div className="flex-1 hidden md:block relative min-w-[300px] h-full">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay loop muted>
            <source src={Image} type="video/mp4" />
          </video>
        </div>*/}
      </div>

      {/* Notification Modal */}
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

export default AdminLoginForm;
