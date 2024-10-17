import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { isAuthenticated, loading } = useAuth();
    
    console.log('isauthenticated', isAuthenticated)

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while checking token
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default ProtectedRoute;