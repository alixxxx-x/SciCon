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
    RefreshCw,
    LayoutDashboard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import ParticipantSidebar from '../components/layout/ParticipantSidebar';

const DashboardParticipant = () => {
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
                localStorage.clear();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Preparing Participant Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <ParticipantSidebar userInfo={userInfo}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userInfo?.username}!</h1>
                <p className="text-gray-500">Here's what's happening with your events and registrations.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Upcoming Events</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData?.upcoming_events?.length || 0}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Calendar size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">My Registrations</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData?.my_registrations?.length || 0}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <CheckCircle size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Unread Messages</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData?.unread_messages_count || 0}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                        <MessageSquare size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Events */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Upcoming Events</h3>
                        <Link to="/events" className="text-sm font-semibold text-blue-600 hover:underline">Browse All</Link>
                    </div>
                    <div className="p-2 divide-y divide-gray-50">
                        {dashboardData?.upcoming_events?.length > 0 ? (
                            dashboardData.upcoming_events.map(event => (
                                <div key={event.id} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{event.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(event.start_date).toLocaleDateString()} | {event.city}, {event.country}
                                        </p>
                                    </div>
                                    <TrendingUp size={16} className="text-blue-500" />
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-gray-400 text-sm">No upcoming events found.</div>
                        )}
                    </div>
                </div>

                {/* Account Summary */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Award size={20} className="text-orange-500" />
                        Account Summary
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Account Type</span>
                            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">{userInfo?.role?.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Member Since</span>
                            <span className="text-sm font-bold text-gray-900">{new Date(userInfo?.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-6">
                            <button onClick={() => navigate('/settings')} className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors">
                                Manage Profile Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ParticipantSidebar>
    );
};

export default DashboardParticipant;
