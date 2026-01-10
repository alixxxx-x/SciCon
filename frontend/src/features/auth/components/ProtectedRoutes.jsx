import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../../services/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../../constants";
import { useState, useEffect } from "react";

function ProtectedRoutes({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    let isMounted = true; // prevents state update if unmounted

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) {
          if (isMounted) setIsAuthorized(false);
          return;
        }

        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // token expired → try refresh
        if (decoded.exp < currentTime) {
          const refresh = localStorage.getItem(REFRESH_TOKEN);

          if (!refresh) {
            if (isMounted) setIsAuthorized(false);
            return;
          }

          const response = await api.post("/api/auth/refresh/", {
            refresh,
          });

          localStorage.setItem(ACCESS_TOKEN, response.data.access);
          if (isMounted) setIsAuthorized(true);
        } else {
          if (isMounted) setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Auth error:", error);
        if (isMounted) setIsAuthorized(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoutes;
