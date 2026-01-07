import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { User, Mail, Building, Globe, Phone, FileText, Save, Loader2, Lock, Shield, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

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
            const dataToLink = { ...profile };
            if (passwords.newPassword) {
                dataToLink.password = passwords.newPassword;
            }

            await api.patch('/api/auth/profile/', dataToLink);
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
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-4xl mx-auto px-6 pt-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Account Settings</h1>
                    <p className="text-gray-500 font-medium">Manage your professional profile and security preferences.</p>
                </div>

                {message.text && (
                    <div className={`mb-10 p-4 rounded-xl flex items-center gap-3 font-bold text-sm transition-all animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Personal Details Card */}
                    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <User size={18} className="text-blue-600" />
                                Personal Details
                            </h3>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
                                    <input
                                        name="username"
                                        value={profile.username}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Institutional Email</label>
                                    <input
                                        name="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 cursor-not-allowed opacity-50 font-semibold text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Institution / Organization</label>
                                    <input
                                        name="institution"
                                        value={profile.institution}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Research Domain</label>
                                    <input
                                        name="research_domain"
                                        value={profile.research_domain}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Country</label>
                                    <input
                                        name="country"
                                        value={profile.country}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Professional Bio</label>
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-blue-500 focus:bg-white transition-all resize-none font-medium"
                                    placeholder="Describe your professional background..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Card */}
                    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                        <div className="px-8 py-6 border-b border-gray-50 bg-orange-50/10">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Lock size={18} className="text-orange-500" />
                                Security & Password
                            </h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="relative">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={passwords.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 pr-12 outline-none focus:border-orange-500 transition-all font-semibold"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 outline-none focus:border-orange-500 transition-all font-semibold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-black text-white font-black py-4 px-16 rounded-2xl shadow-xl shadow-blue-600/10 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Sync Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}