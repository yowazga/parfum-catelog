import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SmartAdminLink = ({ className, children }) => {
  const { isAuthenticated } = useAuth();
  
  // If user is authenticated, go to admin dashboard, otherwise go to login
  const adminPath = isAuthenticated() ? '/admin' : '/admin/login';
  
  return (
    <Link to={adminPath} className={className}>
      {children}
    </Link>
  );
};

export default SmartAdminLink;
