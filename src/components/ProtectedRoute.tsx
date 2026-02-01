import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLicensed } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isLicensed && location.pathname !== '/license') {
        return <Navigate to="/license" replace />;
    }

    // If licensed and trying to access license page, redirect to dashboard
    if (isLicensed && location.pathname === '/license') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
