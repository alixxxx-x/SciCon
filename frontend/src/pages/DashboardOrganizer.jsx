import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar,
    Users,
    TrendingUp,
    Plus,
    AlertTriangle,
    MoreVertical,
    Trash2,
    Edit,
    ClipboardList
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import OrganizerSidebar from '../components/layout/OrganizerSidebar';

const DashboardOrganizer = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEvents: 0,
        activeEvents: 0,
        totalParticipants: 0,
        pendingApprovals: 0
    });
    const [recentEvents, setRecentEvents] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        fetchOrganizerData();

        // Close menu when clicking outside
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchOrganizerData = async () => {
        try {
            setLoading(true);
            const [profileRes, dashboardRes, myEventsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/dashboard/'),
                api.get('/api/events/my-events/') // Fetch all events for accurate stats
            ]);

            setUserInfo(profileRes.data);

            // Handle potentially paginated response for events
            const eventsData = myEventsRes.data;
            const allEvents = Array.isArray(eventsData) ? eventsData : (eventsData.results || []);

            // Calculate stats from ALL events
            const totalEvents = allEvents.length;
            const activeEvents = allEvents.filter(e => e.status === 'open_call' || e.status === 'ongoing').length;

            // Calculate total participants across all events
            const totalParticipants = allEvents.reduce((acc, curr) => acc + (curr.participants_count || 0), 0);

            setStats({
                totalEvents: totalEvents,
                activeEvents: activeEvents,
                totalParticipants: totalParticipants,
                pendingApprovals: 12 // Placeholder or fetch if available
            });

            // Set recent events (first 5 of the full list)
            setRecentEvents(allEvents.slice(0, 5));

        } catch (error) {
            console.error("Error fetching organizer data:", error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            try {
                await api.delete(`/api/events/${eventId}/`);
                setRecentEvents(prev => prev.filter(event => event.id !== eventId));
                setStats(prev => ({ ...prev, totalEvents: prev.totalEvents - 1 }));
                setActiveMenu(null);
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Failed to delete event.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <OrganizerSidebar userInfo={userInfo}>
            {/* Title & Action */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Organizer Dashboard</h1>
                    <p className="text-gray-400">Manage your scientific events and review performance</p>
                </div>
                <button
                    onClick={() => navigate('/events/create')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                    <Plus size={18} /> Create New Event
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Events" value={stats.totalEvents} icon={Calendar} color="bg-blue-500" />
                <StatCard title="Active Events" value={stats.activeEvents} icon={TrendingUp} color="bg-green-500" />
                <StatCard title="Participants" value={stats.totalParticipants} icon={Users} color="bg-purple-500" />
                <StatCard title="Pending Approval" value={stats.pendingApprovals} icon={AlertTriangle} color="bg-orange-500" />
            </div>

            {/* Recent Events Table */}
            <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 shadow-sm mb-8" ref={menuRef}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Recent Events</h3>
                    <Link to="/events/my-events" className="text-blue-400 hover:text-blue-300 text-sm">View All</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-800">
                                <th className="py-3 px-4 font-medium">Event Name</th>
                                <th className="py-3 px-4 font-medium">Date</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                                <th className="py-3 px-4 font-medium">Participants</th>
                                <th className="py-3 px-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentEvents.length > 0 ? (
                                recentEvents.map(event => (
                                    <tr key={event.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                        <td className="py-4 px-4 font-medium text-white">{event.title}</td>
                                        <td className="py-4 px-4 text-gray-400">
                                            {new Date(event.start_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(event.status)}`}>
                                                {event.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-300">{event.participants_count || 0}</td>
                                        <td className="py-4 px-4 text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenu(activeMenu === event.id ? null : event.id);
                                                }}
                                                className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {activeMenu === event.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-[#1f1f35] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                                    <button
                                                        onClick={() => navigate(`/events/${event.id}/edit`)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-colors text-left"
                                                    >
                                                        <Edit size={16} /> Update
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/events/${event.id}/submissions`)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-colors text-left"
                                                    >
                                                        <ClipboardList size={16} /> Pending Approval
                                                    </button>
                                                    <div className="h-px bg-gray-700 mx-2 my-1"></div>
                                                    <button
                                                        onClick={(e) => handleDelete(event.id, e)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-left"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">
                                        No events created yet. Start by creating your first event!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </OrganizerSidebar>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-[#1a1a2e] border border-gray-800 p-5 rounded-2xl">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
    </div>
);

const getStatusStyle = (status) => {
    switch (status) {
        case 'ongoing':
        case 'open_call': return 'bg-green-500/10 text-green-400 border-green-500/20';
        case 'draft': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
};

export default DashboardOrganizer;
