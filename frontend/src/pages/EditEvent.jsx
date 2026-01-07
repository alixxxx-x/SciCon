import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    ArrowLeft,
    Save,
    BadgeInfo,
    Layers,
    Clock,
    CheckCircle2,
    AlertCircle,
    Mail,
    Loader2
} from 'lucide-react';
import api from '../api';
import DashboardLayout from '../components/layout/DashboardLayout';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/api/events/${id}/`);
            const data = response.data;

            const formatDate = (dateString, includeTime = false) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                if (includeTime) {
                    return date.toISOString().slice(0, 16);
                }
                return date.toISOString().split('T')[0];
            };

            setFormData({
                title: data.title,
                description: data.description,
                event_type: data.event_type,
                theme: data.theme,
                status: data.status,
                start_date: formatDate(data.start_date),
                end_date: formatDate(data.end_date),
                submission_deadline: formatDate(data.submission_deadline, true),
                notification_date: formatDate(data.notification_date),
                venue: data.venue,
                city: data.city,
                country: data.country,
                address: data.address,
                contact_email: data.contact_email,
                contact_phone: data.contact_phone,
                website: data.website,
                registration_fee: data.registration_fee
            });
        } catch (err) {
            console.error("Error fetching event details:", err);
            setError("Failed to load event details.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await api.put(`/api/events/${id}/`, formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard-organizer');
            }, 2000);
        } catch (err) {
            console.error("Error updating event:", err);
            setError("Failed to update event. Please check your data.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    if (success) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Updated!</h2>
                    <p className="text-gray-500">Redirecting to management dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <button
                    onClick={() => navigate('/dashboard-organizer')}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 text-sm font-semibold"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Modify Event Details</h1>
                <p className="text-gray-500">Update the timeline, location, or general information of your scientific event.</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 pb-20">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 font-bold">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tight text-sm">
                            <BadgeInfo size={18} className="text-blue-600" />
                            Core Information
                        </h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Title</label>
                            <input
                                name="title" required value={formData.title} onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-blue-500 font-bold"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Type</label>
                                <select name="event_type" value={formData.event_type} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-blue-500 font-bold">
                                    <option value="congress">Congress</option>
                                    <option value="seminar">Seminar</option>
                                    <option value="scientific_day">Scientific Day</option>
                                    <option value="workshop">Workshop</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Public Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-blue-500 font-bold">
                                    <option value="draft">Draft (Hidden)</option>
                                    <option value="open_call">Open Call (Visible)</option>
                                    <option value="program_ready">Program Ready</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scientific Theme</label>
                            <input name="theme" required value={formData.theme} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-blue-500 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                            <textarea name="description" required rows="5" value={formData.description} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-blue-500 font-medium leading-relaxed resize-none" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tight text-xs border-b border-gray-50 pb-4">
                            <Clock size={16} className="text-orange-500" />
                            Timeline & Deadlines
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Date</label>
                                <input name="start_date" type="date" required value={formData.start_date} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Date</label>
                                <input name="end_date" type="date" required value={formData.end_date} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs font-bold" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paper Submission Deadline</label>
                                <input name="submission_deadline" type="datetime-local" required value={formData.submission_deadline} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs font-bold" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tight text-xs border-b border-gray-50 pb-4">
                            <MapPin size={16} className="text-red-500" />
                            Physical Venue
                        </h3>
                        <div className="space-y-4">
                            <input name="venue" placeholder="Venue Name" value={formData.venue} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs font-bold" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs font-bold" />
                                <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs font-bold" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/dashboard-organizer')} className="px-8 py-4 text-gray-400 font-bold uppercase tracking-widest text-sm hover:text-gray-900 transition-colors">Discard</button>
                    <button type="submit" disabled={submitting} className="bg-gray-900 hover:bg-black text-white px-12 py-4 rounded-xl font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center gap-2">
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Confirm Changes
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
};

export default EditEvent;
