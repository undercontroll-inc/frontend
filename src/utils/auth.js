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