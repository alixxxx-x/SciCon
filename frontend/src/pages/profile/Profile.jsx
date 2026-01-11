import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
    User,
    Mail,
    Building,
    Globe,
    Phone,
    FileText,
    Shield,
    Calendar,
    Award,
    Loader2,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
                <p className="text-xl text-slate-400 mb-6 font-medium">Unable to load profile data.</p>
                <Button variant="default" onClick={() => navigate('/')} className="rounded-lg h-11 px-8 font-medium">
                    Return Home
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-16 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-lg ring-1 ring-slate-100 flex items-center justify-center text-4xl overflow-hidden">
                            {profile.photo && (
                                <img src={profile.photo} alt={profile.username} className="w-full h-full object-cover" />
                            )}
                            <AvatarFallback className="bg-blue-600 text-white font-medium">
                                {profile.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-3xl font-medium text-slate-900 mb-2">{profile.username}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
                                <Badge className="bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-xs px-3 py-1">
                                    {profile.role?.replace('_', ' ')}
                                </Badge>
                                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {profile.created_at
                                            ? `Joined ${new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`
                                            : 'Member since 2025'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/settings')}
                            className="rounded-lg h-11 px-6 font-medium border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar Stats / Quick Info */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 pb-4">
                                <CardTitle className="text-xs font-medium text-slate-400">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-slate-500 mb-1">Email Address</span>
                                    <span className="text-sm font-medium text-slate-900 break-all flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                                        {profile.email}
                                    </span>
                                </div>
                                {profile.phone && (
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-slate-500 mb-1">Phone Number</span>
                                        <span className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5 text-blue-500" />
                                            {profile.phone}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="bg-blue-600 rounded-xl p-6 text-white shadow-blue-600/10 shadow-xl">
                            <Shield className="w-10 h-10 mb-4 opacity-30" />
                            <h4 className="font-medium text-lg mb-1 text-white">Verified Researcher</h4>
                            <p className="text-blue-100 text-sm opacity-90 leading-relaxed font-medium">
                                Your account is certified for participation in Algiers' medical conferences.
                            </p>
                        </div>
                    </div>

                    {/* Main Professional Info */}
                    <div className="md:col-span-2 space-y-8">
                        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="border-b border-slate-50 pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <CardTitle className="text-xl font-medium text-slate-900">Professional Details</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-slate-500">Institution</span>
                                    <div className="flex items-center gap-2.5 text-slate-900 font-medium text-lg">
                                        <Building className="w-4 h-4 text-slate-400" />
                                        {profile.institution || "Not provided"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-slate-500">Research Expertise</span>
                                    <div className="flex items-center gap-2.5 text-slate-900 font-medium text-lg">
                                        <Award className="w-4 h-4 text-slate-400" />
                                        {profile.research_domain || "General Medicine"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-slate-500">Location</span>
                                    <div className="flex items-center gap-2.5 text-slate-900 font-medium text-lg">
                                        <Globe className="w-4 h-4 text-slate-400" />
                                        {profile.country || "Algeria"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-slate-500">Department</span>
                                    <div className="flex items-center gap-2.5 text-slate-900 font-medium text-lg">
                                        <User className="w-4 h-4 text-slate-400" />
                                        Medical Science
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <section className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                            <h3 className="text-xs font-medium text-slate-400 mb-6 border-l-2 border-blue-600 pl-3">Professional Biography</h3>
                            <p className="text-slate-600 leading-relaxed text-lg italic font-medium">
                                "{profile.bio || "No biography provided. This user is a dedicated member of the Algerian scientific community."}"
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
