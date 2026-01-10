import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    Calendar,
    MapPin,
    Users,
    Loader2,
    AlertCircle,
    Presentation,
    Filter,
    ChevronRight,
    Search
} from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';

const SessionCard = ({ session }) => {
    const getSessionTypeStyle = (type) => {
        const styles = {
            'plenary': 'bg-blue-50 text-blue-700 border-blue-100',
            'parallel': 'bg-purple-50 text-purple-700 border-purple-100',
            'poster': 'bg-green-50 text-green-700 border-green-100',
            'workshop': 'bg-orange-50 text-orange-700 border-orange-100',
        };
        return styles[type] || 'bg-gray-50 text-gray-700 border-gray-100';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSessionTypeStyle(session.session_type)}`}>
                    {session.session_type.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase">
                    ID: {session.id}
                </span>
            </div>

            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                {session.title}
            </h3>

            <p className="text-xs text-blue-600 font-semibold mb-4 flex items-center gap-1">
                <Calendar size={12} /> {session.event_title}
            </p>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={14} className="text-orange-500" />
                    <span>{session.date} | {session.start_time} - {session.end_time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={14} className="text-red-500" />
                    <span>{session.room || "No Room Assigned"}</span>
                </div>
                {session.max_participants && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users size={14} className="text-green-500" />
                        <span>Max {session.max_participants} Participants</span>
                    </div>
                )}
            </div>

            {session.description && (
                <p className="text-xs text-gray-400 line-clamp-2 italic border-t border-gray-50 pt-3">
                    {session.description}
                </p>
            )}
        </div>
    );
};

const SessionsList = () => {
    const [sessions, setSessions] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, eventsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/events/my-events/')
            ]);

            setUserInfo(profileRes.data);
            const eventsData = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data.results || []);
            setEvents(eventsData);

            const allSessions = [];
            for (const event of eventsData) {
                try {
                    const sessionsRes = await api.get(`/api/events/${event.id}/sessions/`);
                    const eventSessions = Array.isArray(sessionsRes.data) ? sessionsRes.data : (sessionsRes.data.results || []);
                    eventSessions.forEach(session => {
                        allSessions.push({
                            ...session,
                            event_title: event.title,
                            event_id: event.id
                        });
                    });
                } catch (error) {
                    console.error(`Error for event ${event.id}:`, error);
                }
            }
            setSessions(allSessions);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = sessions.filter(s => {
        const matchesEvent = selectedEvent === 'all' || s.event_id === parseInt(selectedEvent);
        const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesEvent && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
            </div>
        );
    }

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Program Sessions</h1>
                    <p className="text-gray-500">Overview of all scheduled sessions across your events.</p>
                </div>
                <button
                    onClick={() => navigate('/sessions/create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                >
                    <Presentation size={18} /> New Session
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search session title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="flex-1 md:w-64 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                    >
                        <option value="all">Filter by Event</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredSessions.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-600">No sessions found</h3>
                    <p className="text-gray-400">Expand your search or create a new session.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </div>
            )}
        </OrganizerSidebar>
    );
};

export default SessionsList;
