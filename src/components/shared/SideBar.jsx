import { LogOut, Wrench, User, ChevronRight, Calendar, ChevronLeft, Package, Users, ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Tooltip from "./Tooltip";
import { useState, useEffect } from "react";

const SideBar = ({ active = "repairs" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? saved === 'true' : true;
  });
  const isAdmin = user.userType === "ADMINISTRATOR";


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Atalho Ctrl+S para toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleToggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const menuItems = isAdmin
    ? [
      {
        id: "repairs",
        label: "Consertos",
        icon: Wrench,
        path: "/repairs",
      },
      {
        id: "storage",
        label: "Estoque",
        icon: Package,
        path: "/storage"
      },
      {
        id: "clients",
        label: "Clientes",
        icon: Users,
        path: "/clients"
      },
      {
        id: "calendar",
        label: "Calendário",
        icon: Calendar,
        path: "/calendar"
      },
      {
        id: "dashboard",
        label: "Dashboard",
        icon: ChartBar,
        path: "/clients"
      }
    ]
    : [
      {
        id: "repairs",
        label: "Consertos",
        icon: Wrench,
        path: "/my-repairs",
      },
      {
        id: "calendar",
        label: "Calendário",
        icon: Calendar,
        path: "/calendar",
      },
      {
        id: "visita",
        label: "Visita Técnica",
        icon: Calendar,
        path: "/visit",
      },
    ];

  const handleToggleSidebar = () => {
    setIsOpen(prev => {
      const newState = !prev;
      localStorage.setItem("sidebarOpen", String(newState));
      return newState;
    });
  };

  return (
    <div className="flex relative">
      <aside className={`${isOpen ? 'w-64' : 'w-20'} text-white border-r bg-[#041a2d] border-gray-200 flex flex-col shadow-sm transition-all duration-300 ease-in-out relative`}>
        <div className={`p-5 border-b border-gray-100 ${!isOpen && 'px-3'}`}>
          <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#041A2D] to-[#062E4F] flex items-center justify-center ring-2 ring-gray-100">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
            {isOpen && (
              <div className="flex-1 text-white min-w-0">
                <div className="font-semibold truncate text-sm">
                  {user?.name || "Usuário"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email || (user?.name ? `${user.name.toLowerCase()}@email.com` : "email@email.com")}
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col space-y-1">
          {isOpen && (
            <div className="px-3 mb-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Menu
              </h2>
            </div>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            const buttonContent = (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  group w-full flex items-center ${isOpen ? 'gap-3' : 'justify-center'} p-3 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${isActive
                    ? `${isAdmin ? "bg-[#ba4610]" : "bg-[#0037a7]"} text-white shadow-md`
                    : `hover:bg-[#000f1d]`
                  }
                `}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`} />
                {isOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    )}
                  </>
                )}
              </button>
            );

            if (!isOpen) {
              return (
                <Tooltip key={item.id} content={item.label} side="right">
                  {buttonContent}
                </Tooltip>
              );
            }

            return buttonContent;
          })}
        </nav>

        <div className="p-3 border-t border-gray-800 bg-[#041a2d]">
          {isOpen ? (
            <button
              onClick={handleLogout}
              className="
                group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                 hover:bg-[#000f1d] hover:text-red-600
                transition-all duration-200 ease-in-out
              "
            >
              <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              <span className="flex-1 text-left">Sair</span>
            </button>
          ) : (
            <Tooltip content="Sair" side="right">
              <button
                onClick={handleLogout}
                className="
                  group w-full flex items-center justify-center py-2.5 rounded-lg text-sm font-medium
                  hover:bg-[#000f1d]  hover:text-red-600
                  transition-all duration-200 ease-in-out
                "
              >
                <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              </button>
            </Tooltip>
          )}
        </div>
      </aside>

      <div className="flex items-start pt-5 pl-2">
        <Tooltip content={isOpen ? "Recolher (Ctrl+S)" : "Expandir (Ctrl+S)"} side="right">
          <button
            onClick={handleToggleSidebar}
            className="p-2 bg-white border border-gray-200 rounded-lg shadow-md text-gray-600 hover:bg-gray-50 hover:text-[#041A2D] transition-all duration-200 hover:shadow-lg"
            aria-label={isOpen ? "Recolher menu (Ctrl+S)" : "Expandir menu (Ctrl+S)"}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default SideBar;
