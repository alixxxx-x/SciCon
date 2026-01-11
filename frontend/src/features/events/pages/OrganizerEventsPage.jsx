import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, ChevronRight, FileText, Loader2, Users, RefreshCw, Pencil, Info } from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
            case 'ongoing': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'program_ready': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'completed': return 'bg-slate-50 text-slate-600 border-slate-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase mb-1">
                            Events List
                        </h1>
                        <p className="text-sm text-slate-500">
                            Manage your events and monitor their status.
                        </p>
                    </div>
                    <Button onClick={() => navigate('/events/create')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-4 rounded-lg">
                        <Plus className="mr-2" size={16} /> New Event
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 shadow-sm text-sm"
                    />
                </div>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center">
                            <RefreshCw className="w-8 h-8 text-slate-300 animate-spin mb-4" />
                            <p className="text-slate-400 text-xs italic">Loading events...</p>
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-400">Event Title</th>
                                        <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-400">Event Date</th>
                                        <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-400">Status</th>
                                        <th className="py-3 px-6 text-center text-[10px] font-bold uppercase text-slate-400">Participants</th>
                                        <th className="py-3 px-6 text-right text-[10px] font-bold uppercase text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {filteredEvents.map((event) => (
                                        <tr key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-tight">{event.title}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase font-medium">{event.event_type}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-slate-300" />
                                                    {new Date(event.start_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Badge variant="secondary" className={cn("text-[9px] font-medium px-2 py-0.5 uppercase whitespace-nowrap", getStatusStyle(event.status))}>
                                                    {event.status?.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white uppercase">{event.participants_count || 0}</span>
                                                    <span className="text-[9px] text-slate-400 uppercase font-medium">Participants</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/events/${event.id}/edit`)}
                                                        className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                                    >
                                                        <Pencil size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/events/${event.id}`)}
                                                        className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                                    >
                                                        <ChevronRight size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-32 text-center">
                            <Calendar size={40} className="mx-auto text-slate-100 mb-6" />
                            <h3 className="text-base font-bold text-slate-900 uppercase">No Events Found</h3>
                            <p className="text-slate-400 text-xs italic mt-1">Start by creating your first event.</p>
                        </div>
                    )}
                </Card>
            </div>
        </OrganizerSidebar>
    );
};

export default OrganizerEvents;
