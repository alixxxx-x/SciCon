import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    Mail,
    ArrowLeft,
    CheckCircle,
    Loader2,
    FileText,
    AlertCircle,
    Tag,
    Lock,
    Info
} from 'lucide-react';
import api from '../../../services/api';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [registrationData, setRegistrationData] = useState({
        registration_type: 'participant',
        payment_status: 'pending'
    });

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const [eventRes, profileRes] = await Promise.all([
                api.get(`/api/events/${id}/`),
                api.get('/api/auth/profile/').catch(() => ({ data: null }))
            ]);
            setEvent(eventRes.data);
            setUserInfo(profileRes.data);
        } catch (error) {
            console.error("Error fetching event details:", error);
            setError("Failed to load event details");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (event.status !== 'program_ready') return;
        setRegistering(true);
        setError(null);
        try {
            await api.post(`/api/events/${id}/registrations/`, registrationData);
            setSuccess(true);
            setTimeout(() => {
                const role = userInfo?.role;
                navigate(role === 'organizer' ? '/dashboard-organizer' : (role === 'author' ? '/dashboard-author' : '/dashboard'));
            }, 2000);
        } catch (err) {
            console.error("Error registering for event:", err);
            setError(err.response?.data?.detail || "Registration failed. Please try again.");
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center max-w-sm">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Event not found</h2>
                    <p className="text-gray-500 mb-6">The event you are looking for might have been removed or is currently unavailable.</p>
                    <button onClick={() => navigate('/events')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Back to Catalog
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center max-w-md w-full shadow-sm">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Successful</h2>
                    <p className="text-gray-500 mb-0">Thank you for registering. Redirecting to your dashboard...</p>
                </div>
            </div>
        );
    }

    const isProgramReady = event.status === 'program_ready';

    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Simple Top Navigation */}
            <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={() => navigate('/events')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
                        <ArrowLeft size={16} /> Back to Events
                    </button>
                    <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wide
                            ${event.status === 'program_ready' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-50 text-gray-500 border-gray-200'}
                        `}>
                            {event.status?.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-4">
                        <Tag size={14} /> {event.event_type}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span>{new Date(event.start_date).toLocaleDateString()} — {new Date(event.end_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{event.venue}, {event.city}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Description & Program */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">About the Event</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </section>

                        {event.sessions?.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Program Schedule</h2>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-medium">{event.sessions.length} Sessions</span>
                                </div>
                                <div className="space-y-3">
                                    {event.sessions.map((session, idx) => (
                                        <div key={idx} className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex items-start justify-between gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-bold text-sm text-gray-900">{session.title}</h4>
                                                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {session.start_time}</span>
                                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {session.room}</span>
                                                    <span className="text-blue-600 font-medium">{session.session_type}</span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold">{session.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Registration & Info */}
                    <div className="space-y-6">
                        {/* Registration Box */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-6">Registration</h3>

                            <div className="mb-6">
                                <div className="text-sm text-gray-500 mb-1">Entry Fee</div>
                                <div className="text-3xl font-bold text-gray-900">
                                    <span className="text-lg font-semibold mr-1">DZD</span>
                                    {parseFloat(event.registration_fee || 0).toLocaleString()}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Delegate Type</label>
                                    <select
                                        value={registrationData.registration_type}
                                        onChange={(e) => setRegistrationData({ ...registrationData, registration_type: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                                    >
                                        <option value="participant">Participant</option>
                                        <option value="speaker">Speaker</option>
                                        <option value="invited">Invited</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleRegister}
                                    disabled={registering || !isProgramReady}
                                    className={`w-full py-3.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
                                        ${isProgramReady
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                        }`}
                                >
                                    {registering ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : !isProgramReady ? (
                                        <><Lock size={16} /> Registration Closed</>
                                    ) : (
                                        "Register Now"
                                    )}
                                </button>

                                {!isProgramReady && (
                                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <Info size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                        <p className="text-[11px] text-gray-500 leading-normal font-medium">
                                            Registration opens only when the event program is finalized.
                                        </p>
                                    </div>
                                )}

                                {userInfo?.role === 'author' && event.status === 'open_call' && (
                                    <button
                                        onClick={() => navigate('/submissions/new', { state: { eventId: event.id } })}
                                        className="w-full py-3 bg-white border border-gray-900 text-gray-900 hover:bg-gray-50 font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                                    >
                                        Submit Abstract
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Event Stats */}
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Event Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Participants</span>
                                    <span className="font-bold text-gray-900">{event.registrations_count || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Submissions</span>
                                    <span className="font-bold text-gray-900">{event.submissions_count || 0}</span>
                                </div>
                                {event.submission_deadline && (
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Deadline</div>
                                        <div className="text-xs font-bold text-orange-600">
                                            {new Date(event.submission_deadline).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact info */}
                        <div className="px-2 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail size={16} className="text-gray-400" />
                                <a href={`mailto:${event.contact_email}`} className="hover:text-blue-600 transition-colors">{event.contact_email}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
