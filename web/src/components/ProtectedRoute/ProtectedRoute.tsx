import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
    element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    // Decode the Google ID token to extract user information (like email)
    const decodedToken = jwtDecode(token);
    // @ts-ignore
    const userEmail = decodedToken.email;

    // Access allowed emails from the environment variable and convert to an array
    const allowedEmails = process.env.REACT_APP_ALLOWED_EMAILS!.split(',');

    // Check if the email is in the allowed list
    if (!allowedEmails.includes(userEmail)) {
        return <Navigate to="/not-authorized" />;
    }

    return element;
};

export default ProtectedRoute;