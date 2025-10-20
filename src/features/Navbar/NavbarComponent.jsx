import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { logOut } from '@API/AuthAPI';
import logo from "@assets/icononly_transparent_nobuffer.png"
import { LoaderCircle, LogOut } from 'lucide-react';


const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [scrollDirection, setScrollDirection] = useState('');
    const prevScrollY = useRef(window.scrollY);
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const { accessToken,  authLoading, setAccessToken, userInfo } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            const scrollBuffer = 20
            if (window.scrollY === 0) {
                setScrollDirection('');
            }
            else if (prevScrollY.current < window.scrollY) {
                setScrollDirection('down');
            } 
            else if (prevScrollY.current > window.scrollY) {
                setScrollDirection('up');
            }
            if (!(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight-scrollBuffer)) {
                prevScrollY.current = window.scrollY;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);



    return (
        <nav className={`color-white fixed top-0 w-full z-[99] transition-all duration-500 ${scrollDirection === 'down' ? `opacity-0 pointer-events-none` : `opacity-100`}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Leftside Navbar */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex items-center space-x-2 hover:cursor-pointer" onClick={() => navigate('/')}>
                                <img src={logo} className='w-[40px] h-[40px]'></img>

                                {/* <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                                    <span className="text-white font-bold">P</span>
                                </div> */}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-xl">Parsight</span>
                                    <span className="text-xs text-muted-foreground -mt-1">by Gnostora AI</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Navbar */}
                    {/* {!authLoading && accessToken &&
                        <div className="flex flex-row">
                            <div className='flex justify-center items-center'>
                                <div className="flex flex-row items-center justify-center px-3 py-2 gap-1 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors hover:cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>
                                    <LayoutDashboard size={20}/>
                                    <p>Dashboard</p>
                                </div>
                            </div>
                        </div>
                    } */}

                    {/* Rightside Navbar */}
                    {!authLoading && !accessToken &&
                        <div className="flex items-center space-x-2">
                             <p className="px-3 py-2 rounded-md font-medium text-sm transition-all hover:underline hover:cursor-pointer" onClick={() => navigate('/login')}>
                                Log In
                            </p>
                            <p className="px-3 py-2 font-semibold text-md button-gradient-rounded !rounded-md border-black transition-all hover:font-bold hover:cursor-pointer hover:text-lg" onClick={() => navigate('/signup')}>
                                Get Started
                            </p>
                        </div>
                    }

                    {accessToken &&
                        <div className="flex items-center space-x-2">
                            {!userInfo &&
                                 <LoaderCircle className="animate-spin w-6 h-6 text-gray-500" />
                            }
                            {userInfo && userInfo.picture && (
                              <img
                                src={userInfo.picture}
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}

                            <div
                            className="flex flex-row gap-1 px-3 items-center justify-center py-2 rounded-md font-medium text-sm transition-all hover:underline hover:cursor-pointer" 
                            onClick={async () => {
                               await logOut(); 
                               window.location.href = "/";
                            }}>
                                <LogOut size={20}/>
                                Log out
                            </div>
                        </div>
                    }

                    {authLoading &&
                        <p className="px-3 py-2 rounded-md font-medium text-sm transition-all hover:underline hover:cursor-pointer">Loading</p>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Navbar;