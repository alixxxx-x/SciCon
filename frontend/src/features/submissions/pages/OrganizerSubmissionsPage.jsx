import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';

const OrganizerSubmissions = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, eventsRes] = await Promise.all([
                    api.get('/api/auth/profile/'),
                    api.get('/api/events/my-events/')
                ]);
                setUserInfo(profileRes.data);

                // Handle potentially paginated response
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
                <h1 className="text-3xl font-bold text-white">Submissions</h1>
                <p className="text-gray-400">Manage paper submissions for your events</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-gray-500">Loading...</div>
                ) : events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id} className="bg-[#1a1a2e] border border-gray-800 p-6 rounded-2xl flex items-center justify-between group hover:bg-gray-800/20 transition-all">
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{event.title}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <FileText size={14} /> 12 Pending Reviews
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Total Submissions: 45
                                    </span>
                                </div>
                            </div>
                            <button className="p-3 bg-gray-800 rounded-xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500">No events found.</div>
                )}
            </div>
        </OrganizerSidebar>
    );
};

export default OrganizerSubmissions;
