import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    ArrowLeft,
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
    AlertCircle,
    Loader2
} from 'lucide-react';
import api from '../api';
import OrganizerSidebar from '../components/layout/OrganizerSidebar';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/api/auth/profile/');
                setUserInfo(res.data);
            } catch (err) {
                console.error("Profile fetch error:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (new Date(formData.start_date) > new Date(formData.end_date)) {
            setError("Start date cannot be after end date.");
            setLoading(false);
            return;
        }

        try {
            await api.post('/api/events/', formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard-organizer');
            }, 2000);
        } catch (err) {
            console.error("Error creating event:", err);
            setError(err.response?.data ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(', ') : "Failed to create event.");
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Created!</h2>
                    <p className="text-gray-500 mb-0 font-medium">Your event has been successfully registered. Redirecting to dashboard...</p>
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
                    <ArrowLeft size={16} /> Back to Events
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Configure New Event</h1>
                <p className="text-gray-500">Provide the essential details to launch your scientific event.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Card 1: Basic Info */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <BadgeInfo size={18} className="text-blue-600" />
                            General Information
                        </h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Event Title</label>
                            <input
                                name="title" required value={formData.title} onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g. Algerian Health Innovation Summit 2026"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Event Type</label>
                            <select
                                name="event_type" value={formData.event_type} onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="congress">Congress</option>
                                <option value="seminar">Seminar</option>
                                <option value="scientific_day">Scientific Day</option>
                                <option value="workshop">Workshop</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Theme</label>
                            <input
                                name="theme" required value={formData.theme} onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g. Digital Transformation in Medicine"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                name="description" required rows="4" value={formData.description} onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors resize-none"
                                placeholder="Comprehensive overview of the event..."
                            />
                        </div>
                    </div>
                </div>

                {/* Card 2: Dates & Location */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Clock size={18} className="text-orange-600" />
                                Timeline
                            </h3>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Start Date</label>
                                    <input name="start_date" type="date" required value={formData.start_date} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">End Date</label>
                                    <input name="end_date" type="date" required value={formData.end_date} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Submission Deadline</label>
                                <input name="submission_deadline" type="datetime-local" required value={formData.submission_deadline} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <MapPin size={18} className="text-red-6100" />
                                Location
                            </h3>
                        </div>
                        <div className="p-8 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Venue Name</label>
                                <input name="venue" required value={formData.venue} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">City</label>
                                    <input name="city" required value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Country</label>
                                    <input name="country" required value={formData.country} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Fees & Contact */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-right">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Mail size={18} className="text-purple-600" />
                            Contact & Fees
                        </h3>
                    </div>
                    <div className="p-8 flex flex-col md:flex-row gap-8 items-end">
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Contact Email</label>
                                <input name="contact_email" type="email" required value={formData.contact_email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Registration Fee (DZD)</label>
                                <input name="registration_fee" type="number" required value={formData.registration_fee} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50 h-fit"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Finalize and Launch
                        </button>
                    </div>
                </div>
            </form>
        </OrganizerSidebar>
    );
};

export default CreateEvent;
