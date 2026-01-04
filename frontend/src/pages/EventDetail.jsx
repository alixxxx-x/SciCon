import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    Mail,
    Phone,
    Globe,
    ArrowLeft,
    ChevronRight,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    FileText,
    UserPlus,
    Play
} from 'lucide-react';
import api from '../api';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [regType, setRegType] = useState('participant');
    const [regSuccess, setRegSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const [eventRes, sessionsRes] = await Promise.all([
                    api.get(`/api/events/${id}/`),
                    api.get(`/api/events/${id}/sessions/`)
                ]);
                setEvent(eventRes.data);
                setSessions(sessionsRes.data.results || sessionsRes.data);
            } catch (err) {
                console.error("Error fetching event details:", err);
                setError("Failed to load event details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [id]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegistering(true);
        setError(null);
        try {
            await api.post('/api/registrations/', {
                event: parseInt(id),
                registration_type: regType,
                payment_status: 'pending'
            });
            setRegSuccess(true);
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.response?.data?.detail || "You might already be registered for this event.");
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
                <p className="text-gray-400 mb-6">{error || "The event you are looking for does not exist."}</p>
                <button onClick={() => navigate('/events')} className="px-6 py-2 bg-indigo-600 rounded-xl font-bold">Back to Events</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-indigo-500/30">
            {/* Simple Top Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/events')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">Back to Events</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Calendar className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold italic tracking-tighter">SciCon</span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden text-left">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-20 pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-black uppercase tracking-[0.2em]">{event.event_type}</span>
                                <span className={`px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-[0.2em] ${event.status === 'open_call' ? 'text-green-400' : 'text-gray-400'}`}>
                                    {event.status.replace('_', ' ')}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">{event.title}</h1>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                                        <Calendar className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Date & Time</p>
                                        <p className="font-bold text-gray-200">{new Date(event.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                                        <MapPin className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Location</p>
                                        <p className="font-bold text-gray-200 line-clamp-1">{event.venue}, {event.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                                        <Users className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Theme</p>
                                        <p className="font-bold text-gray-200 line-clamp-1">{event.theme}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Registration Fee</p>
                                        <p className="font-bold text-gray-200">${event.registration_fee || '0.00'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            {!regSuccess ? (
                                <div className="bg-[#111111] border border-white/5 rounded-[40px] p-8 sticky top-28 shadow-2xl shadow-indigo-500/5">
                                    <h3 className="text-2xl font-black mb-6">Reservation</h3>
                                    <form onSubmit={handleRegister} className="space-y-6 text-left">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-3">Participant Role</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {['participant', 'speaker', 'invited'].map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setRegType(type)}
                                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${regType === type ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/10'}`}
                                                    >
                                                        <span className="capitalize font-bold">{type}</span>
                                                        {regType === type && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                                <p className="text-xs text-red-400 font-semibold">{error}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={registering}
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-[20px] font-black transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                                        >
                                            {registering ? "Processing..." : "Register Now"}
                                            {!registering && <ArrowRight className="w-5 h-5" />}
                                        </button>
                                        <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest mt-4">Secure checkout & instant confirmation</p>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-indigo-600 border border-indigo-500 rounded-[40px] p-8 text-center sticky top-28 shadow-2xl shadow-indigo-600/40 transform transition-all animate-in zoom-in-95 duration-300">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4">Registration Ready!</h3>
                                    <p className="text-indigo-100 font-semibold mb-8">You have successfully registered for this event. Check your dashboard for details.</p>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="w-full py-4 bg-white text-indigo-600 rounded-[20px] font-black transition-all hover:bg-indigo-50 shadow-lg"
                                    >
                                        Go to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Description & Sessions */}
            <section className="pb-32 text-left">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8">
                            <div className="mb-16">
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-indigo-400" />
                                    About the Event
                                </h2>
                                <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8 md:p-10 leading-relaxed text-gray-300 whitespace-pre-wrap font-medium">
                                    {event.description}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-indigo-400" />
                                    Scientific Program
                                </h2>

                                {sessions.length > 0 ? (
                                    <div className="space-y-6">
                                        {sessions.map((session, idx) => (
                                            <div key={session.id} className="group relative bg-[#111111] border border-white/5 rounded-[32px] p-8 hover:border-indigo-500/40 transition-all duration-300">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="flex items-start gap-6">
                                                        <div className="w-16 h-16 rounded-2xl bg-black/40 flex flex-col items-center justify-center border border-white/5 group-hover:border-indigo-500/20">
                                                            <span className="text-[10px] font-black text-gray-500 uppercase">Room</span>
                                                            <span className="text-sm font-bold text-indigo-400">{session.room}</span>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500/60">{session.session_type}</span>
                                                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                                <span className="text-xs font-bold text-gray-400">{session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}</span>
                                                            </div>
                                                            <h3 className="text-xl font-black mb-3 group-hover:text-white transition-colors">{session.title}</h3>
                                                            <p className="text-sm text-gray-500 font-medium line-clamp-2">{session.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 border border-white/5">Reserved Info</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center bg-[#111111] border border-dashed border-white/10 rounded-[40px]">
                                        <p className="text-gray-500 font-bold uppercase tracking-widest">Scientific program is being finalized</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact & Committee Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-[#111111] border border-white/5 rounded-[40px] p-8 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl" />
                                <h3 className="text-xl font-black mb-8">Direct Contact</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-500">Email Address</p>
                                            <p className="text-sm font-bold text-gray-300">{event.contact_email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-500">Phone Support</p>
                                            <p className="text-sm font-bold text-gray-300">{event.contact_phone || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-500">Official Website</p>
                                            <p className="text-sm font-bold text-gray-300">{event.website ? (
                                                <a href={event.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Link to Site</a>
                                            ) : "Not available"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-white/5 rounded-[40px] p-8">
                                <h3 className="text-xl font-black mb-6">Committee</h3>
                                <p className="text-sm text-gray-400 font-medium mb-8 leading-relaxed">This event is organized and curated by a board of healthcare professionals and researchers.</p>
                                <div className="flex -space-x-3 mb-8">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] bg-indigo-500 flex items-center justify-center text-xs font-black">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400">
                                        +5
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">View all Members</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EventDetail;
