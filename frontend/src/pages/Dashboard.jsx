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
    Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from "../api";

const iconMap = {
    Calendar: Calendar,
    Users: Users,
    FileText: FileText,
    BarChart3: BarChart3
};

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);

    useEffect(() => {
        getDashboardData();
    }, []);

    const getDashboardData = () => {
        api.get("/api/dashboard/stats/")
            .then((res) => {
                // Transform the icon string from backend to actual component
                const formattedStats = res.data.stats.map(stat => ({
                    ...stat,
                    icon: iconMap[stat.icon] || Calendar
                }));
                setStats(formattedStats);
                setRecentEvents(res.data.recent_events);
            })
            .catch((err) => console.error("Error fetching dashboard data:", err));
    };

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
                    <SidebarItem icon={BarChart3} label="Dashboard" active open={sidebarOpen} />
                    <SidebarItem icon={Calendar} label="Events" open={sidebarOpen} />
                    <SidebarItem icon={FileText} label="Submissions" open={sidebarOpen} />
                    <SidebarItem icon={Users} label="Users" open={sidebarOpen} />
                    <SidebarItem icon={Settings} label="Settings" open={sidebarOpen} />
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button className="flex items-center w-full p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">

                {/* Top Navbar */}
                <header className="h-16 bg-[#1a1a2e]/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
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
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                            AD
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Overview
                            </h1>
                            <p className="text-gray-400 mt-1">Welcome back, Administrator.</p>
                        </div>
                        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                            <Plus size={18} /> New Event
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Recent Activity Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main Chart/Table Area */}
                        <div className="lg:col-span-2 bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">Recent Events</h3>
                                <Link to="/events" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                                            <th className="pb-3 pl-2">Event Name</th>
                                            <th className="pb-3">Date</th>
                                            <th className="pb-3">Status</th>
                                            <th className="pb-3">Participants</th>
                                            <th className="pb-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {recentEvents.map((event) => (
                                            <tr key={event.id} className="group border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors">
                                                <td className="py-4 pl-2 font-medium text-white">{event.title}</td>
                                                <td className="py-4 text-gray-400">{event.date}</td>
                                                <td className="py-4">
                                                    <StatusBadge status={event.status} />
                                                </td>
                                                <td className="py-4 text-gray-300">{event.participants}</td>
                                                <td className="py-4">
                                                    <button className="text-gray-400 hover:text-white transition-colors">Edit</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Side Panel (e.g., Notifications or Quick Actions) */}
                        <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold mb-6">Pending Tasks</h3>
                            <div className="space-y-4">
                                <TaskItem title="Review Abstracts" subtitle="12 submissions waiting" urgency="high" />
                                <TaskItem title="Approve Workshop" subtitle="Web Dev 101" urgency="medium" />
                                <TaskItem title="Send Certificates" subtitle="For 'AI Symposium'" urgency="low" />
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
};

// Components for Dashboard

const SidebarItem = ({ icon: Icon, label, active, open }) => (
    <button
        className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 group
    ${active
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
    >
        <Icon size={20} className={`${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`} />
        {open && <span className="ml-3 font-medium">{label}</span>}
    </button>
);
//كj

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-[#1a1a2e] border border-gray-800 p-5 rounded-2xl hover:border-gray-700 transition-colors">
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
            <span className="text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded mr-2">
                {trend.includes('+') ? '↑' : ''} {trend}
            </span>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        'Upcoming': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Open for CFP': 'bg-green-500/10 text-green-400 border-green-500/20',
        'Completed': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-800 text-gray-400'}`}>
            {status}
        </span>
    );
};

const TaskItem = ({ title, subtitle, urgency }) => {
    const colors = {
        high: 'bg-red-500',
        medium: 'bg-yellow-500',
        low: 'bg-blue-500'
    };

    return (
        <div className="flex items-center p-3 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:border-gray-700 transition-colors">
            <div className={`w-2 h-2 rounded-full ${colors[urgency]} mr-4`}></div>
            <div>
                <h5 className="font-medium text-sm text-gray-200">{title}</h5>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </div>
    );
};

export default Dashboard;
