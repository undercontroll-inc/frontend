export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// User data management
const USER_STORAGE_KEY = 'userData';

export const saveUserData = (userData) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = () => {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeUserData = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

export const clearAuth = () => {
  removeToken();
  removeUserData();
};