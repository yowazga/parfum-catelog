import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

// Custom hook for using auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('adminUser');
      
      if (storedToken && storedUser) {
        try {
          // Validate token with backend
          const isValid = await authService.validateToken();
          if (isValid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('adminUser');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('adminUser');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (username, token) => {
    setUser({ username });
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authService.logout();
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
