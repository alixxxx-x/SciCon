import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, Clock, ArrowLeft, Loader2, ChevronRight, Search, Filter, RefreshCw } from 'lucide-react';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EventSubmissions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventTitle, setEventTitle] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const filteredSubmissions = submissions.filter(sub =>
        sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard-organizer')}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-4 h-8 px-2 text-xs font-medium"
                >
                    <ArrowLeft size={14} /> Back to Dashboard
                </Button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase mb-1">Event Submissions</h1>
                <p className="text-sm text-slate-500">Scientific review for: <span className="text-blue-600 font-semibold">{eventTitle}</span></p>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="text-xs border-slate-200">
                            <Filter size={14} className="mr-2" /> Status Filter
                        </Button>
                    </div>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-400">Submission</th>
                                <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-400">Researcher</th>
                                <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-400 text-center">Lifecycle</th>
                                <th className="py-3 px-6 text-[10px] font-bold uppercase text-slate-400">Timestamp</th>
                                <th className="py-3 px-6 text-right text-[10px] font-bold uppercase text-slate-400">Select</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredSubmissions.length > 0 ? (
                                filteredSubmissions.map(sub => (
                                    <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{sub.title}</div>
                                            <Badge variant="outline" className="text-[9px] font-medium h-4 border-slate-100 text-slate-400 uppercase mt-1">ID: #{sub.id}</Badge>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-xs font-semibold text-slate-600 uppercase">{sub.author_name || 'Anonymous Author'}</div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Badge variant="secondary" className={cn("text-[9px] font-medium px-2 py-0.5 uppercase", getStatusStyle(sub.status))}>
                                                {sub.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-[11px] text-slate-400 font-medium whitespace-nowrap">
                                            {new Date(sub.submitted_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                                <ChevronRight size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center">
                                        <FileText className="w-10 h-10 text-slate-100 mx-auto mb-4" />
                                        <p className="text-slate-400 text-xs italic">No scientific works found for this event.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </OrganizerSidebar>
    );
};

export default EventSubmissions;
