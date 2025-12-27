import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACESS_TOKEN } from "../constants";
import { useState , useEffect } from "react";

function ProtectedRoutes({ children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => { checkAuth().catch(() => setIsAuthorized(false)) }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post("api/token/refresh/", { refresh: refreshToken });

            if (response.status === 200) {
                localStorage.setItem(ACESS_TOKEN, response.data.access);
                setIsAuthorized(true);
            }
            else {
                setIsAuthorized(false);
            }


        } catch (error) {
            console.error("Error refreshing token:", error);
            setIsAuthorized(false);
        }
    }

    const checkAuth = async () => {
        const token = localStorage.getItem(ACESS_TOKEN);
        if(!token) {
            setIsAuthorized(false);
            return;
        }

        const decodedToken = jwtDecode(token);
        const tokenExpiration = decodedToken.exp;
        const currentTime = Date.now() / 1000;

        if (tokenExpiration < currentTime) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
            

    }

    if (isAuthorized === null) {
        return <div>loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoutes;