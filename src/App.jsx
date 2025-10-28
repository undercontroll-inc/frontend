import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ComponentRepair from "./components/customer/ComponentRepair";
import ComponentDetails from "./components/customer/ComponentDetails";
import ComponentVisit from "./components/customer/ComponentVisit";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Calendar from "./components/admin/Calendar";
import { RepairPage } from "./components/admin/RepairPage";
import { ClientsPage } from "./components/admin/ClientsPage";
import Toaster from "./components/shared/Toaster";
import { LandingPage } from "./components/landing_page/LandingPage";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["ADMINISTRATOR"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Rota /repairs para ADMINISTRATOR - Admin RepairPage */}
            <Route
              path="/repairs"
              element={
                <ProtectedRoute roles={["ADMINISTRATOR"]}>
                  <RepairPage />
                </ProtectedRoute>
              }
            />

            {/* Rota /clients para ADMINISTRATOR - ClientsPage */}
            <Route
              path="/clients"
              element={
                <ProtectedRoute roles={["ADMINISTRATOR"]}>
                  <ClientsPage />
                </ProtectedRoute>
              }
            />

            {/* Rota /my-repairs para COSTUMER - ComponentRepair */}
            <Route
              path="/my-repairs"
              element={
                <ProtectedRoute roles={["COSTUMER"]}>
                  <ComponentRepair />
                </ProtectedRoute>
              }
            />

            <Route
              path="/repairs/:id"
              element={
                <ProtectedRoute>
                  <ComponentDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/visit"
              element={
                <ProtectedRoute>
                  <ComponentVisit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orcamentos"
              element={
                <ProtectedRoute>
                  <ComponentVisit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
