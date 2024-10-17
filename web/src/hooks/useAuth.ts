import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
    username: string;
}

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                const isTokenValid = decoded.exp * 1000 > Date.now();
                setIsAuthenticated(isTokenValid);
                if (!isTokenValid) {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
    }, []);

    return { isAuthenticated, loading };
};