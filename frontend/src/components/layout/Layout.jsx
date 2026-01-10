import { useState, useEffect, useRef } from "react";
import { Menu, X, User, Bell, Settings, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./layout.css";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check login and fetch profile
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
        // Optionally clear token if invalid
        // localStorage.clear();
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserInfo(null); // Clear user state
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (userInfo?.role === 'organizer') return '/dashboard-organizer';
    if (userInfo?.role === 'author') return '/dashboard-author';
    return '/dashboard';
  };

  return (
    <div className="layout-wrapper flex flex-col min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:to-blue-400 transition-all">SciCon</span>
            <span className="text-blue-500 text-3xl leading-none -mt-1 transform group-hover:rotate-12 transition-transform">.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-bold text-gray-400 tracking-wide">
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <Link to="/events" className="hover:text-blue-400 transition-colors">Events</Link>
              <Link to="/workshops" className="hover:text-blue-400 transition-colors">Workshops</Link>
              <Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link>
            </div>

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {/* User Dropdown */}
            {userInfo ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-1 pr-3 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center text-xs font-bold uppercase">
                      {userInfo.username?.substring(0, 2) || 'US'}
                    </div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white leading-tight">{userInfo.username}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{userInfo.role}</p>
                  </div>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-4 w-64 bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header info in dropdown */}
                    <div className="p-4 border-b border-white/5 bg-white/5">
                      <p className="text-sm font-bold text-white">{userInfo.username}</p>
                      <p className="text-xs text-gray-400 mt-0.5 break-all">{userInfo.email}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      <Link to={getDashboardLink()} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-blue-600/10 hover:border-blue-600/20 border border-transparent transition-all group" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={16} className="text-gray-400 group-hover:text-blue-400" />
                        Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group" onClick={() => setUserMenuOpen(false)}>
                        <User size={16} className="text-gray-400 group-hover:text-white" />
                        My Profile
                      </Link>
                      <Link to="/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group" onClick={() => setUserMenuOpen(false)}>
                        <Bell size={16} className="text-gray-400 group-hover:text-white" />
                        Notifications
                        {userInfo.unread_notifications > 0 && <span className="ml-auto w-2 h-2 rounded-full bg-red-500"></span>}
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group" onClick={() => setUserMenuOpen(false)}>
                        <Settings size={16} className="text-gray-400 group-hover:text-white" />
                        Settings
                      </Link>
                    </div>

                    <div className="p-2 border-t border-white/5 bg-white/[0.02]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/10 transition-all group text-left"
                      >
                        <LogOut size={16} className="text-red-400/70 group-hover:text-red-400" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-white hover:text-blue-400 transition-colors">Log In</Link>
                <Link to="/register" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0a0a0a] border-b border-white/5 p-4 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
            <Link to="/" className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-colors" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/events" className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-colors" onClick={() => setMenuOpen(false)}>
              Events
            </Link>
            <Link to="/workshops" className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-colors" onClick={() => setMenuOpen(false)}>
              Workshops
            </Link>
            <Link to="/about" className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-colors" onClick={() => setMenuOpen(false)}>
              About Us
            </Link>
            <Link to="/contact" className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-colors" onClick={() => setMenuOpen(false)}>
              Contact Us
            </Link>

            <div className="h-px bg-white/10 mx-4"></div>

            {/* Mobile: Show Login/Register or User options */}
            {userInfo ? (
              <div className="space-y-2 px-4">
                <div className="flex items-center gap-3 mb-4 p-2 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center text-xs font-bold uppercase">
                      {userInfo.username?.substring(0, 2) || 'AN'}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{userInfo.username}</p>
                    <p className="text-xs text-gray-400">{userInfo.email}</p>
                  </div>
                </div>
                <Link to={getDashboardLink()} className="block py-2 text-blue-400 font-medium" onClick={() => setMenuOpen(false)}>
                  Go to Dashboard
                </Link>
                <Link to="/profile" className="block py-2 text-gray-300 font-medium" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
                <Link to="/settings" className="block py-2 text-gray-300 font-medium" onClick={() => setMenuOpen(false)}>
                  Settings
                </Link>
                <button className="block w-full text-left py-2 text-red-400 font-medium mt-2" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-4 grid gap-3">
                <Link to="/login" className="block w-full text-center py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-all" onClick={() => setMenuOpen(false)}>
                  Log In
                </Link>
                <Link to="/register" className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white transition-all" onClick={() => setMenuOpen(false)}>
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content Spacer for Fixed Navbar */}
      <div className="h-20"></div>

      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm text-gray-400">
            {/* About Column */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-1 group">
                <span className="text-xl font-black bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">SciCon.</span>
              </Link>
              <p className="leading-relaxed text-gray-500">
                Leading platform for health science event management in Algeria. We connect researchers,
                professionals, and institutions worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-xs">Explore</h3>
              <ul className="space-y-3">
                <li><Link to="/events" className="hover:text-blue-400 transition-colors">Browse Events</Link></li>
                <li><Link to="/workshops" className="hover:text-blue-400 transition-colors">Workshops</Link></li>
                <li><Link to="/submit" className="hover:text-blue-400 transition-colors">Submit Paper</Link></li>
                <li><Link to="/register" className="hover:text-blue-400 transition-colors">Register</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-xs">Resources</h3>
              <ul className="space-y-3">
                <li><Link to="/guidelines" className="hover:text-blue-400 transition-colors">Submission Guidelines</Link></li>
                <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-xs">Contact Us</h3>
              <ul className="space-y-3">
                <li>Email: <a href="mailto:info@scicon.dz" className="hover:text-blue-400 transition-colors">info@scicon.dz</a></li>
                <li>Phone: <span className="text-gray-500">+213 564 875 214</span></li>
                <li>Address: <span className="text-gray-500">Constantine, Algeria</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
            <p>© 2025 SciCon Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}