import react from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/notfound";    
import ProtectedRoutes from "./components/ProtectedRoutes";
import Layout from "./components/layout/Layout";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";          
import Events from "./pages/events/Events";
import Workshops from "./pages/workshops/Workshops"; 
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";
import "./styles/global.css";
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
<Route path="/" element={ <ProtectedRoutes> <Layout><Home /></Layout> {/*layout wraps evrinthing */}    </ProtectedRoutes>} />
 <Route path="/login" element={<Login />} />
 <Route path="/register" element={<RegisterAndLogout />} />
 <Route path="/logout" element={<Logout />} />
 <Route path="*" element={<NotFound />} />

 <Route path="/events" element={<ProtectedRoutes><Layout><Events /></Layout></ProtectedRoutes>} />
<Route path="/workshops" element={<ProtectedRoutes><Layout> <Workshops /> </Layout></ProtectedRoutes>} />
<Route path="/about" element={ <ProtectedRoutes> <Layout> <About />   </Layout> </ProtectedRoutes>} />
<Route path="/contact" element={ <ProtectedRoutes> <Layout><Contact /></Layout></ProtectedRoutes>} /> 
<Route path="/profile" element={ <ProtectedRoutes> <Layout><Profile /> </Layout></ProtectedRoutes> } />
<Route path="/settings" element={ <ProtectedRoutes> <Layout><Settings /> </Layout></ProtectedRoutes> } />
            </Routes>
        </Router>
    );
}

export default App;
