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
import AnnouncementsCustomer from "./components/customer/AnnouncementsCustomer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NewPassword from "./components/auth/NewPassword";
import Dashboard from "./components/dashboard/Dashboard";
import AnalyticsDashboard from "./components/dashboard/AnalyticsDashboard";
import Calendar from "./components/admin/Calendar";
import { RepairPage } from "./components/admin/RepairPage";
import { ClientsPage } from "./components/admin/ClientsPage";
import Toaster from "./components/shared/Toaster";
import { LandingPage } from "./components/landing_page/LandingPage";
import { AnnouncementsPage } from "./components/landing_page/AnnouncementsPage";
import AnnouncementsAdmin from "./components/admin/AnnouncementsAdmin";
import { Estoque } from "./components/admin/Estoque";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import SettingsPage from "./components/shared/SettingsPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/nova-senha" element={<NewPassword />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={["ADMINISTRATOR"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute roles={["ADMINISTRATOR"]}>
                    <AnalyticsDashboard />
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

              {/* Rota /admin/announcements para ADMINISTRATOR - AnnouncementsAdmin */}
              <Route
                path="/admin/announcements"
                element={
                  <ProtectedRoute roles={["ADMINISTRATOR"]}>
                    <AnnouncementsAdmin />
                  </ProtectedRoute>
                }
              />

              {/* Rota /my-repairs para COSTUMER - ComponentRepair */}
              <Route
                path="/my-repairs"
                element={
                  <ProtectedRoute roles={["CUSTOMER"]}>
                    <ComponentRepair />
                  </ProtectedRoute>
                }
              />

              {/* Rota /customer-announcements para CUSTOMER - AnnouncementsCustomer */}
              <Route
                path="/customer-announcements"
                element={
                  <ProtectedRoute roles={["CUSTOMER"]}>
                    <AnnouncementsCustomer />
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

              <Route
                path="/storage"
                element={
                  <ProtectedRoute>
                    <Estoque />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <Toaster />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
