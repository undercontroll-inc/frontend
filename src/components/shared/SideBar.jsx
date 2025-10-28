import { Wrench, ChevronRight, Calendar, ChevronLeft, Package, Users, ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Tooltip from "./Tooltip";
import UserDropdown from "./UserDropdown";
import { useState, useEffect } from "react";
import Foto from "../../../public/images/logo_pelluci.jpg";

const SideBar = ({ active = "repairs" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? saved === 'true' : true;
  });
  const isAdmin = user.userType === "ADMINISTRATOR";

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

  const handleToggleSidebar = () => {
    setIsOpen(prev => {
      const newState = !prev;
      localStorage.setItem("sidebarOpen", String(newState));
      return newState;
    });
  };

  return (
    <div className="flex relative">
      <aside className={`${isOpen ? 'w-56' : 'w-16'} text-white border-r bg-[#0a1929] dark:bg-gray-950 border-gray-800 dark:border-gray-800 flex flex-col shadow-lg dark:shadow-gray-900/50 transition-all duration-300 ease-in-out relative`}>
        <div className={`p-4 border-b border-gray-800 ${!isOpen && 'px-2'}`}>
          <div className={`flex items-center ${isOpen ? 'gap-2' : 'justify-center'}`}>
            <div className="">
              <img
              width={50}
              height={50}
              src={Foto} 
              className="rounded-md"
              />
            </div>
            {isOpen && (
              <div className="flex-1">
                <div className="font-bold text-base text-white">Pelluci</div>
                <div className="text-xs text-gray-400">Sistema OS</div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-2 flex flex-col space-y-1 overflow-y-auto">
          {isOpen && (
            <div className="px-3 py-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navegação
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
                  group w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-2'} py-2 rounded-md text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${isActive
                    ? `${isAdmin ? "bg-[#ba4610]" : "bg-[#0B4BCC]"} text-white`
                    : `text-gray-400 hover:bg-[#1e293b] hover:text-white`
                  }
                `}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "" : "group-hover:scale-110 transition-transform duration-200"}`} />
                {isOpen && (
                  <span className="flex-1 text-left text-sm">{item.label}</span>
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

        <div className="p-2 border-t border-gray-800">
          <UserDropdown isOpen={isOpen} />
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
