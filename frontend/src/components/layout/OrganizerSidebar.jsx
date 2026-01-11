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
    Bell,
    ChevronDown,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
                <Sidebar collapsible="none" className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <SidebarHeader className="h-16 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                SciCon
                            </span>
                        </Link>
                    </SidebarHeader>

                    <SidebarContent className="px-3 py-4">
                        {navMain.map((group) => (
                            <SidebarGroup key={group.title} className="mb-2">
                                <SidebarGroupLabel className="px-3 text-[10px] font-medium uppercase text-gray-400 mb-1">
                                    {group.title}
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {group.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={location.pathname === item.url}
                                                    className={cn(
                                                        "h-9 rounded-md transition-colors text-xs",
                                                        location.pathname === item.url
                                                            ? "bg-slate-100 text-blue-600 font-medium"
                                                            : "hover:bg-slate-50 text-gray-600"
                                                    )}
                                                >
                                                    <Link to={item.url}>
                                                        <item.icon className="size-4" />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                    </SidebarContent>

                    <SidebarFooter className="p-4 border-t border-slate-100 dark:border-slate-800">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full h-12 rounded-lg hover:bg-slate-50">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={userInfo?.photo} />
                                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                                            {(userInfo?.username?.charAt(0) || 'O').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start ml-2 overflow-hidden">
                                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate w-full uppercase">
                                            {userInfo?.username}
                                        </p>
                                        <p className="text-[10px] text-gray-500">Organizer</p>
                                    </div>
                                    <ChevronDown className="ml-auto size-4 text-gray-400" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 rounded-md p-1" side="right" align="end">
                                <DropdownMenuItem onClick={() => navigate('/settings')} className="text-xs">
                                    <Settings className="size-3 mr-2" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-xs text-red-600">
                                    <LogOut className="size-3 mr-2" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset className="flex flex-col flex-1 bg-white dark:bg-[#020817]">
                    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-[#020817]/80 backdrop-blur-md z-30">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-400">Dashboard</span>
                            <span className="text-xs text-slate-300">/</span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 capitalize">{location.pathname.split('/').pop().replace('-', ' ') || 'Overview'}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <Bell className="size-4" />
                            </Button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default OrganizerSidebar;
