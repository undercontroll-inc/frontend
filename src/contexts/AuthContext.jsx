import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/UserService';
import { getToken, saveToken, saveUserData, getUserData, clearAuth, isLoggedIn } from '../utils/auth';

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
          const userData = getUserData();

          if (token && userData) {
            setUser(userData);
          } else if (token) {
            // Se tem token mas não tem dados do usuário, limpa tudo
            clearAuth();
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          clearAuth();
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
        if (result.data?.token) {
          // O backend retorna duas chaves, uma sendo o token de autenticação e outra os dados basicos do usuario.
          saveToken(result.data.token);
          saveUserData(result.data.user);
          setUser(result.data.user);
        }
        return { success: true, user: result.data.user };
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
        // Após registro bem-sucedido, faz login automático
        const loginResult = await login({
          name: userData.email,
          password: userData.password
        });

        // Se o usuário veio do Google, atualiza o avatar_url no userData salvo
        if (userData.avatar_url && loginResult.success) {
          const currentUserData = getUserData();
          const updatedUserData = {
            ...currentUserData,
            avatar_url: userData.avatar_url
          };
          saveUserData(updatedUserData);
          setUser(updatedUserData);
        }

        return {
          success: true,
          autoLogin: loginResult.success,
          user: loginResult.user
        };
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
    clearAuth();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
