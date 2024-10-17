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
        <header className={`text-white flex justify-between p-4`}>
            <div className={''}>
                <div className="logo">
                    <a href={"/"}>
                        {/*<img src="/images/logo-t.png" alt="kowmal-logo" className="h-12"/>*/}
                        <p className={'bold'}>kowmal.com</p>
                    </a>
                </div>
                {/*<p className={`my-4`}>kowmal.com</p>*/}
            </div>
            <div>
                <a href={'/contact'} className={'mr-10'}>Contact</a>
            </div>


        </header>
    );
};

export default Header;