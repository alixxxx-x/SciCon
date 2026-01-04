import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    Plus,
    ArrowLeft,
    X,
    Save,
    Building,
    Globe,
    Mail,
    Phone,
    FileText,
    BadgeInfo,
    Layers,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import api from '../api';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_type: 'congress',
        theme: '',
        status: 'draft',
        start_date: '',
        end_date: '',
        submission_deadline: '',
        notification_date: '',
        venue: '',
        city: '',
        country: '',
        address: '',
        contact_email: '',
        contact_phone: '',
        website: '',
        registration_fee: '0.00'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simple validation for dates
        if (new Date(formData.start_date) > new Date(formData.end_date)) {
            setError("Start date cannot be after end date.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/api/events/', formData);
            setSuccess(true);
            setTimeout(() => {
                navigate(`/events/${response.data.id}`);
            }, 2000);
        } catch (err) {
            console.error("Error creating event:", err);
            setError(err.response?.data ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(', ') : "Failed to create event. Please check all fields.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
                <div className="bg-[#111111] border border-green-500/30 p-12 rounded-[48px] text-center max-w-md w-full shadow-2xl shadow-green-500/10">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">Event Created!</h2>
                    <p className="text-gray-400 font-medium mb-0">Your scientific event has been successfully registered. Redirecting you to the event page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans pb-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 py-6">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/events')} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-black tracking-tight italic">Create <span className="text-indigo-500">New Event</span></h1>
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-gray-500">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">Organizer Mode</span>
                    </div>
                </div>
            </header>

            <main className="pt-32 max-w-5xl mx-auto px-6 text-left">
                <form onSubmit={handleSubmit} className="space-y-12">
                    {error && (
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                            <div>
                                <h4 className="font-black text-red-400 text-sm uppercase tracking-widest mb-1">Creation Error</h4>
                                <p className="text-sm text-red-400/80 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Section 1: Basic Information */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                                <BadgeInfo className="w-6 h-6 text-indigo-500" />
                            </div>
                            <h2 className="text-2xl font-black">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Event Full Title</label>
                                <input
                                    name="title" required
                                    value={formData.title} onChange={handleChange}
                                    placeholder="e.g., International Congress on AI in Healthcare"
                                    className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Event Type</label>
                                <div className="relative">
                                    <select
                                        name="event_type" value={formData.event_type} onChange={handleChange}
                                        className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 appearance-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-bold"
                                    >
                                        <option value="congress">Congress</option>
                                        <option value="seminar">Seminar</option>
                                        <option value="scientific_day">Scientific Day</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="colloquium">Colloquium</option>
                                    </select>
                                    <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Main Theme</label>
                                <input
                                    name="theme" required
                                    value={formData.theme} onChange={handleChange}
                                    placeholder="e.g., Machine Learning, Clinical Research"
                                    className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Detailed Description</label>
                                <textarea
                                    name="description" required rows="6"
                                    value={formData.description} onChange={handleChange}
                                    placeholder="Provide a comprehensive description of the event, its objectives and expected impact..."
                                    className="w-full bg-[#111111] border border-white/5 rounded-3xl p-6 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium leading-relaxed placeholder:text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Important Dates */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-indigo-500" />
                            </div>
                            <h2 className="text-2xl font-black">Important Dates</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Start Date</label>
                                <input name="start_date" type="date" required value={formData.start_date} onChange={handleChange} className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">End Date</label>
                                <input name="end_date" type="date" required value={formData.end_date} onChange={handleChange} className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Submission Deadline</label>
                                <input name="submission_deadline" type="datetime-local" required value={formData.submission_deadline} onChange={handleChange} className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Notification Date</label>
                                <input name="notification_date" type="date" required value={formData.notification_date} onChange={handleChange} className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Venue & Location */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-indigo-500" />
                            </div>
                            <h2 className="text-2xl font-black">Venue & Location</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Venue Name</label>
                                <input name="venue" required value={formData.venue} onChange={handleChange} placeholder="e.g., Grand Medical Convention Center" className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold placeholder:text-gray-700" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">City</label>
                                <input name="city" required value={formData.city} onChange={handleChange} placeholder="e.g., Algiers" className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold placeholder:text-gray-700" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Country</label>
                                <input name="country" required value={formData.country} onChange={handleChange} placeholder="e.g., Algeria" className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold placeholder:text-gray-700" />
                            </div>
                            <div className="lg:col-span-2 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Full Address</label>
                                <input name="address" value={formData.address} onChange={handleChange} placeholder="Enter the complete address..." className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold placeholder:text-gray-700" />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Contact & Fees */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-indigo-500" />
                            </div>
                            <h2 className="text-2xl font-black">Contact & Registration</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-2 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Contact Email</label>
                                <input name="contact_email" type="email" required value={formData.contact_email} onChange={handleChange} placeholder="organizer@scicon.org" className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold placeholder:text-gray-700" />
                            </div>
                            <div className="lg:col-span-2 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Contact Phone</label>
                                <input name="contact_phone" value={formData.contact_phone} onChange={handleChange} placeholder="+213 000 000 000" className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold placeholder:text-gray-700" />
                            </div>
                            <div className="lg:col-span-3 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Website URL</label>
                                <input name="website" type="url" value={formData.website} onChange={handleChange} placeholder="https://www.example.org" className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold placeholder:text-gray-700" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Registration Fee ($)</label>
                                <input name="registration_fee" type="number" step="0.01" value={formData.registration_fee} onChange={handleChange} className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 font-bold" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 flex items-center justify-end gap-6 border-t border-white/5">
                        <button type="button" onClick={() => navigate('/events')} className="px-8 py-4 text-gray-500 font-black uppercase tracking-widest hover:text-white transition-all">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 disabled:bg-gray-800 disabled:text-gray-600 flex items-center gap-3"
                        >
                            {loading ? "Registering Event..." : "Create Event"}
                            {!loading && <Save className="w-5 h-5" />}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CreateEvent;
