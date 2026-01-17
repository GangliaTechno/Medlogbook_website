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
    } catch (err) {
      alert(err.message || "Invalid email or password");
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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/90 text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={() => {
              const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
              window.location.href = `${apiUrl}/google`;
            }}
            className="w-full py-4 px-6 rounded-full bg-white border-2 border-gray-300 
                       hover:border-gray-400 hover:shadow-lg transition-all duration-200
                       flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-semibold">Sign in with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
