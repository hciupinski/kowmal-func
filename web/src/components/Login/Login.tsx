import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleGoogleLoginSuccess = (response: any) => {
        const { credential } = response;

        // Store the Google token securely
        localStorage.setItem('token', credential);

        // Redirect the user to the upload product page after successful login
        navigate('/admin');
    };
    return(
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENTID!}>
            <section>
                <div className="flex items-center justify-center px-6 py-8 mx-auto">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className={'w-full mx-auto p-8'}>
                            <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => console.log('Login Failed')}/>
                        </div>    
                    </div>
                </div>
            </section>
        </GoogleOAuthProvider>
)
};

export default Login;