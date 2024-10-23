import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
   
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token exists in local storage
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token');
        // Optionally redirect to login page
        navigate('/login');
    };
    
    return (
        <header className={`mx-6 text-white flex justify-between p-4 font-agdasima`}>
            <div className={''}>
                <div className="logo font-pirata">
                    <a href={"/"}>
                        <p className={'bold'}>kowmal.com</p>
                    </a>
                </div>
            </div>
            <div>
                <a href={'/contact'}>Contact</a>
            </div>


        </header>
    );
};

export default Header;