import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { User, Mail, Building, Globe, Phone, FileText, ArrowLeft, Loader2, Shield, Calendar, Clock, Award } from "lucide-react";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/api/auth/profile/');
                setProfile(res.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white text-center px-4">
                <p className="text-xl text-gray-400 mb-4 font-medium">Unable to retrieve profile information.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header / Banner Area */}
            <div className="bg-gray-50 border-b border-gray-100 py-12">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 rounded-3xl bg-blue-600 shadow-2xl flex items-center justify-center text-4xl font-black text-white transform -rotate-3">
                            {profile.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{profile.username}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold">
                                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                                    <Shield size={14} /> {profile.role?.replace('_', ' ')}
                                </span>
                                <span className="text-gray-400 flex items-center gap-2">
                                    <Calendar size={16} /> Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                        <div className="md:ml-auto">
                            <button
                                onClick={() => navigate('/settings')}
                                className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                            >
                                Update Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border border-gray-100 p-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Status</p>
                                    <p className="text-sm font-bold text-green-600">Active</p>
                                </div>
                                <div className="bg-white border border-gray-100 p-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Verified</p>
                                    <p className="text-sm font-bold text-blue-600">Yes</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                            <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <Mail size={16} className="text-blue-600" /> Contact Info
                            </h4>
                            <p className="text-sm font-medium text-blue-800 break-all">{profile.email}</p>
                            {profile.phone && (
                                <p className="text-sm font-medium text-blue-800 mt-2 flex items-center gap-2">
                                    <Phone size={14} /> {profile.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Full Professional Details */}
                    <div className="lg:col-span-8 space-y-12">
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                    <FileText size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Professional Profile</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Institution</label>
                                    <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Building size={18} className="text-blue-500/50" />
                                        {profile.institution || "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Research Expertise</label>
                                    <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Award size={18} className="text-blue-500/50" />
                                        {profile.research_domain || "General Science"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location / Country</label>
                                    <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Globe size={18} className="text-blue-500/50" />
                                        {profile.country || "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone</label>
                                    <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Phone size={18} className="text-blue-500/50" />
                                        {profile.phone || "Not provided"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Professional Biography</h3>
                            <p className="text-gray-600 leading-relaxed italic text-lg">
                                "{profile.bio || "Hello! I am a researcher dedicated to advancing scientific knowledge. Welcome to my profile."}"
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
