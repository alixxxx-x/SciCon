import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import api from '../../api';
import OrganizerSidebar from '../../components/layout/OrganizerSidebar';

const OrganizerEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const [profileRes, eventsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/events/my-events/')
            ]);
            setUserInfo(profileRes.data);
            const eventsData = eventsRes.data;
            // Handle both direct array and paginated response
            const eventsList = Array.isArray(eventsData) ? eventsData : (eventsData.results || []);
            setEvents(eventsList);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = Array.isArray(events) ? events.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ongoing':
            case 'open_call': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'draft': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Events</h1>
                    <p className="text-gray-400">Manage all your created scientific events</p>
                </div>
                <button
                    onClick={() => navigate('/events/create')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                    <Plus size={18} /> Create New Event
                </button>
            </div>

            <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 shadow-sm">
                {/* Search Bar */}
                <div className="mb-6 relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search your events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111111] border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-gray-600 text-white"
                    />
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
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading events...</td></tr>
                            ) : filteredEvents.length > 0 ? (
                                filteredEvents.map(event => (
                                    <tr key={event.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                        <td className="py-4 px-4 font-medium text-white">{event.title}</td>
                                        <td className="py-4 px-4 text-gray-400">
                                            {new Date(event.start_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(event.status)}`}>
                                                {event.status?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-300">{event.participants_count || 0}</td>
                                        <td className="py-4 px-4 text-right">
                                            <button
                                                onClick={() => navigate(`/events/${event.id}`)}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">
                                        No events found matching your search.
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

export default OrganizerEvents;
