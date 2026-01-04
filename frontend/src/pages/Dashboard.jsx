import { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    Calendar,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Plus,
    MessageSquare,
    Award,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    MapPin,
    RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboardResponse, profileResponse] = await Promise.all([
                api.get('/api/dashboard/'),
                api.get('/api/auth/profile/')
            ]);

            setDashboardData(dashboardResponse.data);
            setUserInfo(profileResponse.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    // Dynamic stats based on user role
    const getStatsForRole = () => {
        const baseStats = [
            {
                title: 'Upcoming Events',
                value: dashboardData?.upcoming_events?.length || 0,
                icon: Calendar,
                color: 'bg-blue-500',
                trend: 'Starting soon'
            },
            {
                title: 'My Registrations',
                value: dashboardData?.my_registrations?.length || 0,
                icon: Users,
                color: 'bg-green-500',
                trend: 'Active'
            },
            {
                title: 'Notifications',
                value: dashboardData?.unread_notifications || 0,
                icon: Bell,
                color: 'bg-purple-500',
                trend: 'Unread'
            },
            {
                title: 'Messages',
                value: dashboardData?.unread_messages || 0,
                icon: MessageSquare,
                color: 'bg-yellow-500',
                trend: 'New'
            }
        ];

        // Add role-specific stats
        if (userInfo?.role === 'organizer' && dashboardData?.my_events) {
            return [
                {
                    title: 'My Events',
                    value: dashboardData.my_events.length,
                    icon: Calendar,
                    color: 'bg-blue-500',
                    trend: 'Organized'
                },
                ...baseStats.slice(1)
            ];
        }

        if (userInfo?.role === 'author' && dashboardData?.my_submissions) {
            return [
                {
                    title: 'My Submissions',
                    value: dashboardData.my_submissions.length,
                    icon: FileText,
                    color: 'bg-indigo-500',
                    trend: 'Submitted'
                },
                ...baseStats.slice(1)
            ];
        }

        if (userInfo?.role === 'reviewer' && dashboardData?.pending_reviews !== undefined) {
            return [
                {
                    title: 'Pending Reviews',
                    value: dashboardData.pending_reviews,
                    icon: FileText,
                    color: 'bg-orange-500',
                    trend: 'To review'
                },
                ...baseStats.slice(1)
            ];
        }

        return baseStats;
    };

    const stats = getStatsForRole();

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'} 
                bg-[#1a1a2e] border-r border-gray-800 transition-all duration-300 ease-in-out flex flex-col z-20`}
            >
                <div className="p-6 flex items-center justify-between">
                    {sidebarOpen ? (
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            SciCon
                        </h1>
                    ) : (
                        <span className="text-xl font-bold text-blue-500">SC</span>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-800 rounded-lg lg:hidden">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-2">
                    <SidebarItem icon={BarChart3} label="Dashboard" active open={sidebarOpen} to="/dashboard" />
                    <SidebarItem icon={Calendar} label="Events" open={sidebarOpen} to="/events" />
                    <SidebarItem icon={FileText} label="Submissions" open={sidebarOpen} to="/submissions" />
                    {(userInfo?.role === 'organizer' || userInfo?.role === 'super_admin') && (
                        <SidebarItem icon={Users} label="Users" open={sidebarOpen} to="/users" />
                    )}
                    <SidebarItem icon={Award} label="Certificates" open={sidebarOpen} to="/certificates" />
                    <SidebarItem icon={Settings} label="Settings" open={sidebarOpen} to="/settings" />
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Navbar */}
                <header className="h-16 bg-[#1a1a2e]/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="bg-[#0a0a0a] border border-gray-800 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64 transition-all"
                            />
                        </div>

                        <button className="relative p-2 hover:bg-gray-800 rounded-full text-gray-400">
                            <Bell size={20} />
                            {dashboardData?.unread_notifications > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                                {userInfo?.username?.substring(0, 2).toUpperCase() || 'U'}
                            </div>
                            {sidebarOpen && (
                                <div className="hidden lg:block">
                                    <p className="text-sm font-medium">{userInfo?.username}</p>
                                    <p className="text-xs text-gray-400 capitalize">{userInfo?.role?.replace('_', ' ')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Dashboard Overview
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Welcome back, {userInfo?.username || 'User'}!
                                <span className="ml-2 text-blue-400 capitalize">({userInfo?.role?.replace('_', ' ')})</span>
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/events/create')}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                            <Plus size={18} /> New Event
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Content Sections Based on Role */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content Area - Left 2 columns */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Upcoming Events */}
                            {dashboardData?.upcoming_events && dashboardData.upcoming_events.length > 0 && (
                                <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold flex items-center gap-2">
                                            <Calendar className="text-blue-400" size={24} />
                                            Upcoming Events
                                        </h3>
                                        <Link to="/events" className="text-sm text-blue-400 hover:text-blue-300">
                                            View All
                                        </Link>
                                    </div>
                                    <div className="space-y-3">
                                        {dashboardData.upcoming_events.map((event) => (
                                            <EventCard key={event.id} event={event} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* My Events (Organizer) */}
                            {dashboardData?.my_events && dashboardData.my_events.length > 0 && (
                                <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold flex items-center gap-2">
                                            <BarChart3 className="text-green-400" size={24} />
                                            My Organized Events
                                        </h3>
                                        <Link to="/events/my-events" className="text-sm text-blue-400 hover:text-blue-300">
                                            Manage
                                        </Link>
                                    </div>
                                    <div className="space-y-3">
                                        {dashboardData.my_events.map((event) => (
                                            <EventCard key={event.id} event={event} isOrganizer />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* My Submissions (Author) */}
                            {dashboardData?.my_submissions && dashboardData.my_submissions.length > 0 && (
                                <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold flex items-center gap-2">
                                            <FileText className="text-purple-400" size={24} />
                                            My Submissions
                                        </h3>
                                        <Link to="/submissions/my-submissions" className="text-sm text-blue-400 hover:text-blue-300">
                                            View All
                                        </Link>
                                    </div>
                                    <div className="space-y-3">
                                        {dashboardData.my_submissions.map((submission) => (
                                            <SubmissionCard key={submission.id} submission={submission} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Side Panel - Right column */}
                        <div className="space-y-6">
                            {/* My Registrations */}
                            {dashboardData?.my_registrations && dashboardData.my_registrations.length > 0 && (
                                <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                        <Users className="text-green-400" size={24} />
                                        My Registrations
                                    </h3>
                                    <div className="space-y-3">
                                        {dashboardData.my_registrations.map((registration) => (
                                            <RegistrationCard key={registration.id} registration={registration} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Stats for Reviewer */}
                            {userInfo?.role === 'reviewer' && (
                                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <AlertCircle className="text-orange-400" size={24} />
                                        Review Tasks
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-300">Pending Reviews</span>
                                            <span className="text-2xl font-bold text-orange-400">
                                                {dashboardData?.pending_reviews || 0}
                                            </span>
                                        </div>
                                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                                            Start Reviewing
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <QuickActionButton icon={Calendar} label="Browse Events" onClick={() => navigate('/events')} />
                                    <QuickActionButton icon={FileText} label="Submit Abstract" onClick={() => navigate('/submissions/new')} />
                                    <QuickActionButton icon={Bell} label="Notifications" onClick={() => navigate('/notifications')} />
                                    <QuickActionButton icon={MessageSquare} label="Messages" onClick={() => navigate('/messages')} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// ========================================
// Component Definitions
// ========================================

const SidebarItem = ({ icon: Icon, label, active, open, to }) => (
    <Link
        to={to}
        className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 group
            ${active
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
    >
        <Icon size={20} className={`${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`} />
        {open && <span className="ml-3 font-medium">{label}</span>}
    </Link>
);

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-[#1a1a2e] border border-gray-800 p-5 rounded-2xl hover:border-gray-700 transition-all hover:scale-105 cursor-pointer">
        <div className="flex items-start justify-between">
            <div>
                <h4 className="text-gray-400 text-sm font-medium">{title}</h4>
                <h2 className="text-3xl font-bold mt-2 text-white">{value}</h2>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-xs">
            <span className="text-gray-400 font-medium bg-gray-800 px-2 py-0.5 rounded">
                {trend}
            </span>
        </div>
    </div>
);

const EventCard = ({ event, isOrganizer }) => {
    const getStatusColor = (status) => {
        const colors = {
            'draft': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
            'open_call': 'bg-green-500/10 text-green-400 border-green-500/20',
            'reviewing': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            'program_ready': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'ongoing': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            'completed': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        };
        return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    return (
        <div className="p-4 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:border-gray-700 transition-all group">
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {event.title}
                </h4>
                {event.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {event.status.replace('_', ' ').toUpperCase()}
                    </span>
                )}
            </div>
            <div className="space-y-1 text-sm text-gray-400">
                {event.start_date && (
                    <p className="flex items-center gap-2">
                        <Clock size={14} />
                        {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                )}
                {event.city && event.country && (
                    <p className="flex items-center gap-2">
                        <MapPin size={14} />
                        {event.city}, {event.country}
                    </p>
                )}
            </div>
        </div>
    );
};

const SubmissionCard = ({ submission }) => {
    const getStatusIcon = (status) => {
        const icons = {
            'accepted': <CheckCircle size={16} className="text-green-400" />,
            'rejected': <XCircle size={16} className="text-red-400" />,
            'pending': <Clock size={16} className="text-yellow-400" />,
            'under_review': <TrendingUp size={16} className="text-blue-400" />,
            'revision_requested': <AlertCircle size={16} className="text-orange-400" />,
        };
        return icons[status] || <Clock size={16} className="text-gray-400" />;
    };

    return (
        <div className="p-4 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:border-gray-700 transition-all">
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white text-sm">{submission.title}</h4>
                <div className="flex items-center gap-1">
                    {getStatusIcon(submission.status)}
                </div>
            </div>
            <p className="text-xs text-gray-400 capitalize">
                {submission.status?.replace('_', ' ')} • {submission.submission_type}
            </p>
        </div>
    );
};

const RegistrationCard = ({ registration }) => {
    return (
        <div className="p-3 bg-[#0a0a0a] border border-gray-800 rounded-lg hover:border-gray-700 transition-all">
            <p className="text-sm font-medium text-white mb-1">Event #{registration.event}</p>
            <p className="text-xs text-gray-400 capitalize">
                {registration.registration_type} • {registration.payment_status?.replace('_', ' ')}
            </p>
        </div>
    );
};

const QuickActionButton = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-3 p-3 bg-[#0a0a0a] border border-gray-800 rounded-lg hover:border-gray-700 hover:bg-gray-800/50 transition-all group"
    >
        <Icon size={18} className="text-gray-400 group-hover:text-blue-400" />
        <span className="text-sm text-gray-300 group-hover:text-white">{label}</span>
    </button>
);

export default Dashboard;
