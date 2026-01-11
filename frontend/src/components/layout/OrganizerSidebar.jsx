import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    PlusCircle,
    List,
    Settings,
    LogOut,
    Users,
    UserCheck,
    Search,
    Bell,
    ChevronDown,
    Command,
    Sparkles
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarInset,
    SidebarRail
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const navMain = [
    {
        title: "Platform",
        items: [
            { title: "Dashboard", url: "/dashboard-organizer", icon: LayoutDashboard },
            { title: "My Events", url: "/events/my-events", icon: Calendar },
            { title: "Create Event", url: "/events/create", icon: PlusCircle },
            { title: "All Sessions", url: "/organizer/sessions", icon: List },
        ]
    },
    {
        title: "Management",
        items: [
            { title: "Assign Reviewers", url: "/organizer/assign-reviewers", icon: UserCheck },
            { title: "Participants", url: "/organizer/participants", icon: Users },
        ]
    },
    {
        title: "Settings",
        items: [
            { title: "Settings", url: "/settings", icon: Settings },
        ]
    }
];

const OrganizerSidebar = ({ children, userInfo }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-slate-50 dark:bg-[#020817] overflow-hidden font-sans">
                <Sidebar collapsible="none" className="border-r border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-900 shadow-sm">
                    <SidebarHeader className="h-16 flex items-center justify-center px-6 border-b border-blue-100 dark:border-slate-800">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white group-data-[collapsible=icon]:hidden">
                                SciCon
                            </span>
                        </Link>
                    </SidebarHeader>

                    <SidebarContent className="px-3 py-4">
                        {navMain.map((group) => (
                            <SidebarGroup key={group.title} className="mb-4">
                                <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase text-gray-400 dark:text-slate-500 mb-2">
                                    {group.title}
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu className="gap-1">
                                        {group.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={location.pathname === item.url}
                                                    tooltip={item.title}
                                                    className={cn(
                                                        "h-10 rounded-lg transition-colors",
                                                        location.pathname === item.url
                                                            ? "bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:text-white"
                                                            : "hover:bg-blue-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"
                                                    )}
                                                >
                                                    <Link to={item.url}>
                                                        <item.icon className="size-5" />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}

                        {/* Sidebar Spacer */}
                        <div className="mt-auto" />
                    </SidebarContent>

                    <SidebarFooter className="p-4 border-t border-blue-100 dark:border-slate-800">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="w-full h-12 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={userInfo?.photo} alt={userInfo?.username} />
                                        <AvatarFallback className="bg-blue-600 text-white font-bold text-xs rounded-lg">
                                            {(userInfo?.username?.charAt(0) || 'O').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start min-w-0 group-data-[collapsible=icon]:hidden ml-2">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate w-full">
                                            {userInfo?.first_name ? `${userInfo.first_name} ${userInfo.last_name}` : userInfo?.username}
                                        </p>
                                        <p className="text-xs text-blue-600 font-medium">
                                            Organizer
                                        </p>
                                    </div>
                                    <ChevronDown className="ml-auto size-4 text-gray-400 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 rounded-lg p-1 shadow-lg border border-gray-200 dark:border-slate-700" side="right" align="end" sideOffset={8}>
                                <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700 mb-1">
                                    <p className="text-xs text-gray-500 mb-0.5">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userInfo?.email || 'organizer@scicon.org'}</p>
                                </div>
                                <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-md cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm">
                                    <Settings className="size-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-slate-700" />
                                <DropdownMenuItem onClick={handleLogout} className="rounded-md cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 px-3 py-2 text-sm">
                                    <LogOut className="size-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset className="flex flex-col min-w-0 flex-1 bg-white dark:bg-[#020817]">
                    <header className="h-20 flex items-center justify-between px-8 border-b border-slate-100 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#020817]/80 backdrop-blur-xl z-30">
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col">
                                <h4 className="text-[13px] font-black text-slate-900 dark:text-white tracking-tight">ORGANIZER CONSOLE</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-tight">SciCon</span>
                                    <span className="text-[10px] text-slate-300 dark:text-slate-600">/</span>
                                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight capitalize">
                                        {location.pathname.split('/').pop().replace('-', ' ') || 'Overview'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden lg:flex items-center bg-slate-50 dark:bg-white/5 rounded-xl px-3 h-10 border border-slate-100 dark:border-white/5 w-64 focus-within:border-blue-300 focus-within:bg-white dark:focus-within:bg-white/10 transition-all group">
                                <Search className="size-4 text-slate-400 group-focus-within:text-blue-600" />
                                <input
                                    type="text"
                                    placeholder="Search events, sessions..."
                                    className="bg-transparent border-none outline-none text-[12px] font-medium ml-2 w-full text-slate-600 dark:text-slate-300 placeholder:text-slate-400"
                                />
                                <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-white/10 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-white/10 shadow-sm text-[9px] font-black text-slate-400">
                                    <Command className="size-2.5" />
                                    <span>K</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl relative text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <Bell className="size-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-[#020817]" />
                            </Button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 custom-scrollbar bg-slate-100/50 dark:bg-slate-900/50 transition-colors duration-500">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default OrganizerSidebar;
