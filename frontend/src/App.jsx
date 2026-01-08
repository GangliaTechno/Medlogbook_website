import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";

/* Sidebars */
import Sidebar from "./Components/Sidebar";
import DoctorSidebar from "./Components/DoctorSidebar";
import AdminSidebar from "./Components/AdminSidebar";

/* Auth Pages */
import LoginPage from "./pages/AdminLoginForm";
import RegistrationPage from "./pages/RegistrationPage";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* Pages */
import AccountPage from "./pages/AccountPage";
import Support from "./pages/Support";

/* Student */
import LogbookPage from "./pages/LogbookPage";
import ReportsPage from "./pages/ReportsPage";
import GoalProgression from "./pages/GoalProgression";
import StudentEntries from "./pages/StudentEntries";

/* Doctor */
import DoctorHome from "./pages/DoctorHome";
import DoctorLogbook from "./pages/DoctorLogbook";
import DoctorStudentAnalysisPage from "./pages/DoctorStudentAnalysisPage";
import AssignedTasksPage from "./pages/AssignedTasksPage";

/* Admin */
import AdminHome from "./pages/AdminHome";
import AdminPage from "./pages/AdminPage";
import PendingApproval from "./pages/PendingApproval";
import AssignTaskPage from "./pages/AssignTaskPage";
import AdminSupportPage from "./pages/AdminSupportPage";

/* Forms */
import DynamicForm from "./Components/DynamicCategoryForm";

import "./index.css";

/* ================= ADMIN LAYOUT ================= */
const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[250px] flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <AdminSidebar />
      </div>

      {/* Main Content (SCROLLS) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-white via-[#e8f5fe] to-[#dbefff]">
        <Outlet />
      </div>
    </div>
  );
};

/* ================= MAIN APP LAYOUT ================= */
const AppLayout = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // fallback to localStorage
  const role = user?.role || localStorage.getItem("role");

  const authRoutes = ["/", "/register", "/verify-otp", "/forgot-password"];
  const hideSidebar =
    authRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password");

  return (
    // ✅ FIXED: removed overflow-hidden
    <div className="flex min-h-screen w-screen">
      {/* Student / Doctor Sidebar */}
      {!hideSidebar && role !== "admin" && (
        <div className="hidden md:block w-[250px] flex-shrink-0">
          {role === "student" && <Sidebar />}
          {role === "doctor" && <DoctorSidebar />}
        </div>
      )}

      {/* Main Content (SCROLLS) */}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          {/* Auth */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:userId/:token"
            element={<ResetPassword />}
          />

          {/* Student */}
          <Route path="/logbookpage" element={<LogbookPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/goal-progression" element={<GoalProgression />} />
          <Route path="/student-entries" element={<StudentEntries />} />

          {/* Doctor */}
          <Route path="/doctor-home" element={<DoctorHome />} />
          <Route path="/doctor-logbook" element={<DoctorLogbook />} />
          <Route
            path="/doctor-student-analysis"
            element={<DoctorStudentAnalysisPage />}
          />
          <Route path="/assigned-tasks" element={<AssignedTasksPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="register" element={<RegistrationPage />} />
            <Route path="users" element={<AdminPage />} />
            <Route path="pending-approval" element={<PendingApproval />} />
            <Route path="assign-task" element={<AssignTaskPage />} />
            <Route path="support" element={<AdminSupportPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>

          {/* Common */}
          <Route path="/support" element={<Support />} />
          <Route path="/account" element={<AccountPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
