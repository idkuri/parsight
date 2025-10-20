import {React, useState} from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { loginAPI } from '@API/AuthAPI';
import { useAuth } from '@contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const { accessToken,  setAccessToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            let res = await loginAPI(username, password, rememberMe);
            setAccessToken(res.access_token)
            setLoading(false)
            setError(null)
            navigate("/");
        }
        catch (error) {
            console.error(error)
            setError(error?.response?.data?.error || "An Unexpected Error has occurred");
            setLoading(false);
        }
    };

    function renderLoginForm() {
        return (
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div>
                    <label htmlFor="email">Username/Email</label>
                    <input
                        type="email"
                        id="email"
                        value={username}
                        placeholder="Enter your email"
                        required
                        onChange={e => setUsername(e.target.value)}
                        className="w-full h-9 px-3 py-1 rounded-md border-input text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        placeholder="Enter your password"
                        required
                        onChange={e => setPassword(e.target.value)}
                        className="w-full h-9 px-3 py-1 rounded-md border border-input bg-input text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <label className='flex items-center justify-center xs:gap-1 cursor-pointer' htmlFor="remember">
                        <div className='w-[15px] h-[15px] border-gradient rounded-sm cursor-pointer'>
                            <AnimatePresence>
                                {rememberMe && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    key="box"
                                    className="w-[15px] h-[15px] bg-gradient-primary rounded-sm" 
                                >
                                </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                        <input type="checkbox" id="remember" className="accent-black appearance-none" onChange={e => setRememberMe(!rememberMe)}/>
                        <span className='select-none'>Remember me</span>
                    </label>

                    <button type="button" className='hover:underline' onClick={() => {navigate("/reset-password")}}>Forgot Password?</button>
                </div>
                <em className='text-red-500 not-italic'>{error}</em>
                <button type="submit" onClick={handleSubmit} className={`rounded-md px-4 py-2 ${!isLoading ? "button-gradient": "bg-gray-800 pointer-events-none"} text-white w-full`}>
                    {!isLoading && <p>Log in</p>}
                    {isLoading && <p>Loading</p>}
                </button>
            </form>
        );
    }
    return (
        <>{renderLoginForm()}</>
    );
};

export default LoginForm;