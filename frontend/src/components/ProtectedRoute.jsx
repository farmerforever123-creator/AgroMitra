import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component to enforce role-based access
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string} props.requiredRole - The role required to access the route
 * @param {string} props.redirectTo - Where to redirect if the user has the WRONG role but is logged in
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo }) => {
  const role = localStorage.getItem('role');
  const userStr = localStorage.getItem('user'); // Assuming user object is stored here
  const user = userStr ? JSON.parse(userStr) : null;

  // 1. If not logged in, redirect to appropriate login page
  if (!role || !user) {
    return <Navigate to={requiredRole === 'seller' ? '/seller-login' : '/buyer-login'} replace />;
  }

  // 2. If logged in but has the WRONG role
  if (role !== requiredRole) {
    // Prevent sellers from accessing buyer pages and vice versa
    return <Navigate to={redirectTo} replace />;
  }

  // 3. Authorized
  return children;
};

export default ProtectedRoute;
