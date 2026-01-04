import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import api from '../api';
import OrganizerSidebar from '../components/layout/OrganizerSidebar';

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/dashboard-organizer')} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Submissions</h1>
                    <p className="text-gray-400">Managing submissions for: <span className="text-blue-400">{eventTitle}</span></p>
                </div>
            </div>

            <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-800">
                                <th className="py-3 px-4 font-medium">Title</th>
                                <th className="py-3 px-4 font-medium">Author</th>
                                <th className="py-3 px-4 font-medium">Date</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                                <th className="py-3 px-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading submissions...</td></tr>
                            ) : submissions.length > 0 ? (
                                submissions.map(sub => (
                                    <tr key={sub.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                        <td className="py-4 px-4 font-medium text-white">{sub.title}</td>
                                        <td className="py-4 px-4 text-gray-400">{sub.author_name || 'Unknown'}</td>
                                        <td className="py-4 px-4 text-gray-400">
                                            {new Date(sub.submitted_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(sub.status)}`}>
                                                {sub.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <FileText size={48} className="mb-4 opacity-20" />
                                        <p>No submissions received yet for this event.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </OrganizerSidebar>
    );
};

export default EventSubmissions;
