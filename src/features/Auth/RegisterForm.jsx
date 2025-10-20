import {React, useState} from 'react';
import { registerAPI } from '@API/AuthAPI';
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('individual')
    const { accessToken,  setAccessToken } = useAuth();
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
       setLoading(true)
       e.preventDefault();
       try {
           let res = await registerAPI(username, email, password, confirmPassword, accountType)
           setAccessToken(res.access_token)
           setLoading(false)
           setError(null)
           navigate("/dashboard");
       }
       catch (error) {
           console.error(error)
           setError(error?.response?.data?.error || "An Unexpected Error has occurred");
           setLoading(false);
       }
   };
        
    function renderSignUpForm() {
        return(
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        placeholder="Choose a username"
                        required
                        onChange={e => setUsername(e.target.value)}
                        className="w-full h-9 px-3 py-1 rounded-md border border-input bg-input text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        placeholder="Enter your email"
                        required
                        onChange={e => setEmail(e.target.value)}
                        className="w-full h-9 px-3 py-1 rounded-md border border-input bg-input text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
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


                <div>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        placeholder="Confirm your password"
                        required
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full h-9 px-3 py-1 rounded-md border border-input bg-input text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <p>Account Type</p>

                    {/* Individual User Option */}
                    <label className="flex items-center gap-3 rounded-md border-2 border-gray-300 p-5 hover:cursor-pointer bg-primary hover:border-gray-400 transition-colors group group-has-[:checked] has-checked:border-cyan-500">
                        <input 
                            type="radio" 
                            defaultChecked={true} 
                            name="accountType" 
                            value="individual" 
                            required
                            className="sr-only peer"
                        />
                        {/* Custom Radio Button */}
                        <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[var(--brand-cyan)] transition-colors flex-shrink-0 peer">
                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-cyan)] scale-0 group-has-[:checked]:scale-100 transition-transform"></span>
                        </span>

                        <span className="flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </span>
                        <span className="font-medium">Individual User</span>
                    </label>

                    {/* Organization Option */}
                    <label className="flex items-center gap-3 rounded-md border-2 border-gray-300 p-5 hover:cursor-pointer bg-primary hover:border-gray-400 transition-colors group group-has-[:checked] has-checked:border-cyan-500">
                        <input 
                            type="radio" 
                            defaultChecked={true} 
                            name="accountType" 
                            value="organization" 
                            required
                            className="sr-only peer"
                        />
                        {/* Custom Radio Button */}
                        <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[var(--brand-cyan)] transition-colors flex-shrink-0 peer">
                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-cyan)] scale-0 group-has-[:checked]:scale-100 transition-transform"></span>
                        </span>

                        <span className="flex-shrink-0">
                            <svg viewBox="0 0 1024 1024" focusable="false" width="21" height="21" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="M566.05 363.23h.12v567.95h-.12zM699.3 495.37h101.38v49.56H699.3zm0 150.88h101.38v49.56H699.3zm-81.4-231.14v514.42h.11V415.1h-.12zM245.83 931.18h155.12-155.12zm0 0" />
                                <path fill="currentColor" d="M964.65 392.17c0-16-12.96-28.96-28.96-28.96H618.02V69.91c0-15.99-12.96-28.95-28.93-28.95H88.3c-16 0-28.94 12.96-28.94 28.96v884.16a28.92 28.92 0 0028.94 28.96h847.36c16 0 28.96-12.96 28.96-28.96l.02-561.9zM566.17 931.18H111.23V92.82h454.92v838.36zm346.6-1.78H617.9V415.1h294.87V929.4z" />
                                <path fill="currentColor" d="M199.6 193.62h101.37v49.56H199.6zm176.92 0H477.9v49.56H376.52zM199.6 344.37h101.37v49.56H199.6zm176.92 0H477.9v49.56H376.52zm-176.8 151.47H301.1v49.56H199.72zm176.8-.35H477.9v49.56H376.52zm-88.45 225.92h101.38a30.7 30.7 0 0130.7 30.7v179.05H257.37V752.11a30.7 30.7 0 0130.7-30.7z" />
                            </svg>
                        </span>
                        <span className="font-medium">Organization</span>
                    </label>

                    <em className='text-red-500 not-italic'>{error}</em>
                </div>
                <button type="submit" onClick={handleSubmit} className={`rounded-md px-4 py-2 ${!isLoading ? "button-gradient": "bg-gray-800 pointer-events-none"} text-white w-full`}>
                    {!isLoading && <p>Register</p>}
                    {isLoading && <p>Loading</p>}
                </button>
            </form>
        )
    }

    return (
        <>{renderSignUpForm()}</>
    );
};

export default RegisterForm;