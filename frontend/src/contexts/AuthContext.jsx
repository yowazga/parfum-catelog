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
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Session timeout duration (30 minutes in milliseconds)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Clear any existing timeout
  const clearSessionTimeout = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
  };

  // Set up session timeout
  const setupSessionTimeout = () => {
    clearSessionTimeout();
    const timeout = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);
    setSessionTimeout(timeout);
    
    // Store last activity time (this gets updated on every activity)
    localStorage.setItem('sessionStartTime', Date.now().toString());
  };

  // Reset session timeout on user activity
  const resetSessionTimeout = () => {
    // Check both state and localStorage for authentication
    const hasStateAuth = token && user;
    const hasStorageAuth = localStorage.getItem('authToken') && localStorage.getItem('adminUser');
    
    if (hasStateAuth || hasStorageAuth) {
      setupSessionTimeout();
      // If we have storage auth but not state auth, restore the state
      if (hasStorageAuth && !hasStateAuth) {
        setToken(localStorage.getItem('authToken'));
        setUser(JSON.parse(localStorage.getItem('adminUser')));
      }
    }
  };

  // Check if session is still valid based on time
  const isSessionValid = () => {
    const lastActivityTime = localStorage.getItem('sessionStartTime');
    if (!lastActivityTime) return false;
    
    const timeSinceLastActivity = Date.now() - parseInt(lastActivityTime);
    return timeSinceLastActivity < SESSION_TIMEOUT;
  };

  // Set up activity listeners to reset timeout
  useEffect(() => {
    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      // Only update if user is logged in
      if (localStorage.getItem('authToken') && localStorage.getItem('adminUser')) {
        resetSessionTimeout();
      }
    };

    // Always listen for activity, but only act if logged in
    activities.forEach(activity => {
      document.addEventListener(activity, handleActivity, true);
    });

    return () => {
      activities.forEach(activity => {
        document.removeEventListener(activity, handleActivity, true);
      });
    };
  }, []); // Remove dependency on token and user

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('adminUser');
      
      if (storedToken && storedUser) {
        // Check if session is still valid based on time
        if (!isSessionValid()) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('adminUser');
          localStorage.removeItem('sessionStartTime');
          setLoading(false);
          return;
        }

        try {
          // Validate token with backend
          const isValid = await authService.validateToken();
          if (isValid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setupSessionTimeout(); // Set up timeout for existing session
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('adminUser');
            localStorage.removeItem('sessionStartTime');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('adminUser');
          localStorage.removeItem('sessionStartTime');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (username, token) => {
    setUser({ username });
    setToken(token);
    
    // Store in localStorage for persistence
    localStorage.setItem('authToken', token);
    localStorage.setItem('adminUser', JSON.stringify({ username }));
    
    setupSessionTimeout(); // Start session timeout when user logs in
  };

  const logout = () => {
    clearSessionTimeout(); // Clear any active timeout
    setUser(null);
    setToken(null);
    localStorage.removeItem('sessionStartTime');
    authService.logout();
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearSessionTimeout();
    };
  }, []);

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
