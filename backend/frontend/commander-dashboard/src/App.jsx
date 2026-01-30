import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from "react-router-dom";
import Login from "./pages/Login.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Missions from "./pages/Missions.jsx";
import Tasks from "./pages/Tasks.jsx";
import SosAlerts from "./pages/SosAlerts.jsx";
import AiInsights from "./pages/AiInsights.jsx";

function ProtectedDashboard() {
  const token = localStorage.getItem("drishti_token");
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.replace(/^\/dashboard\/?/, "") || "missions";
  const activeItem = path === "missions" ? "missions" : path === "tasks" ? "tasks" : path === "sos" ? "sos" : path === "insights" ? "insights" : "";

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const handleNav = (key) => {
    navigate(`/dashboard/${key}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("drishti_token");
    localStorage.removeItem("drishti_role");
    navigate("/login", { replace: true });
  };

  return (
    <DashboardLayout activeItem={activeItem} onNav={handleNav} onLogout={handleLogout}>
      <Outlet />
    </DashboardLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedDashboard />}>
          <Route index element={<Navigate to="missions" replace />} />
          <Route path="missions" element={<Missions />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="sos" element={<SosAlerts />} />
          <Route path="insights" element={<AiInsights />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
