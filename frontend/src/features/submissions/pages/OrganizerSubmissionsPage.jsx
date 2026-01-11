import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, RefreshCw, Calendar, Users, ClipboardList } from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OrganizerSubmissions = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, eventsRes] = await Promise.all([
                    api.get('/api/auth/profile/'),
                    api.get('/api/events/my-events/')
                ]);
                setUserInfo(profileRes.data);

                const eventsData = eventsRes.data;
                const eventsList = Array.isArray(eventsData) ? eventsData : (eventsData.results || []);
                setEvents(eventsList);
            } catch (error) {
                console.error("Error fetching data:", error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase mb-1">Submissions Catalog</h1>
                <p className="text-sm text-slate-500">Access and review scientific contributions across your events.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-slate-300 animate-spin mb-4" />
                        <p className="text-slate-400 text-xs italic">Loading submissions...</p>
                    </div>
                ) : events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors">
                                    <ClipboardList size={20} />
                                </div>
                                <Badge variant="secondary" className="bg-slate-50 text-slate-600 text-[9px] font-medium px-2 py-0.5 uppercase">
                                    {event.status?.replace('_', ' ') || 'DRAFT'}
                                </Badge>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 truncate group-hover:text-blue-600 transition-colors">{event.title}</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium uppercase">
                                    <span>Submissions Count</span>
                                    <span className="text-slate-900 dark:text-white">{event.submissions_count || 0}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate(`/events/${event.id}/submissions`)}
                                variant="outline"
                                className="w-full h-9 border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                            >
                                View Submissions <ChevronRight size={14} />
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white border border-slate-200 rounded-xl">
                        <FileText size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 text-sm italic">No events found in your portfolio.</p>
                    </div>
                )}
            </div>
        </OrganizerSidebar>
    );
};

export default OrganizerSubmissions;
