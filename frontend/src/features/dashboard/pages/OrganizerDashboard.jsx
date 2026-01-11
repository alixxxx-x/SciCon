import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';
import OrganizerSidebar from '../../../components/layout/OrganizerSidebar';
import {
    Calendar,
    Users,
    TrendingUp,
    Plus,
    ChevronRight,
    Trash2,
    AlertTriangle,
    ClipboardList,
    Loader2,
    Search,
    BookOpen,
    Clock,
    MapPin,
    CheckCircle2,
    Pencil,
    Zap,
    Info,
    LayoutDashboard,
    RefreshCw
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const getStatusStyle = (status) => {
    switch (status) {
        case 'open_call': return 'bg-green-50 text-green-700 border-green-100';
        case 'draft': return 'bg-slate-50 text-slate-600 border-slate-100';
        case 'ongoing': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'program_ready': return 'bg-purple-50 text-purple-700 border-purple-100';
        case 'completed': return 'bg-slate-100 text-slate-600 border-slate-200';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
};

const EventRow = ({ event, onDelete, onPublish }) => {
    const navigate = useNavigate();
    return (
        <tr
            className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/events/${event.id}`)}
        >
            <td className="py-4 px-4">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{event.title}</p>
                <p className="text-xs text-slate-500">{event.location || 'No location'}</p>
            </td>
            <td className="py-4 px-4">
                <Badge variant="secondary" className={cn("text-[10px] font-medium px-2 py-0.5 whitespace-nowrap uppercase", getStatusStyle(event.status))}>
                    {event.status?.replace('_', ' ') || 'DRAFT'}
                </Badge>
            </td>
            <td className="py-4 px-4 text-xs text-slate-600">
                {event.start_date ? new Date(event.start_date).toLocaleDateString() : '—'}
            </td>
            <td className="py-4 px-4 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                {event.real_participants_count ?? 0}
            </td>
            <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    {event.status === 'draft' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onPublish(event.id)}
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        >
                            <Zap size={14} fill="currentColor" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                        className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                        <Pencil size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(event.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            </td>
        </tr>
    );
};

const DashboardOrganizer = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEvents: 0,
        activeEvents: 0,
        totalParticipants: 0,
        pendingApprovals: 0
    });
    const [recentEvents, setRecentEvents] = useState([]);
    const [allSessions, setAllSessions] = useState([]);
    const [acceptedSubmissions, setAcceptedSubmissions] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [assigning, setAssigning] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrganizerData();
    }, []);

    const fetchOrganizerData = async () => {
        try {
            setLoading(true);
            const [profileRes, myEventsRes] = await Promise.all([
                api.get('/api/auth/profile/'),
                api.get('/api/events/my-events/')
            ]);

            setUserInfo(profileRes.data);
            const eventsData = myEventsRes.data;
            let allEvents = Array.isArray(eventsData) ? eventsData : (eventsData.results || []);

            // Parallel fetch for sessions, submissions and registrations
            const sessionPromises = allEvents.map(e => api.get(`/api/events/${e.id}/sessions/`));
            const submissionPromises = allEvents.map(e => api.get(`/api/events/${e.id}/submissions/?status=accepted`));
            const participantsPromises = allEvents.map(e => api.get(`/api/events/${e.id}/registrations/`));

            const [sessionResults, submissionResults, participantResults] = await Promise.all([
                Promise.all(sessionPromises),
                Promise.all(submissionPromises),
                Promise.all(participantsPromises)
            ]);

            let totalParticipantsCount = 0;
            let collectedSessions = [];
            let collectedSubmissions = [];

            allEvents = allEvents.map((event, index) => {
                const regs = Array.isArray(participantResults[index].data)
                    ? participantResults[index].data
                    : (participantResults[index].data.results || []);
                const count = regs.length;
                totalParticipantsCount += count;

                const sess = Array.isArray(sessionResults[index].data)
                    ? sessionResults[index].data
                    : (sessionResults[index].data.results || []);
                collectedSessions = [...collectedSessions, ...sess.map(s => ({ ...s, eventTitle: event.title, eventId: event.id }))];

                const subs = Array.isArray(submissionResults[index].data)
                    ? submissionResults[index].data
                    : (submissionResults[index].data.results || []);
                collectedSubmissions = [...collectedSubmissions, ...subs.map(s => ({ ...s, eventTitle: event.title }))];

                return { ...event, real_participants_count: count };
            });

            setStats({
                totalEvents: allEvents.length,
                activeEvents: allEvents.filter(e => ['open_call', 'ongoing', 'program_ready'].includes(e.status)).length,
                totalParticipants: totalParticipantsCount,
                pendingApprovals: collectedSubmissions.filter(s => !s.session).length
            });
            setRecentEvents(allEvents.slice(0, 5));
            setAllSessions(collectedSessions);
            setAcceptedSubmissions(collectedSubmissions);
        } catch (error) {
            console.error("Organizer Dashboard error:", error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure? This will delete the event and all associated content.")) {
            try {
                await api.delete(`/api/events/${eventId}/`);
                fetchOrganizerData();
            } catch (error) {
                alert("Operation failed. Event may have active registrations.");
            }
        }
    };

    const handleAssignSession = async (submissionId, sessionId) => {
        try {
            setAssigning(submissionId);
            await api.patch(`/api/submissions/${submissionId}/`, { session: sessionId });
            fetchOrganizerData();
        } catch (error) {
            alert("Failed to link submission. Please try again.");
        } finally {
            setAssigning(null);
        }
    };

    const handlePublish = async (eventId) => {
        try {
            await api.patch(`/api/events/${eventId}/`, { status: 'open_call' });
            fetchOrganizerData();
        } catch (error) {
            alert("Failed to publish event.");
        }
    };

    if (loading) {
        return (
            <OrganizerSidebar userInfo={userInfo}>
                <div className="flex h-[50vh] items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
                </div>
            </OrganizerSidebar>
        );
    }

    // Filter sessions that have papers assigned for the schedule view
    const scheduledSessions = allSessions.filter(sess =>
        acceptedSubmissions.some(sub => sub.session === sess.id)
    );

    const sessionsByDate = scheduledSessions.reduce((acc, session) => {
        const date = session.date || 'Undated';
        if (!acc[date]) acc[date] = [];
        acc[date].push(session);
        return acc;
    }, {});

    const sortedDates = Object.keys(sessionsByDate).sort((a, b) => new Date(a) - new Date(b));

    const assignedSessions = scheduledSessions.slice(0, 6);

    return (
        <OrganizerSidebar userInfo={userInfo}>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase mb-1">
                        Dashboard
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage your events, program, and participant growth.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate('/events/create')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-4 rounded-lg">
                        <Plus className="mr-2" size={16} /> New Event
                    </Button>
                    <Button onClick={() => navigate('/sessions/create')} variant="outline" className="text-xs h-9 px-4 rounded-lg border-slate-200">
                        <ClipboardList className="mr-2" size={16} /> New Session
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="mt-8">
                <TabsList className="bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-lg mb-8">
                    <TabsTrigger value="overview" className="text-xs h-8 px-6">Overview</TabsTrigger>
                    <TabsTrigger value="assignments" className="text-xs h-8 px-6">
                        Assignments
                        {stats.pendingApprovals > 0 && (
                            <Badge className="ml-2 bg-amber-500 h-4 min-w-[16px] px-1 text-[9px] border-none">
                                {stats.pendingApprovals}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="text-xs h-8 px-6">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Events"
                            value={stats.totalEvents}
                            icon={Calendar}
                            subtitle="All events"
                        />
                        <StatCard
                            title="Active Calls"
                            value={stats.activeEvents}
                            icon={TrendingUp}
                            subtitle="Open for papers"
                        />
                        <StatCard
                            title="Participants"
                            value={stats.totalParticipants}
                            icon={Users}
                            subtitle="Registered guests"
                        />
                        <StatCard
                            title="Unassigned Papers"
                            value={stats.pendingApprovals}
                            icon={BookOpen}
                            subtitle="Need session link"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Event List */}
                        <div className="lg:col-span-8 space-y-8">
                            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                                    <CardTitle className="text-sm font-semibold">Recent Events</CardTitle>
                                    <Link to="/events/my-events" className="text-xs text-blue-600 hover:underline">View All</Link>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                                                <tr>
                                                    <th className="py-3 px-4 text-[10px] font-bold uppercase text-slate-500">Event</th>
                                                    <th className="py-3 px-4 text-[10px] font-bold uppercase text-slate-500">Status</th>
                                                    <th className="py-3 px-4 text-[10px] font-bold uppercase text-slate-500">Date</th>
                                                    <th className="py-3 px-4 text-center text-[10px] font-bold uppercase text-slate-500">Guests</th>
                                                    <th className="py-3 px-4 text-right text-[10px] font-bold uppercase text-slate-500">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                                {recentEvents.map(event => (
                                                    <EventRow key={event.id} event={event} onDelete={handleDelete} onPublish={handlePublish} />
                                                ))}
                                                {recentEvents.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="py-12 text-center text-slate-400 text-xs italic">No events created yet.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Assigned Sessions Section (New) */}
                            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        Assigned Sessions
                                    </CardTitle>
                                    <Badge variant="outline" className="text-[10px] font-medium h-5">Program in Progress</Badge>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {assignedSessions.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                            {assignedSessions.map(sess => (
                                                <div key={sess.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <Badge variant="outline" className="text-[9px] uppercase px-1.5 h-4 border-slate-200">{sess.eventTitle}</Badge>
                                                        <span className="text-[10px] text-slate-400 font-medium">#{sess.id}</span>
                                                    </div>
                                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{sess.title}</h4>
                                                    <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500">
                                                        <div className="flex items-center gap-1">
                                                            <Users size={12} className="text-blue-500" />
                                                            <span>{acceptedSubmissions.filter(s => s.session === sess.id).length} Papers</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={12} className="text-slate-400" />
                                                            <span>{sess.start_time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-16 text-center">
                                            <BookOpen className="mx-auto text-slate-200 mb-4" size={40} />
                                            <p className="text-slate-500 text-sm">No papers assigned to sessions yet.</p>
                                            <Button variant="link" onClick={() => navigate('/dashboard-organizer?tab=assignments')} className="text-xs text-blue-600 mt-2">Start Assigning Submissions</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-600">
                                <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800">
                                    <CardTitle className="text-sm font-semibold">Organizer Hub</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2">
                                    <Button onClick={() => navigate('/events/create')} variant="outline" className="w-full text-xs h-10 border-slate-200 justify-between px-4">
                                        <span>Create New Event</span>
                                        <Plus size={14} />
                                    </Button>
                                    <Button onClick={() => navigate('/organizer/assign-reviewers')} variant="outline" className="w-full text-xs h-10 border-slate-200 justify-between px-4">
                                        <span>Assign Reviewers</span>
                                        <Users size={14} />
                                    </Button>
                                    <Button onClick={() => navigate('/organizer/participants')} variant="outline" className="w-full text-xs h-10 border-slate-200 justify-between px-4">
                                        <span>Participant List</span>
                                        <ClipboardList size={14} />
                                    </Button>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="assignments" className="animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <BookOpen className="text-blue-600" size={20} />
                                    Unassigned Submissions
                                    <span className="text-slate-400 font-medium ml-1">({stats.pendingApprovals})</span>
                                </h2>
                            </div>

                            {acceptedSubmissions.filter(s => !s.session).length === 0 ? (
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 p-16 rounded-xl text-center">
                                    <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={40} />
                                    <h3 className="text-emerald-800 dark:text-emerald-400 font-bold">All papers assigned!</h3>
                                    <p className="text-emerald-600/80 dark:text-emerald-400/60 text-sm mt-1">Every accepted submission is linked to a session.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {acceptedSubmissions.filter(s => !s.session).map(sub => (
                                        <Card key={sub.id} className="border-slate-200 shadow-sm overflow-hidden hover:border-blue-400 transition-all">
                                            <CardHeader className="p-5 pb-2">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="outline" className="text-[10px] font-medium uppercase px-1.5 h-4 border-slate-200">{sub.eventTitle}</Badge>
                                                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">ID: #{sub.id}</span>
                                                </div>
                                                <CardTitle className="text-sm mt-3">{sub.title}</CardTitle>
                                                <CardDescription className="text-blue-600 text-xs font-medium">{sub.author?.username || 'Unknown Author'}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-5 pt-2">
                                                <div className="flex items-center gap-3 mt-4">
                                                    <select
                                                        className="flex-1 h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                                                        onChange={(e) => {
                                                            if (e.target.value) handleAssignSession(sub.id, e.target.value);
                                                        }}
                                                        disabled={assigning === sub.id}
                                                    >
                                                        <option value="">Link to session...</option>
                                                        {allSessions.filter(sess => sess.event === sub.event).map(sess => (
                                                            <option key={sess.id} value={sess.id}>
                                                                {sess.title} ({sess.date} - {sess.start_time})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {assigning === sub.id && <Loader2 size={16} className="animate-spin text-blue-600" />}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <Card className="border-amber-100 bg-amber-50/30 dark:bg-amber-900/10">
                                <CardHeader className="py-4">
                                    <CardTitle className="text-amber-900 dark:text-amber-400 text-sm">Assignment Task</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs text-amber-700 dark:text-amber-300 space-y-4 leading-relaxed italic font-medium">
                                    <p>Only **Accepted** submissions appear here. Before assigning to a session, ensure the review process is complete.</p>
                                    <p>Linking a submission here will automatically update the Event Schedule for participants.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="schedule" className="animate-in fade-in duration-300">
                    <div className="space-y-8">
                        {sortedDates.length === 0 ? (
                            <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-20 rounded-2xl text-center">
                                <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
                                <h3 className="text-slate-500 font-bold">Scientific schedule is empty.</h3>
                                {allSessions.length > 0 ? (
                                    <>
                                        <p className="text-slate-400 text-sm mt-1 mb-6">You have {allSessions.length} sessions, but none have papers assigned yet.</p>
                                        <Button onClick={() => navigate('/dashboard-organizer?tab=assignments')} className="bg-blue-600 hover:bg-blue-700 text-xs">
                                            <CheckCircle2 className="mr-2" size={16} /> Assign Papers Now
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-slate-400 text-sm mt-1 mb-6">Start by creating sessions for your events.</p>
                                        <Button onClick={() => navigate('/sessions/create')} className="bg-blue-600 hover:bg-blue-700 text-xs">
                                            <Plus className="mr-2" size={16} /> Create First Session
                                        </Button>
                                    </>
                                )}
                            </div>
                        ) : (
                            sortedDates.map(date => (
                                <div key={date} className="relative">
                                    <div className="sticky top-16 bg-white/95 dark:bg-[#020817]/95 backdrop-blur-md z-10 py-4 mb-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                        <div className="h-6 w-1 bg-blue-600 rounded-full" />
                                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                                            {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {sessionsByDate[date].sort((a, b) => (a.start_time || "").localeCompare(b.start_time || "")).map(session => (
                                            <Card key={session.id} className="border-slate-200 hover:border-blue-400 transition-all group shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                                                <CardHeader className="p-5 pb-3">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[9px] uppercase px-1.5 font-medium border-blue-100">{session.eventTitle}</Badge>
                                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{session.session_type}</span>
                                                    </div>
                                                    <CardTitle className="text-sm font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 h-10">{session.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-5 pt-0 space-y-3">
                                                    <div className="flex flex-col gap-2 pt-3 border-t border-slate-50 dark:border-slate-800">
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                            <Clock size={12} className="text-blue-600" />
                                                            <span className="font-medium">
                                                                {session.start_time ? session.start_time.slice(0, 5) : '—'} - {session.end_time ? session.end_time.slice(0, 5) : '—'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                            <MapPin size={12} className="text-red-500" />
                                                            <span>Room: {session.room || 'TBA'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                                                            <Users size={12} className="text-emerald-500" />
                                                            <span>{acceptedSubmissions.filter(s => s.session === session.id).length} Papers Linked</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </OrganizerSidebar>
    );
};

export default DashboardOrganizer;
