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
    Save,
    Loader2,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Settings() {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        institution: '',
        research_domain: '',
        country: '',
        phone: '',
        bio: ''
    });
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/api/auth/profile/');
                setProfile({
                    username: res.data.username || '',
                    email: res.data.email || '',
                    institution: res.data.institution || '',
                    research_domain: res.data.research_domain || '',
                    country: res.data.country || '',
                    phone: res.data.phone || '',
                    bio: res.data.bio || ''
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            setSaving(false);
            return;
        }

        try {
            const dataToUpdate = { ...profile };
            if (passwords.newPassword) {
                dataToUpdate.password = passwords.newPassword;
            }

            await api.patch('/api/auth/profile/', dataToUpdate);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            setPasswords({ newPassword: '', confirmPassword: '' });
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: 'Failed to update settings. Please check your inputs.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-4 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Profile</span>
                        </button>
                        <h1 className="text-3xl font-medium text-slate-900 mb-2">Account Settings</h1>
                        <p className="text-slate-500 font-medium">Manage your professional profile and security.</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-10 p-5 rounded-xl flex items-center gap-3 font-medium text-sm border transition-all animate-in fade-in slide-in-from-top-4 ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Details Card */}
                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
                            <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2.5">
                                <User size={20} className="text-blue-600" />
                                Professional Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 ml-1">Username</Label>
                                    <Input
                                        name="username"
                                        value={profile.username}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 ml-1">Email (Immutable)</Label>
                                    <Input
                                        name="email"
                                        value={profile.email}
                                        disabled
                                        className="h-12 rounded-xl bg-slate-50 border-slate-200 cursor-not-allowed opacity-60 font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 ml-1">Institution</Label>
                                    <Input
                                        name="institution"
                                        value={profile.institution}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 ml-1">Research Field</Label>
                                    <Input
                                        name="research_domain"
                                        value={profile.research_domain}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 ml-1">Phone Number</Label>
                                    <Input
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 ml-1">Country</Label>
                                    <Input
                                        name="country"
                                        value={profile.country}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-xs font-medium text-slate-500 ml-1">Short Biography</Label>
                                <Textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all resize-none italic text-slate-600"
                                    placeholder="Write a few words about your professional background..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Card */}
                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
                            <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2.5">
                                <Lock size={20} className="text-amber-500" />
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-2 relative">
                                    <Label className="text-xs font-medium text-slate-500 ml-1">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={passwords.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Leave blank to keep current"
                                            className="h-12 rounded-xl border-slate-200 focus:ring-amber-500/20 focus:border-amber-500 font-medium transition-all pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 ml-1">Confirm Password</Label>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Verify new password"
                                        className="h-12 rounded-xl border-slate-200 focus:ring-amber-500/20 focus:border-amber-500 font-medium transition-all"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="h-14 px-12 bg-blue-600 hover:bg-slate-900 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all font-medium flex items-center gap-2.5 active:scale-[0.98]"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Settings
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}