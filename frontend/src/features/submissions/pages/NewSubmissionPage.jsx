import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FileText,
    Upload,
    Link as LinkIcon,
    AlertCircle,
    CheckCircle,
    ArrowLeft,
    ChevronDown,
    Loader2
} from 'lucide-react';
import api from '../../../services/api';
import AuthorSidebar from '../../../components/layout/AuthorSidebar';

const NewSubmission = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const preSelectedEventId = location.state?.eventId;
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const [formData, setFormData] = useState({
        event: '',
        title: '',
        abstract: '',
        keywords: '',
        submission_type: 'oral',
        co_authors: '',
    });

    const [files, setFiles] = useState({
        abstract_file: null,
        full_paper: null,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoadingEvents(true);
            const [eventsRes, profileRes] = await Promise.all([
                api.get('/api/events/'),
                api.get('/api/auth/profile/')
            ]);

            // Only show events that are open for calls
            const eventsData = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data.results || []);
            const openEvents = eventsData.filter(e => e.status === 'open_call');

            setEvents(openEvents);
            setUserInfo(profileRes.data);

            if (preSelectedEventId) {
                setFormData(prev => ({ ...prev, event: preSelectedEventId.toString() }));
            } else if (openEvents.length > 0) {
                setFormData(prev => ({ ...prev, event: openEvents[0].id.toString() }));
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load events. Please try again.");
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles.length > 0) {
            setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.event) {
            setError("Please select an event.");
            return;
        }
        if (!files.abstract_file) {
            setError("Abstract file is required.");
            return;
        }

        setSubmitting(true);
        setError(null);

        const data = new FormData();
        data.append('event', formData.event); // Required by backend serializer
        data.append('title', formData.title);
        data.append('abstract', formData.abstract);
        data.append('keywords', formData.keywords);
        data.append('submission_type', formData.submission_type);
        data.append('co_authors', formData.co_authors);
        data.append('abstract_file', files.abstract_file);
        if (files.full_paper) {
            data.append('full_paper', files.full_paper);
        }

        try {
            await api.post(`/api/events/${formData.event}/submissions/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard-author');
            }, 2000);
        } catch (err) {
            console.error("Submission error:", err);
            // Construct a meaningful error message from backend validation errors
            let errorMessage = "Failed to submit. Please check all fields.";
            if (err.response?.data) {
                const data = err.response.data;
                if (data.detail) {
                    errorMessage = data.detail;
                } else {
                    // Combine all field errors into a single string
                    const fieldErrors = Object.entries(data)
                        .map(([key, errors]) => `${key}: ${Array.isArray(errors) ? errors.join(' ') : errors}`)
                        .join(' | ');
                    if (fieldErrors) errorMessage = fieldErrors;
                }
            }
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingEvents) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <AuthorSidebar userInfo={userInfo}>
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 text-sm font-semibold"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900">New Scientific Submission</h1>
                <p className="text-gray-500">Submit your work to one of our active scientific events.</p>
            </div>

            {success ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h2>
                    <p className="text-gray-600 mb-6">Your paper has been received and is waiting for review.</p>
                    <p className="text-sm text-gray-400 italic">Redirecting to dashboard...</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 flex items-center gap-3">
                                <AlertCircle size={20} />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {/* Event Selection */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Target Event</label>
                                    <div className="relative">
                                        <select
                                            name="event"
                                            value={formData.event}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors appearance-none"
                                            required
                                        >
                                            <option value="">Select an Event</option>
                                            {events.map(event => (
                                                <option key={event.id} value={event.id}>{event.title}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                    </div>
                                    {events.length === 0 && (
                                        <p className="mt-2 text-xs text-orange-600 font-medium">No events are currently accepting submissions.</p>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Submission Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter the full title of your paper"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>

                                {/* Submission Type */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Submission Type</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['oral', 'poster', 'display'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, submission_type: type }))}
                                                className={`p-3 rounded-lg border text-sm font-semibold capitalize transition-all ${formData.submission_type === type
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                                                    }`}
                                            >
                                                {type === 'display' ? 'Tech Display' : type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Keywords */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Keywords</label>
                                    <input
                                        type="text"
                                        name="keywords"
                                        value={formData.keywords}
                                        onChange={handleChange}
                                        placeholder="Cardiology, Genomes, AI (comma separated)"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>

                                {/* Co-authors */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Co-authors (Optional)</label>
                                    <textarea
                                        name="co_authors"
                                        value={formData.co_authors}
                                        onChange={handleChange}
                                        placeholder="List co-authors and their affiliations"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors h-24 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Abstract */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Abstract Narrative</label>
                                    <textarea
                                        name="abstract"
                                        value={formData.abstract}
                                        onChange={handleChange}
                                        placeholder="Briefly describe your research, methodology and results..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors h-48 resize-none"
                                        required
                                    />
                                </div>

                                {/* File Uploads */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Abstract File (Required)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                name="abstract_file"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center group-hover:border-blue-400 transition-colors">
                                                <Upload className="mx-auto text-gray-400 mb-2 group-hover:text-blue-500" size={24} />
                                                <p className="text-sm font-bold text-gray-700">
                                                    {files.abstract_file ? files.abstract_file.name : "Click to upload abstract"}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Full Paper (Optional)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                name="full_paper"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center group-hover:border-blue-400 transition-colors">
                                                <Upload className="mx-auto text-gray-400 mb-2 group-hover:text-blue-500" size={24} />
                                                <p className="text-sm font-bold text-gray-700">
                                                    {files.full_paper ? files.full_paper.name : "Click to upload full paper"}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">If available at this stage</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || events.length === 0}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Uploading Submission...
                                        </>
                                    ) : (
                                        <>
                                            Submit Paper
                                            <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </AuthorSidebar>
    );
};

export default NewSubmission;
