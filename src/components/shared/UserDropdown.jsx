import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ModeToggle } from "../shared/ModeToggle"

const UserDropdown = ({ isOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`
          w-full flex items-center gap-3 p-3 rounded-lg
          hover:bg-[#000f1d] transition-all duration-200
          ${isDropdownOpen ? 'bg-[#000f1d]' : ''}
          ${!isOpen && 'justify-center'}
        `}
      >
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-gray-700">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#041a2d] rounded-full"></div>
        </div>
        
        {isOpen && (
          <>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium truncate text-sm text-white">
                {user?.name || "Usuário"}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {user?.userType === "ADMINISTRATOR" ? "Admin" : "Usuário"}
              </div>
            </div>
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && isOpen && (
        <div className="absolute bottom-0 left-full ml-2 w-56 bg-[#0a1f35] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="p-3 border-b border-gray-700">
            <div className="text-sm font-medium text-white truncate">
              {user?.name || "Usuário"}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {user?.email || (user?.name ? `${user.name.toLowerCase()}@email.com` : "email@email.com")}
            </div>
          </div>
          
          <div className="p-1">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Navigate to settings if exists
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#000f1d] hover:text-white rounded-md transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </button>
            
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
          
          <div className="p-2 border-t border-gray-700">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-gray-400">Tema</span>
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
