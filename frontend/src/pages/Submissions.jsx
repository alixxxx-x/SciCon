import React, { useState, useEffect } from 'react';
import api from '../api';
import { FileText, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Search, ChevronRight } from 'lucide-react';
import AuthorSidebar from '../components/layout/AuthorSidebar';
import { useNavigate } from 'react-router-dom';

const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const [profileRes, submissionsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/submissions/my-submissions/')
            ]);
            setUserInfo(profileRes.data);
            setSubmissions(submissionsRes.data);
        } catch (err) {
            console.error("Error fetching submissions:", err);
            setError("Failed to load your submissions.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-50 text-green-700 border-green-100';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'under_review': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'revision_requested': return 'bg-orange-50 text-orange-700 border-orange-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <AuthorSidebar userInfo={userInfo}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
                <p className="text-gray-500">Track and manage your scientific contributions.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-right">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                        <tr>
                            <th className="py-4 px-6">Submission Title</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-center">Type</th>
                            <th className="py-4 px-6">Submitted Date</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {submissions.length > 0 ? (
                            submissions.map((submission) => (
                                <tr key={submission.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-5 px-6">
                                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{submission.title}</div>
                                        <div className="text-xs text-blue-5100 font-semibold mt-1">Paper ID: #{submission.id}</div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(submission.status)}`}>
                                            {submission.status?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter">
                                            {submission.submission_type}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-sm text-gray-500">
                                        {new Date(submission.submitted_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <button
                                            onClick={() => navigate(`/submissions/new`)} // Or details if we had details page
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-100 rounded-lg transition-all"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium">You haven't submitted any papers yet.</p>
                                    <button
                                        onClick={() => navigate('/events')}
                                        className="mt-4 text-blue-600 font-bold hover:underline"
                                    >
                                        Find an event to submit
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AuthorSidebar>
    );
};

export default Submissions;
