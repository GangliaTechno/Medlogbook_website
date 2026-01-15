import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../reducers/authReducer";
import loginBg from "../assets/login_bg.png";

const AdminLoginForm = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = await dispatch(loginUser(formData)).unwrap();
      const { token, role } = payload;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "doctor") navigate("/doctor", { replace: true });
      else if (role === "student") navigate("/logbookpage", { replace: true });
    } catch {
      alert("Invalid email or password");
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-6
                 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${loginBg})`,
        imageRendering: "auto",        // keep natural sharpness
      }}
    >
      {/* Login Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl px-6 sm:px-10 py-10">
        <h2 className="text-center text-3xl font-extrabold text-blue-700 mb-8">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <input
            type="email"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            placeholder="Email ID"
            required
            className="w-full px-5 py-4 rounded-full outline-none text-sm shadow-md
                       focus:ring-2 focus:ring-blue-400"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-5 py-4 rounded-full outline-none text-sm shadow-md
                       focus:ring-2 focus:ring-blue-400"
          />

          {/* Forgot password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() =>
                navigate("/forgot-password", {
                  state: { email: formData.emailId },
                })
              }
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full text-white font-semibold text-lg
                       transition-transform hover:scale-[1.02] disabled:opacity-50"
            style={{
              background:
                "linear-gradient(90deg, #21c8f6 0%, #8f5cff 100%)",
              boxShadow: "0 12px 25px rgba(143, 92, 255, 0.35)",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
