import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, ChevronRight, FileText, Loader2, Users } from 'lucide-react';
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
            const eventsList = Array.isArray(eventsData) ? eventsData : (eventsData.results || []);
            setEvents(eventsList);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'open_call': return 'bg-green-50 text-green-700 border-green-100';
            case 'ongoing': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'program_ready': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'completed': return 'bg-gray-50 text-gray-700 border-gray-100';
            default: return 'bg-orange-50 text-orange-700 border-orange-100';
        }
    };

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">My Events</h1>
                    <p className="text-gray-500 font-medium">Manage and monitor the progress of your scientific conferences.</p>
                </div>

            </div>

            <div className="space-y-6">
                {/* Control Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search among your events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Events Grid/List */}
                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching your catalog...</p>
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                                    <tr>
                                        <th className="py-5 px-8">Conference Title</th>
                                        <th className="py-5 px-6">Event Date</th>
                                        <th className="py-5 px-6">Status</th>
                                        <th className="py-5 px-6 text-center">Registrations</th>
                                        <th className="py-5 px-8 text-right">Settings</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredEvents.map((event) => (
                                        <tr key={event.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-base">{event.title}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{event.event_type}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                                    <Calendar size={16} className="text-gray-300" />
                                                    {new Date(event.start_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="py-6 px-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(event.status)}`}>
                                                    {event.status?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-6 px-6">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-black text-gray-900">{event.participants_count || 0}</span>
                                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Delegates</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => navigate(`/events/${event.id}/edit`)}
                                                        className="px-4 py-2 bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/events/${event.id}`)}
                                                        className="p-2 text-gray-300 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all"
                                                    >
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-32 text-center">
                            <Calendar size={48} className="mx-auto text-gray-100 mb-6" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Conferences Found</h3>
                            <p className="text-gray-400 font-medium mb-8">You haven't created any events yet or matching your search.</p>

                        </div>
                    )}
                </div>
            </div>
        </OrganizerSidebar>
    );
};

export default OrganizerEvents;
