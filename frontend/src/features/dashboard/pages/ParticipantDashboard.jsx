import { useState, useEffect } from 'react';
import {
    Calendar,
    CheckCircle,
    MessageSquare,
    TrendingUp,
    Award,
    Clock,
    LayoutDashboard,
    ArrowRight,
    RefreshCw,
    MapPin,
    Download,
    CreditCard,
    AlertCircle,
    Search
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api';
import ParticipantSidebar from '../../../components/layout/ParticipantSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const RegistrationRow = ({ reg }) => {
    const navigate = useNavigate();
    const isPaid = reg.payment_status?.toLowerCase() === 'paid' || reg.status?.toLowerCase() === 'completed';

    return (
        <div
            className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer"
            onClick={() => navigate(`/events/${reg.event?.id || reg.event}`)}
        >
            <div className="flex items-center gap-4">
                <div className="text-slate-400">
                    <Calendar size={18} />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                        {reg.event_title || 'Event Registration'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(reg.created_at).toLocaleDateString()} • ID: #{reg.id}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <Badge variant="secondary" className={cn(
                    "text-[10px] font-medium px-2 py-0.5",
                    isPaid ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                )}>
                    {reg.status?.replace('_', ' ') || 'Registered'}
                </Badge>
                <ArrowRight size={16} className="text-slate-300" />
            </div>
        </div>
    );
};

const CertificateCard = ({ cert }) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const response = await api.get(`/api/certificates/${cert.id}/download/`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificate_${cert.event_title || cert.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Certificate PDF not available yet.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        <Award size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {cert.event_title || 'Participation Certificate'}
                        </h3>
                        <p className="text-xs text-slate-500">Issued {new Date(cert.issued_at || Date.now()).toLocaleDateString()}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full text-xs h-9 border-slate-200 dark:border-slate-800"
                >
                    {downloading ? <RefreshCw className="mr-2 animate-spin size-3" /> : <Download className="mr-2 size-3" />}
                    Download PDF
                </Button>
            </CardContent>
        </Card>
    );
};

const DashboardParticipant = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ["overview", "registrations", "certificates"].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboardResponse, profileResponse, certResponse] = await Promise.all([
                api.get('/api/dashboard/'),
                api.get('/api/auth/profile/'),
                api.get('/api/certificates/').catch(() => ({ data: [] }))
            ]);
            setDashboardData(dashboardResponse.data);
            setUserInfo(profileResponse.data);
            setCertificates(certResponse.data || []);
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <ParticipantSidebar userInfo={userInfo}>
                <div className="flex h-[50vh] items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
                </div>
            </ParticipantSidebar>
        );
    }

    const registrations = dashboardData?.my_registrations || [];

    return (
        <ParticipantSidebar userInfo={userInfo}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Welcome, {userInfo?.first_name || userInfo?.username}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage your event participation and view certificates.
                </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
                <TabsList className="bg-slate-100/50 dark:bg-slate-800/50">
                    <TabsTrigger value="overview" className="text-xs px-6">Overview</TabsTrigger>
                    <TabsTrigger value="registrations" className="text-xs px-6">Registrations</TabsTrigger>
                    <TabsTrigger value="certificates" className="text-xs px-6">Certificates</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Events"
                            value={registrations.length}
                            icon={Calendar}
                            subtitle="Total registered"
                        />
                        <StatCard
                            title="Certificates"
                            value={certificates.length}
                            icon={Award}
                            subtitle="Earned so far"
                        />
                        <StatCard
                            title="Messages"
                            value={dashboardData?.unread_messages_count || 0}
                            icon={MessageSquare}
                            subtitle="Unread notifications"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-slate-200 dark:border-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <CardTitle className="text-sm font-semibold">Latest Events</CardTitle>
                                <Button variant="link" onClick={() => navigate('/events')} className="text-xs h-auto p-0 text-blue-600">Browse all</Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                {dashboardData?.upcoming_events?.length > 0 ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {dashboardData.upcoming_events.map(event => (
                                            <div
                                                key={event.id}
                                                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                                onClick={() => navigate(`/events/${event.id}`)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span className="text-xs font-medium">{event.title}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400">
                                                    {new Date(event.start_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-slate-400 text-xs">No upcoming events scheduled</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 border-dashed">
                            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                                <AlertCircle className="text-slate-300 mb-3" size={24} />
                                <h4 className="text-sm font-medium mb-1">Quick Note</h4>
                                <p className="text-xs text-slate-500">Your profile is verified. You can access all scientific sessions and retrieve certificates immediately after event completion.</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="registrations" className="animate-in fade-in duration-300">
                    <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
                        <CardContent className="p-0">
                            {registrations.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {registrations.map(reg => (
                                        <RegistrationRow key={reg.id} reg={reg} />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-16 text-center">
                                    <p className="text-slate-400 text-sm">No registrations found.</p>
                                    <Button onClick={() => navigate('/events')} variant="outline" className="mt-4 text-xs">Browse Events</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="certificates" className="animate-in fade-in duration-300">
                    {certificates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {certificates.map(cert => (
                                <CertificateCard key={cert.id} cert={cert} />
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                            <Award className="mx-auto text-slate-200 mb-4" size={40} />
                            <p className="text-slate-500 text-sm">No certificates issued yet.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </ParticipantSidebar>
    );
};

export default DashboardParticipant;
