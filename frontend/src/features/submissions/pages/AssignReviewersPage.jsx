import React, { useState, useEffect } from 'react';
import {
    UserCheck,
    Search,
    Filter,
    ChevronRight,
    Users as UsersIcon,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';

const AssignReviewers = () => {
    const [submissions, setSubmissions] = useState([]);
    const [reviewers, setReviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [manualId, setManualId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, myEventsRes, allEventsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/events/my-events/'),
                api.get('/api/events/').catch(() => ({ data: [] }))
            ]);

            setUserInfo(profileRes.data);
            const myEvents = Array.isArray(myEventsRes.data) ? myEventsRes.data : (myEventsRes.data.results || []);
            const allPublicEvents = Array.isArray(allEventsRes.data) ? allEventsRes.data : (allEventsRes.data.results || []);

            // 1. Fetch data for organizer's events
            const subPromises = myEvents.map(event => api.get(`/api/events/${event.id}/submissions/`));
            const subsResponses = await Promise.all(subPromises);
            const allSubmissions = subsResponses.flatMap(res => {
                const data = res.data;
                return Array.isArray(data) ? data : (data.results || []);
            });
            setSubmissions(allSubmissions);

            // 2. PRIMARY REVIEWER FETCHING (Now possible thanks to UserListView permission update)
            const allReviewersMap = {};

            try {
                const usersRes = await api.get('/api/users/');
                const globalUsers = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data.results || []);

                // Direct filter for reviewers - this is the most reliable source now
                globalUsers.forEach(u => {
                    if (u.role === 'reviewer') {
                        allReviewersMap[u.id] = u;
                    }
                });
                console.log(`Discovered ${Object.keys(allReviewersMap).length} reviewers from global list.`);
            } catch (e) {
                console.warn("Global listing access issue, falling back to association discovery.");
            }

            // B. PROACTIVE ORPHAN POLLING
            const detailPromises = allPublicEvents.map(event => api.get(`/api/events/${event.id}/`).catch(() => null));
            const registrationPromises = allPublicEvents.map(event => api.get(`/api/events/${event.id}/registrations/`).catch(() => null));
            const publicSubPromises = allPublicEvents.map(event => api.get(`/api/events/${event.id}/submissions/`).catch(() => null));

            const [detailsRes, regsRes, pubSubsRes] = await Promise.all([
                Promise.all(detailPromises),
                Promise.all(registrationPromises),
                Promise.all(publicSubPromises)
            ]);

            // Combine all user objects found in any public record
            [...detailsRes, ...regsRes, ...pubSubsRes].forEach(res => {
                if (!res?.data) return;
                const data = res.data;

                if (data.scientific_committee) {
                    data.scientific_committee.forEach(u => { if (u.role === 'reviewer') allReviewersMap[u.id] = u; });
                }

                const list = Array.isArray(data) ? data : (data.results || []);
                list.forEach(item => {
                    const user = item.user || item.author;
                    if (user?.role === 'reviewer') allReviewersMap[user.id] = user;
                });
            });

            if (Object.keys(allReviewersMap).length === 0) {
                console.warn("No reviewers discovered via events.");
            }

            setReviewers(Object.values(allReviewersMap));

        } catch (err) {
            console.error("Discovery error:", err);
            setError("Failed to complete discovery. Some reviewers might not appear.");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedSubmission) {
            setError("Please select a submission.");
            return;
        }

        const idsToAssign = [...selectedReviewers];
        if (manualId) idsToAssign.push(parseInt(manualId));

        if (idsToAssign.length === 0) {
            setError("Please select/enter at least one reviewer ID.");
            return;
        }

        setProcessing(true);
        setError(null);
        try {
            await api.post(`/api/submissions/${selectedSubmission.id}/assign-reviewers/`, {
                reviewer_ids: idsToAssign
            });

            // CRITICAL LINK: Send discovery messages to reviewers since backend dashboard doesn't list assigned papers
            const messagePromises = idsToAssign.map(rid =>
                api.post('/api/messages/', {
                    recipient: rid,
                    content: `REVIEW_ASSIGNMENT_ID:${selectedSubmission.id}`,
                    related_event: selectedSubmission.event
                }).catch(() => null) // Ignore message failures
            );
            await Promise.all(messagePromises);

            setSuccess(`Assignments finalized for "${selectedSubmission.title}" and reviewers notified via dashboard.`);
            setSelectedSubmission(null);
            setSelectedReviewers([]);
            setManualId('');
            fetchData();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to finalize assignments.");
        } finally {
            setProcessing(false);
        }
    };

    const toggleReviewerSelection = (reviewerId) => {
        setSelectedReviewers(prev =>
            prev.includes(reviewerId)
                ? prev.filter(id => id !== reviewerId)
                : [...prev, reviewerId]
        );
    };

    const filteredSubmissions = submissions.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.keywords && s.keywords.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <OrganizerSidebar userInfo={userInfo}>
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            </OrganizerSidebar>
        );
    }

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assign Reviewers</h1>
                <p className="text-gray-500 dark:text-gray-400">Pair scientific submissions with qualified committee members.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-3 animate-pulse">
                    <CheckCircle2 size={20} />
                    <span className="font-medium">{success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Submissions List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-right">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <FileText size={18} className="text-blue-600" />
                                Submissions
                            </h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search papers..."
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                    <tr>
                                        <th className="py-4 px-6">Paper Details</th>
                                        <th className="py-4 px-6 text-center">Status</th>
                                        <th className="py-4 px-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredSubmissions.length > 0 ? (
                                        filteredSubmissions.map(sub => (
                                            <tr
                                                key={sub.id}
                                                className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedSubmission?.id === sub.id ? 'bg-blue-50/50' : ''}`}
                                                onClick={() => setSelectedSubmission(sub)}
                                            >
                                                <td className="py-5 px-6">
                                                    <div className="font-bold text-gray-900">{sub.title}</div>
                                                    <div className="text-xs text-gray-500 mt-1">Type: {sub.submission_type} | Author: {sub.author?.username}</div>
                                                </td>
                                                <td className="py-5 px-6 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sub.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                        sub.status === 'under_review' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-green-50 text-green-700 border-green-100'
                                                        }`}>
                                                        {sub.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <div className={`p-2 rounded-lg transition-all ${selectedSubmission?.id === sub.id ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
                                                        <ChevronRight size={18} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="py-12 text-center text-gray-500">No submissions found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right: Reviewers & Finalization */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <UsersIcon size={18} className="text-indigo-600" />
                                Available Reviewers
                            </h3>
                        </div>
                        <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                            {reviewers.length > 0 ? (
                                reviewers.map(reviewer => (
                                    <div
                                        key={reviewer.id}
                                        onClick={() => toggleReviewerSelection(reviewer.id)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${selectedReviewers.includes(reviewer.id)
                                            ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                                            : 'border-gray-100 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                {reviewer.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{reviewer.username}</p>
                                                <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{reviewer.institution || 'No Institution'}</p>
                                            </div>
                                        </div>
                                        {selectedReviewers.includes(reviewer.id) && (
                                            <CheckCircle2 size={16} className="text-indigo-600" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-8 text-gray-400 text-sm">No reviewers found in the system.</p>
                            )}
                        </div>
                    </div>

                    {/* Manual ID Addition */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Quick Add by User ID</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Enter ID (e.g. 5)"
                                className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none focus:ring-2 ring-indigo-500/20"
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value)}
                            />
                            <div className="bg-indigo-600 text-white p-2 rounded-lg">
                                <UserCheck size={16} />
                            </div>
                        </div>
                        <p className="text-[9px] text-indigo-400 mt-2 leading-tight">Use this if a newly created reviewer doesn't appear in the discovery list yet.</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-right">
                        <div className="mb-4 text-left">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Assignment Summary</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Selected Paper:</span>
                                    <span className="font-bold text-gray-900 truncate max-w-[150px]">{selectedSubmission?.title || 'None'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Selected Reviewers:</span>
                                    <span className="font-bold text-gray-900">{selectedReviewers.length + (manualId ? 1 : 0)}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleAssign}
                            disabled={!selectedSubmission || (selectedReviewers.length === 0 && !manualId) || processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <UserCheck size={20} />
                            )}
                            Finalize Assignment
                        </button>
                    </div>
                </div>
            </div>
        </OrganizerSidebar>
    );
};

export default AssignReviewers;
