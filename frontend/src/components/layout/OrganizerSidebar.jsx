import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Calendar,
    Users,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, open }) => {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link to={to} className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 group ${active ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Icon size={20} className={`${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`} />
            {open && <span className="ml-3 font-medium">{label}</span>}
        </Link>
    );
};

const OrganizerSidebar = ({ children, userInfo }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a1a2e] border-r border-gray-800 transition-all duration-300 flex flex-col z-20`}>
                <div className="p-6 flex items-center justify-between">
                    {sidebarOpen ? (
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">SciCon Org</h1>
                    ) : (
                        <span className="text-xl font-bold text-blue-500">SC</span>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden"><X size={20} /></button>
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-2">
                    <SidebarItem icon={BarChart3} label="Overview" to="/dashboard-organizer" open={sidebarOpen} />
                    <SidebarItem icon={Calendar} label="My Events" to="/events/my-events" open={sidebarOpen} />
                    <SidebarItem icon={Users} label="Participants" to="/organizer/participants" open={sidebarOpen} />
                    <SidebarItem icon={FileText} label="Submissions" to="/organizer/submissions" open={sidebarOpen} />
                    <SidebarItem icon={Settings} label="Settings" to="/settings" open={sidebarOpen} />
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center w-full p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-[#1a1a2e]/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-300">Welcome, {userInfo?.username || 'Organizer'}</span>
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                            {userInfo?.username?.charAt(0).toUpperCase() || 'O'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default OrganizerSidebar;
