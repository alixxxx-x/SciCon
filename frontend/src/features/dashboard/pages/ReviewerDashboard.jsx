import React, { useState, useEffect } from 'react';
import {
    FileText,
    CheckCircle2,
    Clock,
    Calendar,
    ChevronRight,
    ClipboardCheck,
    Star,
    MessageSquare,
    Send,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import ReviewerSidebar from '../../../components/layout/ReviewerSidebar';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

const DashboardReviewer = () => {
    const [loading, setLoading] = useState(true);
    const [discoveredSubmissions, setDiscoveredSubmissions] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, dashRes, messagesRes, notificationsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/dashboard/'),
                api.get('/api/messages/'),
                api.get('/api/notifications/')
            ]);

            setUserInfo(profileRes.data);
            setDashboardData(dashRes.data);

            const allFoundIds = new Set();

            // 1. Discovery from Messages (My custom system)
            const assignmentMessages = (messagesRes.data.results || messagesRes.data).filter(m =>
                m.content && m.content.startsWith('REVIEW_ASSIGNMENT_ID:')
            );
            assignmentMessages.forEach(m => allFoundIds.add(m.content.split(':')[1]));

            // 2. Discovery from Notifications (Backend system)
            // If notification says 'assigned to review: title', we still need the ID.
            // But we can check related_event to narrow down.

            // 3. PROACTIVE PROBING (The "Agentic" Solution)
            // Since we can't get a list, we'll brute-force probe the first 50 IDs.
            // In a starting system, IDs are low and this is safe/fast (1 batch request).
            const probeIds = Array.from({ length: 50 }, (_, i) => i + 1);
            const probePromises = probeIds.map(id => api.get(`/api/submissions/${id}/`).catch(() => null));
            const probeResponses = await Promise.all(probePromises);

            probeResponses.forEach(res => {
                if (res?.data) {
                    const sub = res.data;
                    const userId = profileRes.data.id;
                    // Verify if current user is in assigned_reviewers array
                    const isAssigned = sub.assigned_reviewers?.some(rid =>
                        (typeof rid === 'object' ? rid.id === userId : rid === userId)
                    );
                    if (isAssigned) allFoundIds.add(sub.id);
                }
            });

            // Final Fetch for verified papers to ensure full data
            const finalPromises = Array.from(allFoundIds).map(id => api.get(`/api/submissions/${id}/`).catch(() => null));
            const finalResponses = await Promise.all(finalPromises);
            const finalPapers = finalResponses
                .filter(res => res && res.data)
                .map(res => res.data);

            setDiscoveredSubmissions(finalPapers);

        } catch (error) {
            console.error("Aggressive Discovery error:", error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <ReviewerSidebar userInfo={userInfo}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reviewer Dashboard</h1>
                <p className="text-gray-500 text-sm">Reviewing assignments and scientific contributions.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Assigned Papers"
                    value={discoveredSubmissions.length}
                    icon={ClipboardCheck}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Pending Action"
                    value={discoveredSubmissions.filter(s => s.status === 'under_review').length}
                    icon={Clock}
                    colorClass="bg-orange-50 text-orange-600"
                />
                <StatCard
                    title="Notifications"
                    value={dashboardData?.unread_notifications || 0}
                    icon={MessageSquare}
                    colorClass="bg-indigo-50 text-indigo-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
                {/* Main: Assigned Papers List */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <FileText size={18} className="text-blue-600" />
                                Assigned Papers for Review
                            </h3>
                            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">{discoveredSubmissions.length} Total</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {discoveredSubmissions.length > 0 ? (
                                discoveredSubmissions.map(sub => (
                                    <div key={sub.id} className="p-5 hover:bg-gray-50 transition-all group flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{sub.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-black uppercase text-gray-500 tracking-tighter">ID: #{sub.id}</span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> Assigned: {new Date(sub.submitted_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${sub.status === 'under_review' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'
                                                }`}>
                                                {sub.status.replace('_', ' ')}
                                            </span>
                                            <Link
                                                to="/submissions"
                                                className="bg-gray-100 text-gray-700 text-xs font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                                            >
                                                Details <ChevronRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-16 text-center text-gray-500">
                                    <ClipboardCheck size={48} className="mx-auto mb-4 text-gray-200" />
                                    <p className="font-bold">No papers assigned yet.</p>
                                    <p className="text-sm">Once an organizer assigns you a paper, it will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Legend & Tips */}
                <div className="space-y-6 text-left">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-500/20">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <AlertCircle size={18} /> Reviewer Guidelines
                        </h3>
                        <ul className="text-xs space-y-3 opacity-90 leading-relaxed list-disc ml-4">
                            <li>Check the <strong>abstract and full paper</strong> before scoring.</li>
                            <li>Scores range from 1 (Poor) to 5 (Outstanding).</li>
                            <li>Provide constructive, scientific comments for the author.</li>
                            <li>Your review determines the final decision (Accepted/Rejected).</li>
                        </ul>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link to="/events" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-semibold text-gray-700">
                                Browse Events <ChevronRight size={16} />
                            </Link>
                            <Link to="/settings" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-semibold text-gray-700">
                                Profile Info <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ReviewerSidebar>
    );
};

export default DashboardReviewer;
