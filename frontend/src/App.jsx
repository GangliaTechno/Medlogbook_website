import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import DoctorSidebar from "./Components/DoctorSidebar"; // ✅ Import Doctor's Sidebar
import LoginPage from "./pages/AdminLoginForm";
import RegistrationPage from "./pages/RegistrationPage";
import LogbookPage from "./pages/LogbookPage";
import ReportsPage from "./pages/ReportsPage"; 
import AccountPage from "./pages/AccountPage";
import JobsPage from "./pages/JobsPage"; 
import ViewEntriesPage from "./pages/ViewEntriesPage";
import DoctorLogbook from "./pages/DoctorLogbook";
import ManageLogbook from "./pages/ManageLogbook";
import AddCategory from "./pages/AddCategory";
import CategoryForm from "./pages/CategoryForm";
import GeneratedForm from "./pages/GeneratedForm";
import Support from "./pages/Support"; 
import GoalProgression from "./pages/GoalProgression";
import StudentEntries from "./pages/StudentEntries"; 
import DynamicForm from "./Components/DynamicCategoryForm"; 
import DoctorHome from "./pages/DoctorHome";
import { useSelector } from "react-redux"; 
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPage from "./pages/AdminPage";
import AssignedTasksPage from "./pages/AssignedTasksPage";

import DoctorStudentAnalysisPage from './pages/DoctorStudentAnalysisPage';
import AnalysisPage from "./pages/AnalysisPage";
import AdminHome from "./pages/AdminHome";
import PendingApproval from "./pages/PendingApproval";
import AssignTaskPage from "./pages/AssignTaskPage";

import AdminSupportPage from "./pages/AdminSupportPage";

import "./index.css"; 

const AppLayout = () => {
  const location = useLocation();

  // ✅ Hide sidebar only for login and registration pages
  const isAuthRoute = (path) =>
    ["/", "/register", "/verify-otp", "/forgot-password"].includes(path) ||
    path.startsWith("/reset-password/");
  
  const hideSidebar = isAuthRoute(location.pathname);
  

  // ✅ Get user role from Redux store
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  return (
    <div className="flex md:flex-row flex-col h-screen">
      {!hideSidebar && (
  <div className="w-[250px] h-10 md:h-screen">
    {role === "doctor" ? (
      <DoctorSidebar />
    ) : role === "admin" ? (
      <AdminDashboard />
    ) : role === "student" ? (
      <Sidebar />
    ) : null}
  </div>
)}

         <div
  className="flex-1 p-5 overflow-y-auto bg-gradient-to-br from-white via-[#e8f5fe] to-[#dbefff] rounded-[30px] m-2.5"
  style={{ scrollbarWidth: "thin" }}
>

          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/logbookpage" element={<LogbookPage />} />
            <Route path="/reports" element={<ReportsPage />} /> 
            <Route path="/account" element={<AccountPage />} />
            <Route path="/manage-logbook" element={<ManageLogbook />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/category-form/:category" element={<CategoryForm />} />
            <Route path="/generated-form/:category" element={<GeneratedForm />} /> 
            <Route path="/support" element={<Support />} />
            <Route path="/goal-progression" element={<GoalProgression />} />
            <Route path="/jobs" element={<JobsPage />} /> 
            <Route path="/assign-task" element={<AssignTaskPage />} />
            <Route path="/view-entries" element={<ViewEntriesPage />} />
            <Route path="/doctor-logbook" element={<DoctorLogbook />} />
            <Route path="/student-entries" element={<StudentEntries />} />
            <Route path="/generated-form/:category" element={<DynamicForm />} />
            <Route path="/doctor-home" element={<DoctorHome />} />
            <Route path="/doctor-student-analysis" element={<DoctorStudentAnalysisPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            
<Route path="/assigned-tasks" element={<AssignedTasksPage />} />

            <Route path="/admin" element={<AdminDashboard />}>
            
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="users" element={<AdminPage />} />

            

            <Route path="support" element={<AdminSupportPage />} />
            <Route path="/admin/account" element={<AccountPage />} />
            <Route path="/admin/register" element={<RegistrationPage />} />


            </Route>
            <Route path="/pending-approval" element={<PendingApproval />} />
        

            <Route path="/verify-otp" element={<VerifyOtp />} /> 
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
          </Routes>

        </div>
      
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;