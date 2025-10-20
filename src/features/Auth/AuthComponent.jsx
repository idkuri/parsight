import {React, useEffect, useState} from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from "framer-motion";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ResetPasswordForm from './ResetPasswordForm';
import { useAuth } from '@contexts/AuthContext';

const AuthComponent = () => {
    const [searchParams] = useSearchParams();
    const getFormComponent = (pathname, resetTicket) => {
        if (pathname.startsWith("/reset-password")) {
            return <ResetPasswordForm resetTicket={resetTicket || null} />;
        }
        const components = {
            "/login": <LoginForm />,
            "/signup": <RegisterForm />
        };
        return components[pathname];
    };
    const getModeName = (pathname) => {
        if (pathname.startsWith("/reset-password")) return "reset-password";
        const modes = {
            "/login": "login",
            "/signup": "signup"
        };
        return modes[pathname] || null;
    };    

    const resetTicket = searchParams.get("ticket");
    const location = useLocation();
    const navigate = useNavigate();
    const { accessToken,  authLoading, setAccessToken } = useAuth();
    const [mode, setMode] = useState(getModeName(location.pathname));

    useEffect(() => {
        if (accessToken && !authLoading) {
            navigate('/dashboard')
        }
    }, [accessToken, authLoading])

    useEffect(() => {
        setMode(getModeName(location.pathname));
    }, [location.pathname]);

    function renderAuthHeader() {
        return (
            <>
            {
                getModeName(location.pathname) === "login" && (
                <div className='flex justify-center items-center flex-col gap-2'>
                    <h4 className='text-2xl font-bold'> Sign in to Parsight </h4>
                    <p className='text-muted-foreground'> Sign in to your account or create a new one </p>
                </div>
                )
            }
            
            {
                getModeName(location.pathname) === "signup" && (
                    <div className='flex justify-center items-center flex-col gap-2'>
                        <h4 className='text-2xl font-bold'> Welcome to Parsight </h4>
                        <p className='text-muted-foreground'> Fill in the details to create a new account </p>
                    </div>
                )
            }
            {   getModeName(location.pathname) === "reset-password" && !resetTicket && (
                    <div className='flex justify-center items-center flex-col gap-2'>
                        <h4 className='text-2xl font-bold'> Reset Your Password </h4>
                        <p className='text-muted-foreground'> Enter your email to receive password reset instructions </p>
                    </div>
                )
                
            }
            {   getModeName(location.pathname) === "reset-password" && resetTicket && (
                    <div className='flex justify-center items-center flex-col gap-2'>
                        <h4 className='text-2xl font-bold'> Reset Your Password </h4>
                        <p className='text-muted-foreground'> Please choose a new password </p>
                    </div>
                )
                
            }
            </>
        )
    }
    function renderAuthModeToggleButton() {
        return (
            <div className="relative bg-gray-200 h-9 rounded-xl p-[3px] grid w-full grid-cols-2 mb-6">
                <motion.div
                    className="absolute top-[0px] bottom-[0px] w-1/2 rounded-xl button-gradient outline-1 outline-blue-950"
                    initial={false}
                    animate={{
                    x: mode === "login" ? 0 : "100%",
                    }}
                    transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    }}
                />
                <button
                    type="button"
                    className={`relative z-10 p-1 rounded-xl ${
                    mode === "login" ? "text-white" : "text-black"
                    }`}
                    onClick={() => {
                    setMode("login")
                    navigate("/login", { replace: true })
                    }}
                >
                    Login
                </button>
                <button
                    type="button"
                    className={`relative z-10 p-1 rounded-xl ${
                    mode === "signup" ? "text-white" : "text-black"
                    }`}
                    onClick={() => {
                    setMode("signup")
                    navigate("/signup", { replace: true })
                    }}
                >
                    Sign Up
                </button>
            </div>
        )
    }

    return (
        !authLoading && !accessToken &&
            <div data-component="auth-page" className='flex w-full justify-center items-center'>
                <div data-component="auth-content" className={`w-full max-w-md mx-auto bg-card flex flex-col gap-4 shadow-lg bg-card-rounded p-6`}>
                    <div data-component="auth-header" className='flex flex-col items-center gap-2 flex-grow'>
                        {renderAuthHeader()}
                    </div>
                    <div data-component="auth-mode-toggle" className='flex justify-between items-center'>
                        {mode !== "reset-password" && renderAuthModeToggleButton()}
                    </div>
                    <div data-component="auth-body" className='flex-grow'>
                        {getFormComponent(location.pathname, resetTicket)}
                    </div>
                </div>
            </div>
    );
};

export default AuthComponent;