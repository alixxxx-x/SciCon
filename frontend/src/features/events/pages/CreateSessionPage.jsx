import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    ArrowLeft,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Presentation,
    Users,
    MapPin
} from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';

const CreateSession = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [events, setEvents] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    const [formData, setFormData] = useState({
        event: '',
        title: '',
        description: '',
        session_type: 'plenary',
        session_date: '',
        start_time: '',
        end_time: '',
        room: '',
        max_participants: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoadingEvents(true);
            const [profileRes, eventsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/events/my-events/')
            ]);
            setUserInfo(profileRes.data);
            const eventsData = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data.results || []);
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load necessary data");
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.event) {
            setError("Please select an event.");
            return;
        }

        setLoading(true);
        setError(null);

        if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
            setError("Start time must be before end time");
            setLoading(false);
            return;
        }

        try {
            await api.post(`/api/events/${formData.event}/sessions/`, {
                title: formData.title,
                description: formData.description,
                session_type: formData.session_type,
                date: formData.session_date,
                start_time: formData.start_time,
                end_time: formData.end_time,
                room: formData.room,
                max_participants: formData.max_participants || null
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard-organizer');
            }, 2000);
        } catch (err) {
            console.error("Error creating session:", err);
            setError(err.response?.data ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(', ') : "Failed to create session.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white border border-gray-200 p-12 rounded-2xl text-center max-w-md w-full shadow-sm">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Created!</h2>
                    <p className="text-gray-500 mb-0">The session has been successfully added to your event timeline.</p>
                </div>
            </div>
        );
    }

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 text-sm font-semibold"
                >
                    <ArrowLeft size={16} /> Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Add New Session</h1>
                <p className="text-gray-500">Plan a new session within one of your active events.</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Presentation size={18} className="text-blue-600" />
                            Session Core Information
                        </h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Event</label>
                            <select
                                name="event"
                                value={formData.event}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="">-- Choose an Event --</option>
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>{event.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Session Title</label>
                            <input
                                name="title" required value={formData.title} onChange={handleChange}
                                placeholder="e.g. Advancements in Cardiology"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Session Type</label>
                                <select
                                    name="session_type" value={formData.session_type} onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="plenary">Plenary Session</option>
                                    <option value="parallel">Parallel Session</option>
                                    <option value="poster">Poster Session</option>
                                    <option value="workshop">Workshop</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Max Participants</label>
                                <input
                                    name="max_participants" type="number" value={formData.max_participants} onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Optional limit"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                name="description" rows="3" value={formData.description} onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors resize-none"
                                placeholder="Brief overview of the session scope..."
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Clock size={18} className="text-orange-600" />
                            Scheduling & Venue
                        </h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                            <input
                                name="session_date" type="date" required value={formData.session_date} onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Time</label>
                            <input
                                name="start_time" type="time" required value={formData.start_time} onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">End Time</label>
                            <input
                                name="end_time" type="time" required value={formData.end_time} onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Room / Venue Location</label>
                            <div className="relative">
                                <input
                                    name="room" value={formData.room} onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 pl-10 outline-none focus:border-blue-500 transition-colors"
                                    placeholder="e.g. Conference Hall B"
                                />
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-gray-50/50 border-t border-gray-100 text-right">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 float-right disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Create Session
                        </button>
                    </div>
                </div>
            </form>
        </OrganizerSidebar>
    );
};

export default CreateSession;
