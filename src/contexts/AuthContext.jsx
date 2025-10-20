import { createContext, useContext, useState, useEffect } from "react";
import { refreshAccessTokenAPI} from '@API/AuthAPI';
import { getUserInfo } from '@API/UserAPI'


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (accessToken) {
                try {
                    const data = await getUserInfo(accessToken);
                    setUserInfo(data);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchUserInfo();
    }, [accessToken]);

    function parseJwt(token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
    }

    const isTokenExpired = (token) => {
        if (!token) return true
        const payload = parseJwt(token)
        const now = Date.now() / 1000;
        return payload.exp < now + 60;
    }

    useEffect(() => {
        const checkToken = async () => {
            if (!accessToken || isTokenExpired(accessToken)) {
                try {
                    const newAccessToken = await refreshAccessTokenAPI();
                    setAccessToken(newAccessToken);
                    setAuthLoading(false);
                } 
                catch (err) {
                    console.error(err);
                    setAccessToken(null);
                }
            }
        }
        checkToken();
    }, [])

    return (
      <AuthContext.Provider value={{ accessToken, authLoading, setAccessToken, userInfo }}>
        {children}
      </AuthContext.Provider>
    );
}

export function useAuth() {
  return useContext(AuthContext);
}