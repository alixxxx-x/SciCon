import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACESS_TOKEN } from "../constants";
import { useState } from "react";

function ProtectedRoutes({ children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    const refreshToken = async () => {
        
    }

    const checkAuth = async () => {

    }

    if (isAuthorized === null) {
        return <div>loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}