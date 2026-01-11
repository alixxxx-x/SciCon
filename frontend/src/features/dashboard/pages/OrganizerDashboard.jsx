import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';
import {
    Calendar,
    Users,
    TrendingUp,
    Plus,
    ChevronRight,
    Trash2,
    AlertTriangle,
    ClipboardList,
    Loader2
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon size={22} />
            </div>
        </div>
    </div>
);

const getStatusStyle = (status) => {
    switch (status) {
        case 'open_call': return 'bg-green-100 text-green-700';
        case 'draft': return 'bg-gray-100 text-gray-600';
        case 'ongoing': return 'bg-blue-100 text-blue-700';
        case 'program_ready': return 'bg-purple-100 text-purple-700';
        case 'completed': return 'bg-slate-100 text-slate-600';
        default: return 'bg-gray-100 text-gray-600';
    }
};

const EventRow = ({ event, onDelete }) => {
    const navigate = useNavigate();
    return (
        <tr
            className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/events/${event.id}`)}
        >
            <td className="py-4 px-4">
                <p className="font-semibold text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-500">{event.location || 'No location'}</p>
            </td>
            <td className="py-4 px-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(event.status)}`}>
                    {event.status?.replace('_', ' ').toUpperCase() || 'DRAFT'}
                </span>
            </td>
            <td className="py-4 px-4 text-gray-600">
                {event.start_date ? new Date(event.start_date).toLocaleDateString() : '—'}
            </td>
            <td className="py-4 px-4 text-center font-semibold text-gray-700">
                {event.real_participants_count ?? 0}
            </td>
            <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

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
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrganizerData();
    }, []);

    const fetchOrganizerData = async () => {
        try {
            setLoading(true);
            const [profileRes, myEventsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/events/my-events/')
            ]);

            setUserInfo(profileRes.data);
            const eventsData = myEventsRes.data;
            let allEvents = Array.isArray(eventsData) ? eventsData : (eventsData.results || []);

            const participantsPromises = allEvents.map(e => api.get(`/api/events/${e.id}/registrations/`));
            const participantsResponses = await Promise.all(participantsPromises);

            let totalParticipantsCount = 0;
            allEvents = allEvents.map((event, index) => {
                const regs = Array.isArray(participantsResponses[index].data)
                    ? participantsResponses[index].data
                    : (participantsResponses[index].data.results || []);
                const count = regs.length;
                totalParticipantsCount += count;
                return { ...event, real_participants_count: count };
            });

            const totalEvents = allEvents.length;
            const activeEvents = allEvents.filter(e => e.status === 'open_call' || e.status === 'ongoing' || e.status === 'program_ready').length;

            setStats({
                totalEvents,
                activeEvents,
                totalParticipants: totalParticipantsCount,
                pendingApprovals: 8
            });
            setRecentEvents(allEvents.slice(0, 5));
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await api.delete(`/api/events/${eventId}/`);
                setRecentEvents(prev => prev.filter(event => event.id !== eventId));
                setStats(prev => ({ ...prev, totalEvents: prev.totalEvents - 1 }));
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    if (loading) {
        return (
            <OrganizerSidebar userInfo={userInfo}>
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            </OrganizerSidebar>
        );
    }

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your events, sessions and participants.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/events/create')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={18} /> New Event
                    </button>
                    <button
                        onClick={() => navigate('/sessions/create')}
                        className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        <ClipboardList size={18} /> Mix Session
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Events"
                    value={stats.totalEvents}
                    icon={Calendar}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Active Calls"
                    value={stats.activeEvents}
                    icon={TrendingUp}
                    colorClass="bg-green-50 text-green-600"
                />
                <StatCard
                    title="Total Participants"
                    value={stats.totalParticipants}
                    icon={Users}
                    colorClass="bg-purple-50 text-purple-600"
                />
                <StatCard
                    title="Pending Reviews"
                    value={stats.pendingApprovals}
                    icon={AlertTriangle}
                    colorClass="bg-orange-50 text-orange-600"
                />
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Events</h3>
                    <Link to="/events" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase border-b border-gray-100 dark:border-slate-700">
                            <tr>
                                <th className="py-3 px-4">Event Title</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Start Date</th>
                                <th className="py-3 px-4 text-center">Participants</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="dark:text-gray-300">
                            {recentEvents.length > 0 ? (
                                recentEvents.map(event => (
                                    <EventRow key={event.id} event={event} onDelete={handleDelete} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-400">
                                        No events found.
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

export default DashboardOrganizer;
