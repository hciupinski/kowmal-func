import React from 'react';
import styles from './Home.module.scss';

const Home: React.FC = () => {
    return (
        <div className={`${styles.footer} text-gray-500 text-center text-white p-4 my-4`}>
            <h1 className={'text-6xl my-3'}>TOMASZ KOWMAL</h1>
            <h3 className={'text-3xl'}>Szable dopasowane do Ciebie</h3>
        </div>
    );
};

export default Home;