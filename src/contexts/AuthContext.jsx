import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
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
      const users = await apiService.get('/user');
      
      const foundUser = users.find(
        user => user.name === credentials.name && user.password === credentials.password
      );

      if (foundUser) {
        const token = `token_${foundUser.id}`;
        saveToken(token);
        setUser({ ...foundUser, token });
        return { success: true, user: foundUser };
      } else {
        return { success: false, error: 'Nome de usuário ou senha incorretos!' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: 'Erro ao fazer login. Verifique se o servidor está rodando.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const users = await apiService.get('/user');
      const cpfExists = users.some(user => user.cpf === userData.cpf);

      if (cpfExists) {
        return { success: false, error: 'CPF já cadastrado no sistema!' };
      }

      const newUser = {
        ...userData,
        userType: "COSTUMER"
      };

      await apiService.post('/user', newUser);

      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: 'Erro ao criar conta. Verifique se o servidor está rodando.'
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
