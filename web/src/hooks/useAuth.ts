import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
    username: string;
}

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                console.log(decoded)
                const isTokenValid = decoded.exp * 1000 > Date.now();
                console.log(isTokenValid)
                setIsAuthenticated(isTokenValid);
                if (!isTokenValid) {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
    }, []);

    return isAuthenticated;
};