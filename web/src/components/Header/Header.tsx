import React from 'react';
import {NavLink} from 'react-router-dom';
import {motion} from 'motion/react';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const navItems = [
    {to: '/gallery', label: 'GALLERY'},
    {to: '/contact', label: 'CONTACT'},
  ];

  return (
    <header className={styles.header}>
      <NavLink to="/gallery" className={styles.logoLink} aria-label="Go to gallery">
        <img src="/images/logo-t.png" alt="Kowmal logo" className={styles.logo} />
      </NavLink>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({isActive}) => `${styles.link} ${isActive ? styles.active : ''}`}>
            {({isActive}) => (
              <>
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="active-tab"
                    className={styles.activeLine}
                    transition={{type: 'spring', stiffness: 360, damping: 35}}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Header;
