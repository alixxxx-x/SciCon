import react from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/notfound";    
import ProtectedRoutes from "./components/ProtectedRoutes";
import Event from "./pages/Event";

function Logout () {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
}

function App () {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProtectedRoutes><Event /></ProtectedRoutes>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterAndLogout />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
