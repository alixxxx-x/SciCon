import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import api from '../../api';
import OrganizerSidebar from '../../components/layout/OrganizerSidebar';

const OrganizerParticipants = () => {
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
                <h1 className="text-3xl font-bold text-white">Participants</h1>
                <p className="text-gray-400">View participants across your events</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="text-gray-500">Loading participants data...</div>
                ) : events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id} className="bg-[#1a1a2e] border border-gray-800 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                            <div className="flex items-center gap-2 text-gray-400 mb-4">
                                <Users size={18} />
                                <span>{event.participants_count || 0} Participants</span>
                            </div>
                            <button className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 py-2 rounded-xl text-sm font-medium transition-colors">
                                View Participant List
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

export default OrganizerParticipants;
