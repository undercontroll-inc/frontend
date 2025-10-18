import { LogOut, Wrench, Briefcase, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const SideBar = ({ active = "repairs" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-56 bg-gray-400 text-white flex flex-col">
      {/* User Info */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#041A2D] flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {user?.name || "Usuário"}
            </div>
            <div className="text-sm text-gray-900">
              {user?.name
                ? `${user.name.toLowerCase()}@email.com`
                : "email@email.com"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        <button
          className={`w-full flex items-center gap-3 px-6 py-3 text-left ${
            active === "repairs"
              ? "bg-[#041A2D] text-white"
              : "hover:bg-[#062E4F] hover:text-white transition-colors text-gray-900"
          }`}
          onClick={() => navigate("/repairs")}
        >
          <Wrench className="h-5 w-5" />
          <span>Consertos</span>
        </button>
        <button
          onClick={() => navigate("/visit")}
          className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-[#062E4F] hover:text-white transition-colors ${
            active === "visita" ? "text-white bg-[#041A2D]" : "text-gray-900"
          }`}
        >
          <Briefcase className="h-5 w-5" />
          <span>Visita Técnica</span>
        </button>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-600">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-800 hover:text-white transition-colors rounded text-gray-900"
        >
          <LogOut className="h-5 w-5" />
          <span>Encerrar sessão</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
