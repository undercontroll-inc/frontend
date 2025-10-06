import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/UserService';
import { getToken, saveToken, removeToken, isLoggedIn } from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
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
            setUser({ token });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
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
      
      if (result.success) {
        // Salvar token se vier do backend
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
    try {
      const newUser = {
        ...userData,
        userType: "COSTUMER"
      };
      
      const result = await userService.register(newUser);
      
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
