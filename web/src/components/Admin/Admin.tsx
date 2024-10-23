import React from "react";
import { Outlet } from 'react-router-dom';
import LogoutButton from "../LogoutButton/LogoutButton";

const Admin: React.FC = () => {

    return (
        <div className={`mt-16 mx-2 p-6 text-white bg-gray-900 bg-opacity-80 rounded-2xl h-[75%] min-h-[75%]`}>
            <div className={'flex justify-between'}>
                <h2 className="text-3xl mb-4">Dashboard</h2>
                <LogoutButton />
            </div>
            <Outlet/>
        </div>
    )
}

export default Admin;