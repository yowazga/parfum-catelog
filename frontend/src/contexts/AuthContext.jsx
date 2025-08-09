import React, { useState, useEffect, createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (token && user) {
      setIsAuthenticated(true);
      setAdminUser(JSON.parse(user));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    // For demo purposes, using hardcoded credentials
    // In production, this would make an API call to your Spring Boot backend

    if (username === 'admin' && password === 'admin123') {
      const user = { username, role: 'admin' };
      const token = 'demo-token-' + Date.now();
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      setIsAuthenticated(true);
      setAdminUser(user);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    adminUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
