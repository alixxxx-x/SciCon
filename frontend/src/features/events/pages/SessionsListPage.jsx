import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    Calendar,
    MapPin,
    Users,
    RefreshCw,
    AlertCircle,
    Presentation,
    Filter,
    ChevronRight,
    Search
} from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SessionCard = ({ session }) => {
    const getSessionTypeStyle = (type) => {
        const styles = {
            'plenary': 'bg-blue-50 text-blue-700 border-blue-100',
            'parallel': 'bg-purple-50 text-purple-700 border-purple-100',
            'poster': 'bg-green-50 text-green-700 border-green-100',
            'workshop': 'bg-orange-50 text-orange-700 border-orange-100',
        };
        return styles[type] || 'bg-slate-50 text-slate-700 border-slate-100';
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary" className={cn("text-[10px] font-medium px-2 py-0.5 uppercase tracking-wider", getSessionTypeStyle(session.session_type))}>
                    {session.session_type?.replace('_', ' ') || 'SESSION'}
                </Badge>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    ID: #{session.id}
                </span>
            </div>

            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 uppercase tracking-tight">
                {session.title}
            </h3>

            <p className="text-[10px] text-blue-600 font-bold mb-4 flex items-center gap-1.5 uppercase tracking-widest">
                <Calendar size={12} /> {session.event_title}
            </p>

            <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                    <Clock size={14} className="text-blue-500" />
                    <span>{session.date} • {session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                    <MapPin size={14} className="text-red-500" />
                    <span>Room: {session.room || "TBA"}</span>
                </div>
                {session.max_participants && (
                    <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                        <Users size={14} className="text-emerald-500" />
                        <span>Max {session.max_participants} Participants</span>
                    </div>
                )}
            </div>

            {session.description && (
                <p className="text-[10px] text-slate-400 font-medium italic line-clamp-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                    "{session.description}"
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
        const matchesSearch = s.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesEvent && matchesSearch;
    });

    if (loading) {
        return (
            <OrganizerSidebar userInfo={userInfo}>
                <div className="flex h-[50vh] items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
                </div>
            </OrganizerSidebar>
        );
    }

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase mb-1">Event Program</h1>
                    <p className="text-sm text-slate-500">Manage and oversee all scheduled sessions across your events.</p>
                </div>
                <Button
                    onClick={() => navigate('/sessions/create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-4 rounded-lg flex items-center gap-2"
                >
                    <Presentation size={16} /> New Session
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search program sessions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 shadow-sm text-sm"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Filter size={16} className="text-slate-400" />
                    <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="px-4 h-9 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                    >
                        <option value="all">All Events</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredSessions.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-20 rounded-2xl text-center">
                    <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
                    <h3 className="text-slate-500 font-bold uppercase">No sessions matching your criteria.</h3>
                    <p className="text-slate-400 text-xs italic mt-1">Try refining your search or filter by a different event.</p>
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
