import React, { useState, useEffect } from 'react';
import api from '../api';
import { FileText, Calendar, CheckCircle, Clock, AlertCircle, ChevronRight, Loader2, Star, Send } from 'lucide-react';
import AuthorSidebar from '../components/layout/AuthorSidebar';
import ReviewerSidebar from '../components/layout/ReviewerSidebar';
import { useNavigate } from 'react-router-dom';

const ReviewModal = ({ submission, onClose, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        relevance_score: 5,
        quality_score: 5,
        originality_score: 5,
        comments: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post(`/api/submissions/${submission.id}/reviews/`, formData);
            onSubmitSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || "Failed to submit review.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">Review: {submission.title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                        {['relevance', 'quality', 'originality'].map(field => (
                            <div key={field}>
                                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">{field}</label>
                                <select 
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                                    value={formData[`${field}_score`]}
                                    onChange={(e) => setFormData({...formData, [`${field}_score`]: parseInt(e.target.value)})}
                                >
                                    {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2">Comments (Mandatory)</label>
                        <textarea 
                            rows="4"
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 ring-blue-500/20 outline-none"
                            placeholder="Provide your scientific feedback here..."
                            value={formData.comments}
                            onChange={(e) => setFormData({...formData, comments: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18}/> : <><Send size={18}/> Submit Scientific Review</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [eventsMap, setEventsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [activeSubmission, setActiveSubmission] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, eventsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/events/')
            ]);
            
            const user = profileRes.data;
            setUserInfo(user);
            
            const eventsData = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data.results || []);
            const map = eventsData.reduce((acc, evt) => ({ ...acc, [evt.id]: evt.title }), {});
            setEventsMap(map);

            let finalSubmissions = [];

            if (user.role === 'reviewer') {
                // AGGRESSIVE DISCOVERY FOR REVIEWERS
                const allFoundIds = new Set();
                
                // 1. Scan Messages
                const messagesRes = await api.get('/api/messages/');
                const msgs = messagesRes.data.results || messagesRes.data;
                msgs.filter(m => m.content && m.content.startsWith('REVIEW_ASSIGNMENT_ID:'))
                    .forEach(m => allFoundIds.add(m.content.split(':')[1]));

                // 2. Proactive Probing (1-50)
                const probeIds = Array.from({ length: 50 }, (_, i) => i + 1);
                const probeResponses = await Promise.all(probeIds.map(id => api.get(`/api/submissions/${id}/`).catch(() => null)));
                
                probeResponses.forEach(res => {
                    if (res?.data) {
                        const sub = res.data;
                        const isAssigned = sub.assigned_reviewers?.some(rid => 
                            (typeof rid === 'object' ? rid.id === user.id : rid === user.id)
                        );
                        if (isAssigned) allFoundIds.add(sub.id);
                    }
                });

                // Fetch full data for discovered IDs
                const fetchDetails = await Promise.all(Array.from(allFoundIds).map(id => api.get(`/api/submissions/${id}/`).catch(() => null)));
                finalSubmissions = fetchDetails.filter(res => res && res.data).map(res => res.data);
            } else {
                // Standard fetch for Authors
                const submissionsRes = await api.get('/api/submissions/my-submissions/');
                finalSubmissions = Array.isArray(submissionsRes.data) ? submissionsRes.data : (submissionsRes.data.results || []);
            }

            setSubmissions(finalSubmissions);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load records.");
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
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    const SidebarWrapper = userInfo?.role === 'reviewer' ? ReviewerSidebar : AuthorSidebar;
    const pageTitle = userInfo?.role === 'reviewer' ? "Assigned Reviews" : "My Submissions";
    const pageDesc = userInfo?.role === 'reviewer' ? "Papers assigned to you for scientific evaluation." : "Track and manage your scientific contributions.";

    return (
        <SidebarWrapper userInfo={userInfo}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
                <p className="text-gray-500">{pageDesc}</p>
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
                            <th className="py-4 px-6">Paper Details</th>
                            <th className="py-4 px-6">Event</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-center">Type</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {submissions.length > 0 ? (
                            submissions.map((submission) => (
                                <tr key={submission.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-5 px-6">
                                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{submission.title}</div>
                                        <div className="text-xs text-blue-600 font-semibold mt-1">ID: #{submission.id} {userInfo?.role === 'reviewer' && `| Author: ${submission.author?.username}`}</div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="text-sm font-medium text-gray-700 max-w-[200px] truncate">
                                            {eventsMap[submission.event] || <span className="text-gray-400 italic">Unknown Event</span>}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(submission.status)}`}>
                                            {submission.status?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter">
                                            {submission.submission_type}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                         {userInfo?.role === 'reviewer' ? (
                                             <button
                                                 onClick={() => setActiveSubmission(submission)}
                                                 className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 ml-auto"
                                             >
                                                 <Star size={14}/> {submission.status === 'under_review' ? 'Start Review' : 'Update Review'}
                                             </button>
                                         ) : (
                                             <button
                                                 onClick={() => navigate(`/submissions/new`)}
                                                 className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-100 rounded-lg transition-all ml-auto block"
                                             >
                                                 <ChevronRight size={18} />
                                             </button>
                                         )}
                                     </td>
                                 </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium">No records found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {activeSubmission && (
                <ReviewModal 
                    submission={activeSubmission} 
                    onClose={() => setActiveSubmission(null)}
                    onSubmitSuccess={() => {
                        fetchData();
                    }}
                />
            )}
        </SidebarWrapper>
    );
};

export default Submissions;
