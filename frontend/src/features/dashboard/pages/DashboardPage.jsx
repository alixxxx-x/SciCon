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
import api from '../../../services/api';
import AuthorSidebar from '../../../components/layout/AuthorSidebar'; // Using same sidebar style for consistency

const Dashboard = () => {
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

    // Redirect based on role
    useEffect(() => {
        if (!userInfo) return;

        if (userInfo.role === 'organizer') {
            navigate('/dashboard-organizer');
        } else if (userInfo.role === 'author') {
            navigate('/dashboard-author');
        } else if (userInfo.role === 'reviewer') {
            navigate('/dashboard-reviewer');
        } else {
            // Default to participant dashboard for participants or any other role
            navigate('/dashboard-participant');
        }
    }, [userInfo, navigate]);

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center">
                <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
};

export default Dashboard;
