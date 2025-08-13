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
            const parsedUser = JSON.parse(storedUser);
            console.log('AuthContext: Restored user from storage:', parsedUser);
            console.log('AuthContext: Restored user roles:', parsedUser.roles);
            console.log('AuthContext: Restored user is admin?', parsedUser.roles?.includes('ADMIN'));
            
            // Check if this is an old format user (with ROLE_ prefix)
            if (parsedUser.roles && parsedUser.roles.some(role => role.startsWith('ROLE_'))) {
              console.log('AuthContext: Detected old role format, converting to new format');
              // Convert old format to new format
              const newRoles = parsedUser.roles.map(role => 
                role.startsWith('ROLE_') ? role.substring(5) : role
              );
              parsedUser.roles = newRoles;
              console.log('AuthContext: Converted roles:', newRoles);
              
              // Update localStorage with new format
              localStorage.setItem('adminUser', JSON.stringify(parsedUser));
            }
            
            setToken(storedToken);
            setUser(parsedUser);
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
    // Create user object with appropriate roles based on username
    const userWithRoles = { 
      username, 
      email: username === 'hakim' ? 'hakim@cataloghakim.com' : `${username}@cataloghakim.com`,
      roles: username === 'hakim' ? ['USER', 'ADMIN'] : ['USER']
    };
    
    console.log('AuthContext: Login called with username:', username);
    console.log('AuthContext: Created user object:', userWithRoles);
    console.log('AuthContext: User roles:', userWithRoles.roles);
    console.log('AuthContext: Is admin?', userWithRoles.roles.includes('ADMIN'));
    console.log('AuthContext: Storing user in localStorage:', JSON.stringify(userWithRoles));
    
    setUser(userWithRoles);
    setToken(token);
    
    // Store in localStorage for persistence
    localStorage.setItem('authToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userWithRoles));
    
    // Verify what was stored
    const storedUser = localStorage.getItem('adminUser');
    console.log('AuthContext: Verified stored user:', storedUser);
    console.log('AuthContext: Parsed stored user:', JSON.parse(storedUser));
    
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
