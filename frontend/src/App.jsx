import React from "react";
import { ThemeProvider } from "./components/theme-provider"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Register from "./features/auth/pages/RegisterPage";
import Login from "./features/auth/pages/LoginPage";
import NotFound from "./pages/NotFound";
import ProtectedRoutes from "./features/auth/components/ProtectedRoutes";
import Layout from "./components/layout/Layout";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import DashboardOrganizer from "./features/dashboard/pages/OrganizerDashboard";
import Events from "./features/events/pages/EventsPage";
import CreateEvent from "./features/events/pages/CreateEventPage";
import Users from "./features/users/pages/UsersPage";
import Submissions from "./features/submissions/pages/SubmissionsPage";
import Workshops from "./pages/workshops/Workshops";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";
import Dashboard from "./features/dashboard/pages/DashboardPage";
import Notifications from "./pages/Notifications";
// Organizer Pages
import OrganizerEvents from "./features/events/pages/OrganizerEventsPage";
import OrganizerParticipants from "./features/users/pages/OrganizerParticipantsPage";
import OrganizerSubmissions from "./features/submissions/pages/OrganizerSubmissionsPage";
import EditEvent from "./features/events/pages/EditEventPage";
import EventSubmissions from "./features/submissions/pages/EventSubmissionsPage";
import CreateSession from "./features/events/pages/CreateSessionPage";
import EventDetails from "./features/events/pages/EventDetailsPage";
import SessionsList from "./features/events/pages/SessionsListPage";
import DashboardAuthor from "./features/dashboard/pages/AuthorDashboard";
import DashboardParticipant from "./features/dashboard/pages/ParticipantDashboard";
import DashboardReviewer from "./features/dashboard/pages/ReviewerDashboard";
import NewSubmission from "./features/submissions/pages/NewSubmissionPage";
import AssignReviewers from "./features/submissions/pages/AssignReviewersPage";
import { Toaster } from "./components/ui/toaster";
import NotificationListener from "./components/NotificationListener";
import "./styles/global.css";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
}


function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="scicon-theme">
            <BrowserRouter>
                <NotificationListener />
                <Routes>
                    <Route path="/" element={<ProtectedRoutes><Layout><Home /></Layout></ProtectedRoutes>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterAndLogout />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<NotFound />} />

                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
                    <Route path="/dashboard-participant" element={<ProtectedRoutes><DashboardParticipant /></ProtectedRoutes>} />
                    <Route path="/dashboard-reviewer" element={<ProtectedRoutes><DashboardReviewer /></ProtectedRoutes>} />
                    <Route path="/dashboard-author" element={<ProtectedRoutes><DashboardAuthor /></ProtectedRoutes>} />
                    <Route path="/submissions/new" element={<ProtectedRoutes><NewSubmission /></ProtectedRoutes>} />

                    {/* Oganizer Routes - Using Custom Layout (OrganizerSidebar) inside the components */}
                    <Route path="/dashboard-organizer" element={<ProtectedRoutes><DashboardOrganizer /></ProtectedRoutes>} />
                    <Route path="/events/my-events" element={<ProtectedRoutes><OrganizerEvents /></ProtectedRoutes>} />
                    <Route path="/organizer/sessions" element={<ProtectedRoutes><SessionsList /></ProtectedRoutes>} />
                    <Route path="/organizer/participants" element={<ProtectedRoutes><OrganizerParticipants /></ProtectedRoutes>} />
                    <Route path="/organizer/submissions" element={<ProtectedRoutes><OrganizerSubmissions /></ProtectedRoutes>} />
                    <Route path="/organizer/assign-reviewers" element={<ProtectedRoutes><AssignReviewers /></ProtectedRoutes>} />

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
                <Toaster />
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App;
