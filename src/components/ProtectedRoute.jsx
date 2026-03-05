import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireSuperAdmin = false, requireClient = false }) => {
    const { user, loading, isSuperAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#000103] items-center justify-center">
                <div className="relative">
                    {/* Loading Spinner */}
                    <div className="w-16 h-16 border-4 border-white/10 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Super admin trying to access client-only route
    if (requireClient && isSuperAdmin) {
        return <Navigate to="/admin" replace />;
    }

    // Client trying to access super admin-only route
    if (requireSuperAdmin && !isSuperAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
