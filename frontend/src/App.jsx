import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

/* Auth Pages */
import LoginPage from "./pages/AdminLoginForm";
import RegistrationPage from "./pages/RegistrationPage";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* Common Pages */
import AccountPage from "./pages/AccountPage";
import Support from "./pages/Support";

/* Student */
import LogbookPage from "./pages/LogbookPage";
import ReportsPage from "./pages/ReportsPage";
import GoalProgression from "./pages/GoalProgression";
import StudentEntries from "./pages/StudentEntries";
import GeneratedForm from "./pages/GeneratedForm";
import AssignedTasksPage from "./pages/AssignedTasksPage";
import AnalysisPage from "./pages/AnalysisPage";
import JobsPage from "./pages/JobsPage";
import ViewEntriesPage from "./pages/ViewEntriesPage";
import StudentWrapper from "./layouts/StudentWrapper";

/* Doctor */
import DoctorHome from "./pages/DoctorHome";
import CategoryForm from "./pages/CategoryForm";
import AddCategory from "./pages/AddCategory";
import DoctorStudentAnalysisPage from "./pages/DoctorStudentAnalysisPage";
import AssignTaskPage from "./pages/AssignTaskPage";
import CategoryList from "./pages/CategoryList";
import DoctorAccount from "./pages/DoctorAccount";
import ManageLogbook from "./pages/ManageLogbook";
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorLogbook from "./pages/DoctorLogbook";
/*import StudentEntries from "./pages/StudentEntries";*/


/* Admin */
import AdminHome from "./pages/AdminHome";
import AdminPage from "./pages/AdminPage";
import PendingApproval from "./pages/PendingApproval";
import AdminSupportPage from "./pages/AdminSupportPage";
import AdminSidebar from "./Components/AdminSidebar";

/* ================= ADMIN LAYOUT ================= */
const AdminLayout = () => (
  <div className="flex min-h-screen w-screen">
    <div className="hidden md:block w-[250px] flex-shrink-0">
      <AdminSidebar />
    </div>

    <div className="md:hidden">
      <AdminSidebar />
    </div>

    <div className="flex-1 overflow-y-auto p-4 pt-20 md:p-6 bg-gradient-to-br from-white via-[#e8f5fe] to-[#dbefff]">
      <Outlet />
    </div>
  </div>
);

/* ================= APP ================= */
const App = () => (
  <Router>
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
      <Route element={<StudentWrapper />}>
        <Route path="/logbookpage" element={<LogbookPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/goal-progression" element={<GoalProgression />} />
        <Route path="/student-entries" element={<StudentEntries />} />
        <Route path="/assign-task" element={<AssignTaskPage />} />
        <Route path="/assigned-tasks" element={<AssignedTasksPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/view-entries" element={<ViewEntriesPage />} />
        <Route path="/logbook/:category" element={<GeneratedForm />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/support" element={<Support />} />
      </Route>

      {/* Doctor (UNCHANGED) */}
      <Route path="/doctor/*" element={<DoctorLayout />}>
        <Route index element={<DoctorHome />} />
        <Route path="view-students" element={<DoctorLogbook />} />
        <Route path="student-entries" element={<StudentEntries />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="categories/:category" element={<CategoryForm />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="assign-task" element={<AssignTaskPage />} />
        <Route path="student-analysis" element={<DoctorStudentAnalysisPage />} />
        <Route path="account" element={<DoctorAccount />} />
      </Route>

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
  </Router>
);

export default App;
