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
import Toaster from "./components/shared/Toaster";
import { LandingPage } from "./components/landing_page/LandingPage";
import { Estoque } from "./components/admin/Estoque";

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
                <ProtectedRoute roles={["ADMIN"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/repairs"
              element={
                <ProtectedRoute>
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
              path="/storage"
              element={
                <ProtectedRoute>
                  <Estoque />
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
