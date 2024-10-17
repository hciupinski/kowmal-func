import React from 'react';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
    return (
        <footer className={`${styles.footer} bg-black text-gray-500 text-center p-4`}>
            <p>&copy; {new Date().getFullYear()} Kowmal. All rights reserved.</p>
        </footer>
    );
};

export default Footer;