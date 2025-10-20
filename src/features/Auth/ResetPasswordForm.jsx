import {React, useEffect, useState} from 'react';
import { verifyResetTicketAPI, requestPasswordResetAPI, changePasswordAPI } from '@API/AuthAPI';
import { Loader2 } from 'lucide-react';

const ResetPasswordForm = (props) => {
    const [email, setEmail] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [isTicketValid, setIsTicketValid] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!props.resetTicket) return;
        const verifyResetTicket = async (ticket) => {
            try {
                setLoading(true);
                const resp = await verifyResetTicketAPI(ticket)
                setIsTicketValid(resp);
                setLoading(false);
            }
            catch (err) {
                console.error(err)
                setIsTicketValid(false);
                setLoading(false);

            }
        }

        verifyResetTicket(props.resetTicket)
    }, [props.resetTicket]);

    const handleRequestChangeSubmit = async (e) => {
        try {
            e.preventDefault();
            // Handle password reset logic here
            setLoading(true);
            const success = await requestPasswordResetAPI(email)
            if (success) {
                setSuccessMessage("If an account exists, a password reset link has been sent to your email.");
            }
            setLoading(false);
        }
        catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.error || "An error occurred");
            setLoading(false);
        }
    }

    const handlePasswordChangeSubmit = async (e) => {
        try {
            e.preventDefault();
            // Handle password change logic here
            setLoading(true);
            const resp = await changePasswordAPI(props.resetTicket, password, confirmPassword);
            if (resp) setSuccessMessage("Password changed successfully. You can now log in with your new password.");
            setLoading(false);
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.error || "An error occurred");
            setLoading(false);
        }
    }


    function renderResetPasswordForm() {
        return (
            <form onSubmit={handleRequestChangeSubmit} className='flex flex-col gap-4'>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        placeholder="Enter your email"
                        required
                        onChange={e => setEmail(e.target.value)}
                        className="w-full h-9 px-3 py-1 rounded-md border-input text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
                {successMessage && <p className='text-green-500'>{successMessage}</p>}
                {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
                <button type="submit" onClick={handleRequestChangeSubmit} className={`rounded-md px-4 py-2 ${!isLoading ? "button-gradient": "bg-gray-800 pointer-events-none"} text-white w-full`}>
                    {!isLoading && <p>Reset Password</p>}
                    {isLoading && <p>Loading</p>}
                </button>
            </form>
        );
    }

    function renderResetPasswordFormVerified() {
        return (
            <form onSubmit={handlePasswordChangeSubmit} className='flex flex-col gap-4'>
                <div>
                    <label htmlFor="new-password">New Password</label>
                    <input  
                        type="password"
                        id="new-password"
                        value={password}
                        placeholder="Enter your new password"
                        required
                        onChange={e => setPassword(e.target.value)}
                        className="w-full h-9 px-3 py-1 rounded-md border-input text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        placeholder="Confirm your new password"
                        required
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full h-9 px-3 py-1 rounded-md border-input text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
                {successMessage && <p className='text-green-500'>{successMessage}</p>}
                <p className='text-red-500'>{errorMessage}</p>
                <button type="submit" onClick={handlePasswordChangeSubmit} className={`rounded-md px-4 py-2 ${!isLoading ? "bg-gradient-primary": "bg-gray-800 pointer-events-none"} text-white w-full`}>
                    {!isLoading && <p>Set New Password</p>}
                    {isLoading && <p>Loading</p>}
                </button>
            </form>
        );
    }
    
    return (
        <>
        {isTicketValid && !isLoading && renderResetPasswordFormVerified()}
        {props.resetTicket === null && !isLoading && renderResetPasswordForm()}
        {isLoading && (
            <div className="flex justify-center">
                <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
            </div>
        )}      
        {!isTicketValid && !isLoading && props.resetTicket && <p className='text-red-500'>Invalid or expired reset link.</p>}
        </>

    );
};

export default ResetPasswordForm;