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
    AlertCircle,
    RefreshCw,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import ReviewerSidebar from '../../../components/layout/ReviewerSidebar';
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

const PaperItem = ({ paper }) => {
    const navigate = useNavigate();
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
                        {paper.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Assigned {new Date(paper.submitted_at).toLocaleDateString()} • ID: #{paper.id}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <Badge variant="secondary" className={cn(
                    "text-[10px] font-medium px-2 py-0.5",
                    paper.status === 'under_review' ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                )}>
                    {paper.status.replace('_', ' ')}
                </Badge>
                <ChevronRight size={16} className="text-slate-300" />
            </div>
        </div>
    );
};

const DashboardReviewer = () => {
    const [loading, setLoading] = useState(true);
    const [discoveredSubmissions, setDiscoveredSubmissions] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, dashRes, messagesRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/dashboard/'),
                api.get('/api/messages/')
            ]);

            setUserInfo(profileRes.data);
            setDashboardData(dashRes.data);

            const allFoundIds = new Set();
            const assignmentMessages = (messagesRes.data.results || messagesRes.data).filter(m =>
                m.content && m.content.startsWith('REVIEW_ASSIGNMENT_ID:')
            );
            assignmentMessages.forEach(m => allFoundIds.add(m.content.split(':')[1]));

            // Proactive probing for assignments
            const probeIds = Array.from({ length: 30 }, (_, i) => i + 1);
            const probePromises = probeIds.map(id => api.get(`/api/submissions/${id}/`).catch(() => null));
            const probeResponses = await Promise.all(probePromises);

            probeResponses.forEach(res => {
                if (res?.data) {
                    const sub = res.data;
                    const userId = profileRes.data.id;
                    const isAssigned = sub.assigned_reviewers?.some(rid =>
                        (typeof rid === 'object' ? rid.id === userId : rid === userId)
                    );
                    if (isAssigned) allFoundIds.add(sub.id);
                }
            });

            const finalPromises = Array.from(allFoundIds).map(id => api.get(`/api/submissions/${id}/`).catch(() => null));
            const finalResponses = await Promise.all(finalPromises);
            const finalPapers = finalResponses
                .filter(res => res && res.data)
                .map(res => res.data);

            setDiscoveredSubmissions(finalPapers);

        } catch (error) {
            console.error("Discovery error:", error);
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
            <ReviewerSidebar userInfo={userInfo}>
                <div className="flex h-[50vh] items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
                </div>
            </ReviewerSidebar>
        );
    }

    return (
        <ReviewerSidebar userInfo={userInfo}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase mb-1">
                    Welcome, {userInfo?.first_name || userInfo?.username}
                </h1>
                <p className="text-sm text-slate-500">
                    Audit scientific contributions and provide subject matter expertise.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Assignments"
                    value={discoveredSubmissions.length}
                    icon={ClipboardCheck}
                    subtitle="Scientific works"
                />
                <StatCard
                    title="Action Required"
                    value={discoveredSubmissions.filter(s => s.status === 'under_review').length}
                    icon={Clock}
                    subtitle="Reviews in progress"
                />
                <StatCard
                    title="Alerts"
                    value={dashboardData?.unread_notifications || 0}
                    icon={MessageSquare}
                    subtitle="New notifications"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main: Assigned Papers List */}
                <div className="lg:col-span-8">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <CardTitle className="text-sm font-semibold">Active Assignments</CardTitle>
                                <CardDescription className="text-xs">Pending peer review evaluations</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5">
                                {discoveredSubmissions.length} Papers
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            {discoveredSubmissions.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {discoveredSubmissions.map(sub => (
                                        <PaperItem key={sub.id} paper={sub} />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-16 text-center">
                                    <ClipboardCheck className="mx-auto text-slate-200 mb-4" size={40} />
                                    <p className="text-slate-400 text-sm">No pending assignments found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Guidelines & Links */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                            <AlertCircle size={16} />
                            <h4 className="text-xs font-semibold uppercase">Reviewer Protocol</h4>
                        </div>
                        <ul className="text-xs space-y-3 text-slate-500 uppercase leading-relaxed">
                            <li className="flex gap-2">
                                <span className="text-blue-400">•</span> Check abstract and full paper before scoring.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-400">•</span> Scores range from 1 (Poor) to 5 (Outstanding).
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-400">•</span> Provide constructive, scientific comments.
                            </li>
                        </ul>
                    </div>

                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-sm font-semibold">Expert Access</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            <Button
                                onClick={() => navigate('/events')}
                                variant="outline"
                                className="w-full text-xs h-10 border-slate-200 dark:border-slate-800 justify-between px-4"
                            >
                                <span>Browse Registry</span>
                                <ArrowRight size={14} />
                            </Button>
                            <Button
                                onClick={() => navigate('/settings')}
                                variant="outline"
                                className="w-full text-xs h-10 border-slate-200 dark:border-slate-800 justify-between px-4"
                            >
                                <span>Expert Profile</span>
                                <ArrowRight size={14} />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ReviewerSidebar>
    );
};

export default DashboardReviewer;
