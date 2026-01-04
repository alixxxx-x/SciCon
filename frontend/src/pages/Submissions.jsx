import React, { useState, useEffect } from 'react';
import api from '../api';
import { FileText, Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            // Using my-submissions endpoint as it is safe for all logged-in users
            const response = await api.get('/api/submissions/my-submissions/');
            setSubmissions(response.data);
        } catch (err) {
            console.error("Error fetching submissions:", err);
            setError("Failed to load submissions.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'accepted': return { color: 'text-green-400 border-green-500/20 bg-green-500/10', icon: CheckCircle };
            case 'rejected': return { color: 'text-red-400 border-red-500/20 bg-red-500/10', icon: XCircle };
            case 'pending': return { color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10', icon: Clock };
            case 'under_review': return { color: 'text-blue-400 border-blue-500/20 bg-blue-500/10', icon: FileText };
            case 'revision_requested': return { color: 'text-orange-400 border-orange-500/20 bg-orange-500/10', icon: AlertCircle };
            default: return { color: 'text-gray-400 border-gray-500/20 bg-gray-500/10', icon: FileText };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-10 pb-20">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black mb-2">My Submissions</h1>
                        <p className="text-gray-400">Track the status of your scientific papers</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl mb-8 text-center font-bold">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {Array.isArray(submissions) && submissions.map((submission) => {
                        const statusConfig = getStatusConfig(submission.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div key={submission.id} className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${statusConfig.color}`}>
                                                <StatusIcon size={12} />
                                                {submission.status?.replace('_', ' ')}
                                            </span>
                                            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                {submission.submission_type}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2">{submission.title}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{submission.abstract}</p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                                            </span>
                                            {/* We could add more specific info here if available in serializer */}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold border border-white/10 transition-colors">
                                            View Details
                                        </button>
                                        {/* Add specific actions based on status later */}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!loading && submissions.length === 0 && !error && (
                    <div className="text-center py-20 border border-white/5 rounded-3xl border-dashed bg-[#111111]/50">
                        <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-500">No submissions yet</h3>
                        <p className="text-gray-600 mb-6">You haven't submitted any papers to events yet.</p>
                        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all">
                            Browse Events to Submit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Submissions;
