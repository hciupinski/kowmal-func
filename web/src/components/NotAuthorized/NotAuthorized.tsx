import React from "react";

const NotAuthorized : React.FC = () => {
    return (
    <section>
        <div className="flex items-center justify-center px-6 py-8 mx-auto">
            <div className="flex items-center justify-center w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <h2 className={'py-4 text-white font-bold'}>You are not authorized to view this page.</h2>
            </div>
        </div>
    </section>
    );
}

export default NotAuthorized;