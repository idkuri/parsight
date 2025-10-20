import { ParsightAPI } from '@contexts/APIContext';

/**
 * Get information about the current user.
 * 
 * @param {Object} params
 * @param {string} params.accessToken - The user's authentication token.
 * @returns {Promise<Object>} - Resolves with the user's information.
 * @throws Will log an error if the request fails.
 */
export const getUserInfo = async ({ accessToken }) => {
    try {
        const resp = await ParsightAPI.get("/user/info", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return resp.data;
    } catch (err) {
        console.error("Failed to get user info:", err);
        throw err;
    }
}

/**
 * Get the organizations the current user belongs to.
 * 
 * @param {Object} params
 * @param {string} params.accessToken - The user's authentication token.
 * @returns {Promise<Array>} - Resolves with an array of organizations.
 * @throws Will log an error if the request fails.
 */
export const getUserOrganization = async ({ accessToken }) => {
    try {
        const resp = await ParsightAPI.get("/user/organizations", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return resp.data;
    } catch (err) {
        console.error("Failed to get user organizations:", err);
        throw err;
    }
}
