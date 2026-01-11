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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const SidebarItem = ({ icon: Icon, label, to, open }) => {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link
            to={to}
            className={cn(
                "flex items-center w-full p-2.5 rounded-xl transition-all duration-200 group",
                active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
        >
            <div className={cn(
                "flex items-center transition-transform duration-200",
                !open && "mx-auto"
            )}>
                <Icon size={20} className={cn(
                    "transition-colors",
                    active ? "text-white" : "group-hover:text-white"
                )} />
                {open && <span className="ml-3 font-semibold text-sm">{label}</span>}
            </div>
        </Link>
    );
};

const ParticipantSidebar = ({ children, userInfo }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-[#0f172a] transition-all duration-300 flex flex-col z-20 shadow-2xl overflow-hidden",
                    sidebarOpen ? 'w-64' : 'w-20'
                )}
            >
                <div className="p-5 flex items-center justify-between border-b border-slate-800/50">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <span className="text-white font-black text-lg">S</span>
                        </div>
                        {sidebarOpen && (
                            <span className="text-xl font-bold text-white tracking-tight">
                                SciCon<span className="text-blue-500">.</span>
                            </span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard-participant" open={sidebarOpen} />
                    <SidebarItem icon={FileText} label="My Registrations" to="/events" open={sidebarOpen} />
                    <SidebarItem icon={Award} label="Certificates" to="/profile" open={sidebarOpen} />
                    <SidebarItem icon={Calendar} label="Browse Events" to="/events" open={sidebarOpen} />
                    <Separator className="my-4 bg-slate-800/50" />
                    <SidebarItem icon={Settings} label="Settings" to="/settings" open={sidebarOpen} />
                </nav>

                <div className="p-4 border-t border-slate-800/50">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className={cn(
                            "w-full justify-start text-slate-400 hover:text-white hover:bg-red-600/10 hover:text-red-500 transition-all rounded-xl gap-3 p-3 h-auto",
                            !sidebarOpen && "justify-center px-0"
                        )}
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="font-semibold">Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white/80 dark:bg-[#020817]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                    >
                        <Menu size={20} />
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
                                {userInfo?.first_name ? `${userInfo.first_name} ${userInfo.last_name}` : userInfo?.username}
                            </p>
                            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">Participant</p>
                        </div>
                        <Avatar className="h-10 w-10 border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                            <AvatarImage src={userInfo?.photo} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-black">
                                {(userInfo?.username?.charAt(0) || 'P').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#020817] p-6 md:p-10">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ParticipantSidebar;
