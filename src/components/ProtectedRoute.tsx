import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, checkLicense } = useAuth();
    const location = useLocation();
    const isLicensed = checkLicense();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated but not licensed, redirect to license page
    if (!isLicensed) {
        return <Navigate to="/license" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
