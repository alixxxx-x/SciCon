import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Award,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, open }) => {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
        >
            <Icon size={20} />
            {open && <span className="ml-3 font-medium">{label}</span>}
        </Link>
    );
};

const AuthorSidebar = ({ children, userInfo }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#f8f9fa] text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1e293b] transition-all duration-300 flex flex-col z-20`}>
                <div className="p-6 flex items-center justify-between border-b border-slate-700">
                    <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">S</div>
                        {sidebarOpen && <span>SciCon</span>}
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-1">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard-author" open={sidebarOpen} />
                    <SidebarItem icon={FileText} label="My Submissions" to="/submissions" open={sidebarOpen} />
                    <SidebarItem icon={Award} label="Certificates" to="/profile" open={sidebarOpen} />
                    <SidebarItem icon={Calendar} label="Browse Events" to="/events" open={sidebarOpen} />
                    <SidebarItem icon={Settings} label="Settings" to="/settings" open={sidebarOpen} />
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-2 text-gray-400 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 uppercase-none">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-500 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900">
                                {userInfo?.first_name ? `${userInfo.first_name} ${userInfo.last_name}` : userInfo?.username}
                            </p>
                            <p className="text-xs text-blue-600 font-medium capitalize">Author Account</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold overflow-hidden shadow-inner">
                            {userInfo?.photo ? (
                                <img src={userInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                (userInfo?.username?.charAt(0) || 'A').toUpperCase()
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AuthorSidebar;
