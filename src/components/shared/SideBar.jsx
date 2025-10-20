import { LogOut, Wrench, Briefcase, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const SideBar = ({ active = "repairs" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      id: "repairs",
      label: "Consertos",
      icon: Wrench,
      path: "/repairs",
    },
    {
      id: "visita",
      label: "Visita Técnica",
      icon: Briefcase,
      path: "/visit",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* User Info */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#041A2D] to-[#062E4F] flex items-center justify-center ring-2 ring-gray-100 ring-offset-2">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate text-sm">
              {user?.name || "Usuário"}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {user?.email || (user?.name ? `${user.name.toLowerCase()}@email.com` : "email@email.com")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1">
        <div className="px-3 mb-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </h2>
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? "bg-[#041A2D] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#041A2D]"
                }
              `}
            >
              <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 opacity-70" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="
            group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-gray-700 hover:bg-red-50 hover:text-red-600
            transition-all duration-200 ease-in-out
          "
        >
          <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          <span className="flex-1 text-left">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
