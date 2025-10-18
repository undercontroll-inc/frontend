import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/UserService';
import { getToken, saveToken, removeToken, isLoggedIn } from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (isLoggedIn()) {
        try {
          const token = getToken();
          if (token) {
            // Token format used by this demo is `token_<id>` (created at login)
            // Try to recover the user from the token by extracting the id
            const match = token.match(/^token_(\d+)$/);
            if (match) {
              const userId = Number(match[1]);
              try {
                const users = await apiService.get("/user");
                const foundUser = users.find((u) => Number(u.id) === userId);
                if (foundUser) {
                  setUser({ ...foundUser, token });
                } else {
                  // Fallback: keep token only if user not found
                  setUser({ token });
                }
              } catch (err) {
                console.error("Failed to fetch user for token:", err);
                setUser({ token });
              }
            } else {
              // If token doesn't follow expected format, keep token only
              setUser({ token });
            }
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          removeToken();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const result = await userService.auth(credentials.name, credentials.password);
      
      // Salva o token JWT vindo do backend
      if (result.success) {
        if (result.data?.token) {
          saveToken(result.data.token);
          setUser(result.data);
        }
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error || 'Credenciais inválidas' 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Erro inesperado ao fazer login'
      };
    }
  };

  const register = async (userData) => {
    const data = {
      ...userData,
      userType: "COSTUMER" // isso aqui não é seguro
    };
    
    try {
      const result = await userService.register(data);
      
      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || 'Erro ao criar conta'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Erro inesperado ao criar conta'
      };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
