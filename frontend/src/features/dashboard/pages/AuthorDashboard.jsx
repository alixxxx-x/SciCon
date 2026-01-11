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
    PlusCircle,
    RefreshCw,
    TrendingUp,
    AlertCircle,
    MapPin
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import AuthorSidebar from '../../../components/layout/AuthorSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, icon: Icon, subtitle }) => (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">{value}</p>
                    <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                    <Icon size={20} />
                </div>
            </div>
        </CardContent>
    </Card>
);

const SubmissionItem = ({ submission }) => {
    const navigate = useNavigate();
    const getStatusConfig = (status) => {
        switch (status) {
            case 'accepted': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'Accepted' };
            case 'rejected': return { color: 'bg-red-50 text-red-700 border-red-100', label: 'Rejected' };
            case 'under_review': return { color: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Under Review' };
            case 'revision_requested': return { color: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Revision' };
            default: return { color: 'bg-slate-50 text-slate-700 border-slate-100', label: status?.replace('_', ' ') || 'Unknown' };
        }
    };

    const config = getStatusConfig(submission.status);

    return (
        <div
            className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0"
            onClick={() => navigate('/submissions')}
        >
            <div className="flex items-center gap-4">
                <div className="text-slate-400">
                    <FileText size={18} />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1 truncate max-w-md">
                        {submission.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Submitted {new Date(submission.submitted_at).toLocaleDateString()} • ID: #{submission.id}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <Badge variant="secondary" className={cn(
                    "text-[10px] font-medium px-2 py-0.5",
                    config.color
                )}>
                    {config.label}
                </Badge>
                <ChevronRight size={16} className="text-slate-300" />
            </div>
            {submission.session_details && (
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50 flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <Calendar size={12} className="text-blue-500" />
                        {submission.session_details.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <Clock size={12} className="text-orange-500" />
                        {submission.session_details.start_time ? submission.session_details.start_time.slice(0, 5) : '—'} - {submission.session_details.end_time ? submission.session_details.end_time.slice(0, 5) : '—'}
                    </div>
                    {submission.session_details.room && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            <MapPin size={12} className="text-red-500" />
                            Room: {submission.session_details.room}
                        </div>
                    )}
                </div>
            )}
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
                    api.get('/api/certificates/').catch(() => ({ data: [] }))
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
            <AuthorSidebar userInfo={userInfo}>
                <div className="flex h-[50vh] items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
                </div>
            </AuthorSidebar>
        );
    }

    const submissions = data?.my_submissions || [];

    return (
        <AuthorSidebar userInfo={userInfo}>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase mb-1">
                        Welcome, {userInfo?.first_name || userInfo?.username}
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage your scientific contributions and track review progress.
                    </p>
                </div>
                <Button onClick={() => navigate('/submissions/new')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-4 rounded-lg">
                    <PlusCircle className="mr-2" size={16} /> New Submission
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Submissions"
                    value={submissions.length}
                    icon={FileText}
                    subtitle="Scientific works"
                />
                <StatCard
                    title="Under Review"
                    value={submissions.filter(s => s.status === 'under_review').length}
                    icon={Clock}
                    subtitle="Active evaluations"
                />
                <StatCard
                    title="Accepted"
                    value={submissions.filter(s => s.status === 'accepted').length}
                    icon={CheckCircle2}
                    subtitle="Published materials"
                />
                <StatCard
                    title="Certificates"
                    value={certificates.length}
                    icon={Award}
                    subtitle="Earned accolades"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Submissions */}
                <div className="lg:col-span-8">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <CardTitle className="text-sm font-semibold">Submission Pipeline</CardTitle>
                                <CardDescription className="text-xs">Real-time status tracking</CardDescription>
                            </div>
                            <Button variant="link" onClick={() => navigate('/submissions')} className="text-xs h-auto p-0 text-blue-600">View Portfolio</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {submissions.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {submissions.slice(0, 5).map(sub => <SubmissionItem key={sub.id} submission={sub} />)}
                                </div>
                            ) : (
                                <div className="p-16 text-center">
                                    <FileText className="mx-auto text-slate-200 mb-4" size={40} />
                                    <p className="text-slate-500 text-sm">No submissions detected.</p>
                                    <Button onClick={() => navigate('/submissions/new')} variant="outline" className="mt-4 text-xs">Submit First Paper</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Actions & Events */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            <Button
                                onClick={() => navigate('/submissions/new')}
                                className="w-full text-xs h-10 border-slate-200 dark:border-slate-800"
                                variant="outline"
                            >
                                <PlusCircle size={14} className="mr-2" />
                                Initiate Submission
                            </Button>
                            <Button
                                onClick={() => navigate('/dashboard-participant?tab=certificates')}
                                variant="outline"
                                className="w-full text-xs h-10 border-slate-200 dark:border-slate-800"
                            >
                                <Award size={14} className="mr-2 text-orange-500" />
                                Export Certificates
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-sm font-semibold">Events Hub</CardTitle>
                            <Link to="/events" className="text-xs text-blue-600 hover:underline">See More</Link>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {data?.upcoming_events?.slice(0, 3).map(event => (
                                    <Link key={event.id} to={`/events/${event.id}`} className="block group">
                                        <h4 className="text-xs font-medium text-slate-900 dark:text-white group-hover:text-blue-600 truncate">{event.title}</h4>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{new Date(event.start_date).toLocaleDateString()}</p>
                                    </Link>
                                )) || (
                                        <p className="text-xs text-slate-400 text-center py-2">No events scheduled</p>
                                    )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2 text-amber-600">
                            <AlertCircle size={16} />
                            <h4 className="text-xs font-semibold uppercase">Submission Tip</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed uppercase">
                            Ensure your PDF is anonymized before submission to facilitate a fair double-blind peer review process.
                        </p>
                    </div>
                </div>
            </div>
        </AuthorSidebar>
    );
};

export default DashboardAuthor;
