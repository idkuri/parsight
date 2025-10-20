import { ParsightAPI } from '@contexts/APIContext';

/**
 * Login a user with username and password.
 * 
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @param {boolean} rememberMe - Whether to persist login across sessions.
 * @returns {Promise<Object>} - Resolves with user data and access token.
 * @throws Will throw an error if login fails.
 */
export async function loginAPI(username, password, rememberMe) {
    try {
        const res = await ParsightAPI.post(`/auth/login`, { username, password, rememberMe });
        return res.data;
    } catch (err) {
        console.error(`Login error:`, err.response?.data?.error || err.message);
        throw err;
    }
}

/**
 * Register a new user.
 * 
 * @param {string} username - Desired username.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @param {string} confirmpassword - Confirm password.
 * @param {string} orgType - Type of organization.
 * @returns {Promise<Object>} - Resolves with newly created user data.
 * @throws Will throw an error if registration fails.
 */
export async function registerAPI(username, email, password, confirmpassword, orgType) {
    try {
        const res = await ParsightAPI.post(`/auth/register`, { username, email, password, confirmpassword, orgType });
        return res.data;
    } catch (err) {
        console.error(`Register error:`, err.response?.data?.error || err.message);
        throw err;
    }
}

/**
 * Refresh the access token.
 * 
 * @returns {Promise<string|null>} - Resolves with a new access token, or null if refresh fails.
 */
export const refreshAccessTokenAPI = async () => {
    try {
        const resp = await ParsightAPI.post(`/auth/refresh`);
        return resp.data["access_token"];
    } catch (err) {
        console.error("Failed to refresh token:", err);
        return null;
    }
}

/**
 * Verify a password reset ticket.
 * 
 * @param {string} ticket - The reset ticket token.
 * @returns {Promise<boolean>} - True if the ticket is valid, false otherwise.
 * @throws Will throw an error if verification fails.
 */
export const verifyResetTicketAPI = async (ticket) => {
    try {
        const resp = await ParsightAPI.get(`/auth/verify-reset-password-ticket`, { params: { ticket } });
        return resp.status === 200;
    } catch (err) {
        console.error("Failed to verify reset ticket:", err);
        throw err;
    }
}

/**
 * Request a password reset email.
 * 
 * @param {string} email - User's email to send reset instructions.
 * @returns {Promise<boolean>} - True if the request succeeded.
 * @throws Will throw an error if the request fails.
 */
export const requestPasswordResetAPI = async (email) => {
    try {
        const resp = await ParsightAPI.post(`/auth/request-password-reset`, { email });
        if (resp.status === 200) return true;
        throw new Error("Failed to request password reset");
    } catch (err) {
        console.error("Failed to request password reset:", err);
        throw err;
    }
}

/**
 * Change a user's password using a reset ticket.
 * 
 * @param {string} ticket - The reset ticket token.
 * @param {string} newPassword - The new password.
 * @param {string} confirmNewPassword - Confirm the new password.
 * @returns {Promise<boolean>} - True if the password was changed successfully.
 * @throws Will throw an error if the change fails.
 */
export const changePasswordAPI = async (ticket, newPassword, confirmNewPassword) => {
    try {
        const resp = await ParsightAPI.patch(`/auth/change-password`, { ticket, new_password: newPassword, confirm_password: confirmNewPassword });
        if (resp.status === 200) return true;
    } catch (err) {
        console.error("Failed to change password:", err);
        throw err;
    }
}

/**
 * Log out the current user.
 * 
 * @returns {Promise<Object>} - Resolves with logout response data.
 * @throws Will log an error if logout fails.
 */
export const logOut = async () => {
    try {
        const resp = await ParsightAPI.post("/auth/logout");
        return resp.data;
    } catch (err) {
        console.error("Failed to log out:", err);
    }
}
