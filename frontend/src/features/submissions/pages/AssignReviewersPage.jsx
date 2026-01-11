import React, { useState, useEffect } from 'react';
import {
    Search,
    ChevronRight,
    Users as UsersIcon,
    FileText,
    RefreshCw,
    Check,
    Shield,
    Zap,
    ArrowLeft,
    Filter
} from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const AssignReviewers = () => {
    const { toast } = useToast();
    const [submissions, setSubmissions] = useState([]);
    const [reviewers, setReviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [manualId, setManualId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, myEventsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/events/my-events/'),
            ]);

            setUserInfo(profileRes.data);
            const myEvents = Array.isArray(myEventsRes.data) ? myEventsRes.data : (myEventsRes.data.results || []);

            const subPromises = myEvents.map(event => api.get(`/api/events/${event.id}/submissions/`).catch(() => ({ data: [] })));
            const subsResponses = await Promise.all(subPromises);
            const allSubmissions = subsResponses.flatMap(res => {
                const data = res.data;
                return Array.isArray(data) ? data : (data.results || []);
            });
            setSubmissions(allSubmissions);

            try {
                const usersRes = await api.get('/api/users/');
                const globalUsers = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data.results || []);
                setReviewers(globalUsers.filter(u => u.role === 'reviewer'));
            } catch (e) {
                console.error("Error fetching reviewers:", e);
            }

        } catch (err) {
            console.error("Discovery error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedSubmission) {
            toast({
                variant: "destructive",
                title: "Selection missing",
                description: "Please select a submission to assign reviewers.",
            });
            return;
        }

        const idsToAssign = [...selectedReviewers];
        if (manualId) idsToAssign.push(parseInt(manualId));

        if (idsToAssign.length === 0) {
            toast({
                variant: "destructive",
                title: "No reviewers selected",
                description: "Choose at least one reviewer or enter an ID.",
            });
            return;
        }

        setProcessing(true);
        try {
            await api.post(`/api/submissions/${selectedSubmission.id}/assign-reviewers/`, {
                reviewer_ids: idsToAssign
            });

            toast({
                title: "Success",
                description: `Reviewers assigned to "${selectedSubmission.title}".`,
            });

            setSelectedSubmission(null);
            setSelectedReviewers([]);
            setManualId('');
            fetchData();
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.response?.data?.error || "Assignment failed.",
            });
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

    const filteredSubmissions = submissions.filter(sub =>
        sub.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <OrganizerSidebar userInfo={userInfo}>
                <div className="flex h-[50vh] items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
                </div>
            </OrganizerSidebar>
        );
    }

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-1 leading-tight">Assign Reviewers</h1>
                <p className="text-sm text-slate-500">Designate experts to review incoming scientific submissions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Submissions List */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="py-4 px-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    Submissions
                                    <Badge variant="secondary" className="bg-slate-200 text-slate-700 text-[10px] px-1.5 h-4 border-none">
                                        {submissions.length}
                                    </Badge>
                                </CardTitle>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search titles..."
                                        className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-slate-400 transition-all placeholder:text-slate-400 shadow-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/30 border-b border-slate-100">
                                    <tr>
                                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">Title & Author</th>
                                        <th className="py-3 px-6 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="py-3 px-6 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredSubmissions.length > 0 ? (
                                        filteredSubmissions.map(sub => (
                                            <tr
                                                key={sub.id}
                                                className={cn("group cursor-pointer transition-colors",
                                                    selectedSubmission?.id === sub.id ? 'bg-blue-50/50' : 'hover:bg-slate-50/30'
                                                )}
                                                onClick={() => setSelectedSubmission(sub)}
                                            >
                                                <td className="py-4 px-6">
                                                    <div className={cn("text-sm font-semibold mb-0.5",
                                                        selectedSubmission?.id === sub.id ? 'text-blue-700' : 'text-slate-900'
                                                    )}>
                                                        {sub.title}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 font-medium">
                                                        By {sub.author_name || 'Anonymous'} • ID: {sub.id}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <Badge variant="outline" className={cn("text-[9px] font-semibold px-2 py-0.5 uppercase border-none",
                                                        sub.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    )}>
                                                        {sub.status?.replace('_', ' ') || 'PENDING'}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className={cn("p-1 rounded-md transition-all",
                                                        selectedSubmission?.id === sub.id ? 'bg-blue-100 text-blue-700 rotate-90' : 'text-slate-300'
                                                    )}>
                                                        <ChevronRight size={16} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="py-16 text-center">
                                                <p className="text-slate-400 text-sm">No submissions found.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Reviewers Sidebar */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[500px]">
                        <CardHeader className="py-4 px-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                            <CardTitle className="text-sm font-semibold">Available Reviewers</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 overflow-y-auto space-y-1 flex-1">
                            {reviewers.length > 0 ? (
                                reviewers.map(reviewer => (
                                    <div
                                        key={reviewer.id}
                                        onClick={() => toggleReviewerSelection(reviewer.id)}
                                        className={cn("p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between group",
                                            selectedReviewers.includes(reviewer.id) ? 'border-blue-200 bg-blue-50/50 shadow-sm' : 'border-transparent hover:bg-slate-50'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm",
                                                selectedReviewers.includes(reviewer.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                                            )}>
                                                {reviewer.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className={cn("text-sm font-semibold",
                                                    selectedReviewers.includes(reviewer.id) ? 'text-blue-700' : 'text-slate-900'
                                                )}>
                                                    {reviewer.username}
                                                </p>
                                                <p className="text-[10px] text-slate-500">ID: {reviewer.id}</p>
                                            </div>
                                        </div>
                                        {selectedReviewers.includes(reviewer.id) && (
                                            <div className="text-blue-600">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="py-8 text-center text-slate-400 text-xs">No reviewers available.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm p-5 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Manual Reviewer ID</label>
                            <input
                                type="number"
                                placeholder="Enter ID..."
                                className="w-full bg-white border border-slate-200 rounded-md h-9 px-3 text-sm outline-none focus:border-slate-400 transition-all"
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={handleAssign}
                            disabled={processing}
                            className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <RefreshCw className="animate-spin" size={16} />
                            ) : (
                                <>
                                    <Zap size={16} fill="currentColor" />
                                    <span>Assign Panel</span>
                                </>
                            )}
                        </Button>
                    </Card>
                </div>
            </div>
        </OrganizerSidebar>
    );
};

export default AssignReviewers;
