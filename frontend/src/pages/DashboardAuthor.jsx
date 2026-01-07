import React, { useState, useEffect } from 'react';
import {
    FileText,
    CheckCircle2,
    Clock,
    Plus,
    Calendar,
    ArrowRight,
    Award,
    ChevronRight,
    Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import AuthorSidebar from '../components/layout/AuthorSidebar';

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

const SubmissionItem = ({ submission }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'accepted': return { color: 'bg-green-100 text-green-700', label: 'Accepted' };
            case 'rejected': return { color: 'bg-red-100 text-red-700', label: 'Rejected' };
            case 'under_review': return { color: 'bg-blue-100 text-blue-700', label: 'Under Review' };
            case 'revision_requested': return { color: 'bg-yellow-100 text-yellow-700', label: 'Revision' };
            default: return { color: 'bg-gray-100 text-gray-700', label: status };
        }
    };

    const config = getStatusConfig(submission.status);

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <FileText size={20} />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{submission.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Submitted {new Date(submission.submitted_at).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
                    {config.label}
                </span>
                <Link to="/submissions" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <ChevronRight size={20} />
                </Link>
            </div>
        </div>
    );
};

const DashboardAuthor = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [dashRes, profileRes, certRes] = await Promise.all([
                    api.get('/api/dashboard/'),
                    api.get('/api/auth/profile/'),
                    api.get('/api/certificates/')
                ]);
                setData(dashRes.data);
                setUserInfo(profileRes.data);
                setCertificates(certRes.data || []);
            } catch (error) {
                console.error("Dashboard error:", error);
                if (error.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const submissions = data?.my_submissions || [];

    return (
        <AuthorSidebar userInfo={userInfo}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back, {userInfo?.username}!</h1>
                <p className="text-gray-500">Manage your scientific contributions and event participations.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="All Submissions"
                    value={submissions.length}
                    icon={FileText}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Under Review"
                    value={submissions.filter(s => s.status === 'under_review').length}
                    icon={Clock}
                    colorClass="bg-orange-50 text-orange-600"
                />
                <StatCard
                    title="Accepted"
                    value={submissions.filter(s => s.status === 'accepted').length}
                    icon={CheckCircle2}
                    colorClass="bg-green-50 text-green-600"
                />
                <StatCard
                    title="Certificates"
                    value={certificates.length}
                    icon={Award}
                    colorClass="bg-purple-50 text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Recent Submissions */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Recent Submissions</h3>
                            <Link to="/submissions" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {submissions.length > 0 ? (
                                submissions.slice(0, 5).map(sub => <SubmissionItem key={sub.id} submission={sub} />)
                            ) : (
                                <div className="p-10 text-center text-gray-500">
                                    <p className="mb-4">No submissions found.</p>
                                    <Link to="/submissions/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700">
                                        <Plus size={16} /> Submit Your First Paper
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions & Info */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link to="/submissions/new" className="flex items-center gap-3 w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                                <Plus size={18} /> New Submission
                            </Link>
                            <Link to="/profile" className="flex items-center gap-3 w-full p-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors">
                                <Award size={18} /> My Certificates
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Upcoming Events</h3>
                            <Link to="/events" className="text-xs font-bold text-blue-600 hover:underline">See More</Link>
                        </div>
                        <div className="space-y-4">
                            {data?.upcoming_events?.slice(0, 3).map(event => (
                                <Link key={event.id} to={`/events/${event.id}`} className="group block">
                                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-1">{event.title}</h4>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                        <Calendar size={12} />
                                        <span>{new Date(event.start_date).toLocaleDateString()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthorSidebar>
    );
};

export default DashboardAuthor;
