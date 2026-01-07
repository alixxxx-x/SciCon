import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Layout from "./components/layout/Layout";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import DashboardOrganizer from "./pages/DashboardOrganizer";
import Events from "./pages/events/Events";
import CreateEvent from "./pages/CreateEvent";
import Users from "./pages/Users";
import Submissions from "./pages/Submissions";
import Workshops from "./pages/workshops/Workshops";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import "./styles/global.css";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
}

// Organizer Pages
import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import OrganizerParticipants from "./pages/organizer/OrganizerParticipants";
import OrganizerSubmissions from "./pages/organizer/OrganizerSubmissions";
import EditEvent from "./pages/EditEvent";
import EventSubmissions from "./pages/EventSubmissions";
import CreateSession from "./pages/CreateSession";
import EventDetails from "./pages/EventDetails";
import SessionsList from "./pages/SessionsList";
import DashboardAuthor from "./pages/DashboardAuthor";
import NewSubmission from "./pages/NewSubmission";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProtectedRoutes><Layout><Home /></Layout></ProtectedRoutes>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterAndLogout />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<NotFound />} />

                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
                <Route path="/dashboard-author" element={<ProtectedRoutes><DashboardAuthor /></ProtectedRoutes>} />
                <Route path="/submissions/new" element={<ProtectedRoutes><NewSubmission /></ProtectedRoutes>} />

                {/* Oganizer Routes - Using Custom Layout (OrganizerSidebar) inside the components */}
                <Route path="/dashboard-organizer" element={<ProtectedRoutes><DashboardOrganizer /></ProtectedRoutes>} />
                <Route path="/events/my-events" element={<ProtectedRoutes><OrganizerEvents /></ProtectedRoutes>} />
                <Route path="/organizer/sessions" element={<ProtectedRoutes><SessionsList /></ProtectedRoutes>} />
                <Route path="/organizer/participants" element={<ProtectedRoutes><OrganizerParticipants /></ProtectedRoutes>} />
                <Route path="/organizer/submissions" element={<ProtectedRoutes><OrganizerSubmissions /></ProtectedRoutes>} />

                <Route path="/events" element={<ProtectedRoutes><Layout><Events /></Layout></ProtectedRoutes>} />
                <Route path="/events/:id" element={<ProtectedRoutes><Layout><EventDetails /></Layout></ProtectedRoutes>} />
                <Route path="/events/create" element={<ProtectedRoutes><CreateEvent /></ProtectedRoutes>} />
                <Route path="/events/:id/edit" element={<ProtectedRoutes><EditEvent /></ProtectedRoutes>} />
                <Route path="/events/:id/submissions" element={<ProtectedRoutes><EventSubmissions /></ProtectedRoutes>} />
                <Route path="/sessions/create" element={<ProtectedRoutes><CreateSession /></ProtectedRoutes>} />
                <Route path="/users" element={<ProtectedRoutes><Users /></ProtectedRoutes>} />
                <Route path="/submissions" element={<ProtectedRoutes><Submissions /></ProtectedRoutes>} />
                <Route path="/workshops" element={<ProtectedRoutes><Layout><Workshops /></Layout></ProtectedRoutes>} />
                <Route path="/about" element={<ProtectedRoutes><Layout><About /></Layout></ProtectedRoutes>} />
                <Route path="/contact" element={<ProtectedRoutes><Layout><Contact /></Layout></ProtectedRoutes>} />
                <Route path="/profile" element={<ProtectedRoutes><Layout><Profile /></Layout></ProtectedRoutes>} />
                <Route path="/settings" element={<ProtectedRoutes><Layout><Settings /></Layout></ProtectedRoutes>} />
                <Route path="/notifications" element={<ProtectedRoutes><Layout><Notifications /></Layout></ProtectedRoutes>} />
            </Routes>
        </Router>
    );
}

export default App;
