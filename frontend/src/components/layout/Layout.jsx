import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, User, Settings, LogOut,
  ChevronDown, LayoutDashboard, Bell, Sun, Moon
} from "lucide-react";
import { useTheme } from "../theme-provider";
import api from "../../services/api";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        if (token) {
          const res = await api.get('/api/auth/profile/');
          setUserInfo(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserInfo(null);
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (userInfo?.role === 'organizer') return '/dashboard-organizer';
    if (userInfo?.role === 'author') return '/dashboard-author';
    return '/dashboard';
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Workshops", path: "/workshops" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0.5 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">SciCon</span>
            <span className="text-blue-600 text-3xl leading-none -mt-1">.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.path}>
                    <NavigationMenuLink
                      asChild
                      className={`${navigationMenuTriggerStyle()} bg-transparent font-bold text-[13px] h-9 px-3 ${location.pathname === link.path ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
                        }`}
                    >
                      <Link to={link.path}>
                        {link.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="h-4 w-px bg-slate-200 mx-1"></div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full w-9 h-9 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all shadow-none"
            >
              {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>

            <div className="h-4 w-px bg-slate-200 mx-1"></div>

            {userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-auto flex items-center gap-2.5 pl-1 pr-3.5 hover:bg-slate-50 rounded-full group transition-all duration-200">
                    <Avatar className="h-8 w-8 border border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-blue-100 transition-all">
                      {userInfo.photo && (
                        <img src={userInfo.photo} alt={userInfo.username} className="h-full w-full object-cover" />
                      )}
                      <AvatarFallback className="bg-blue-600 text-white text-[10px] font-medium uppercase">
                        {userInfo.username?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden lg:block pr-1">
                      <p className="text-xs font-semibold text-slate-900 leading-none mb-1">{userInfo.username}</p>
                      <p className="text-[10px] text-blue-600 font-medium">
                        {userInfo.role === 'organizer' ? 'Event Organizer' : userInfo.role?.replace('_', ' ')}
                      </p>
                    </div>
                    <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 shadow-2xl border-slate-100 bg-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal px-3 py-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-slate-900 leading-none">{userInfo.username}</p>
                      <p className="text-xs text-slate-500 truncate">{userInfo.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-50" />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="cursor-pointer font-medium text-sm text-slate-700 p-2.5 rounded-xl flex items-center hover:bg-slate-50 transition-colors w-full">
                      <LayoutDashboard className="mr-3 h-4 w-4 text-blue-500" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer font-medium text-sm text-slate-700 p-2.5 rounded-xl flex items-center hover:bg-slate-50 transition-colors w-full">
                      <User className="mr-3 h-4 w-4 text-blue-500" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer font-medium text-sm text-slate-700 p-2.5 rounded-xl flex items-center hover:bg-slate-50 transition-colors w-full">
                      <Settings className="mr-3 h-4 w-4 text-blue-500" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-50" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-semibold text-sm text-red-600 p-2.5 rounded-xl flex items-center hover:bg-red-50 focus:bg-red-50 transition-colors w-full">
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-colors px-4">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-full px-6 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-100 p-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 px-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${location.pathname === link.path ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-px bg-slate-100 my-4"></div>

            {userInfo ? (
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-4 py-2">
                  <Avatar className="h-10 w-10">
                    {userInfo.photo && (
                      <img src={userInfo.photo} alt={userInfo.username} className="h-full w-full object-cover" />
                    )}
                    <AvatarFallback className="bg-blue-600 text-white font-medium">{userInfo.username?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{userInfo.username}</p>
                    <p className="text-xs text-blue-600 font-medium">{userInfo.role?.replace('_', ' ')}</p>
                  </div>
                </div>
                <Link to={getDashboardLink()} className="block py-4 text-xs font-black uppercase tracking-widest text-blue-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left py-4 text-xs font-black uppercase tracking-widest text-red-600">Logout</button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <Link to="/login" className="block w-full text-center py-4 bg-slate-50 hover:bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest text-slate-900 transition-all" onClick={() => setMenuOpen(false)}>Log In</Link>
                <Link to="/register" className="block w-full text-center py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 transition-all" onClick={() => setMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content Spacer */}
      <div className="h-16"></div>

      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-1">
                <span className="text-xl font-bold text-white uppercase">SciCon</span>
                <span className="text-blue-400 text-2xl">.</span>
              </Link>
              <p className="leading-relaxed text-gray-400">
                Leading platform for health science event management in Algeria. We connect researchers, professionals, and institutions worldwide.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold uppercase tracking-wider mb-6 text-xs">Explore</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/events" className="hover:text-cyan-400 transition-colors">Browse Events</Link></li>
                <li><Link to="/workshops" className="hover:text-cyan-400 transition-colors">Workshops</Link></li>
                <li><Link to="/submit" className="hover:text-cyan-400 transition-colors">Submit Paper</Link></li>
                <li><Link to="/register" className="hover:text-cyan-400 transition-colors">Register</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold uppercase tracking-wider mb-6 text-xs">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/guidelines" className="hover:text-cyan-400 transition-colors">Submission Guidelines</Link></li>
                <li><Link to="/faq" className="hover:text-cyan-400 transition-colors">FAQs</Link></li>
                <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact Support</Link></li>
                <li><Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold uppercase tracking-wider mb-6 text-xs">Contact Us</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Email: <a href="mailto:info@scicon.dz" className="hover:text-cyan-400 transition-colors">info@scicon.dz</a></li>
                <li>Phone: <span>+213 564 875 214</span></li>
                <li>Address: <span>Constantine, Algeria</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
            <p>© 2025 SciCon Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}