import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, Clock, ArrowLeft, Loader2, ChevronRight, Search, Filter } from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';

const EventSubmissions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventTitle, setEventTitle] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, eventRes, submissionsRes] = await Promise.all([
                    api.get('/api/auth/profile/'),
                    api.get(`/api/events/${id}/`),
                    api.get(`/api/events/${id}/submissions/`)
                ]);
                setUserInfo(profileRes.data);
                setEventTitle(eventRes.data.title);
                setSubmissions(submissionsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-50 text-green-700 border-green-100';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-8">
                <button
                    onClick={() => navigate('/dashboard-organizer')}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 text-sm font-semibold"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Event Submissions</h1>
                <p className="text-gray-500">Reviewing papers for: <span className="text-blue-600 font-bold">{eventTitle}</span></p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-right">
                <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 font-bold text-sm bg-white border border-gray-100 rounded-lg hover:bg-gray-50">
                        <Filter size={18} /> Status Filter
                    </button>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                        <tr>
                            <th className="py-4 px-6">Submission Title</th>
                            <th className="py-4 px-6">Submitted By</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6">Date</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {submissions.length > 0 ? (
                            submissions.map(sub => (
                                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-5 px-6">
                                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{sub.title}</div>
                                        <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">ID: #{sub.id}</div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="text-sm font-bold text-gray-700">{sub.author_name || 'Anonymous Author'}</div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(sub.status)}`}>
                                            {sub.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-sm text-gray-400">
                                        {new Date(sub.submitted_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <button className="bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all shadow-sm">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-24 text-center">
                                    <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium">No submissions found for this event yet.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </OrganizerSidebar>
    );
};

export default EventSubmissions;
