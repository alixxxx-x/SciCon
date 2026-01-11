import { useState } from "react";
import api from "../../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function RegisterForm({ route }) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "author",
        institution: "",
        research_domain: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            toast({
                variant: "destructive",
                description: "Passwords must match to proceed.",
            });
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = formData;
            await api.post(route, dataToSend);

            toast({
                title: "Registration Successful",
                description: "Welcome to SciCon. Your profile is now active.",
            });

            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            let errorMsg = "Registration failed. Please attempt again.";
            if (error.response?.data) {
                errorMsg = Object.entries(error.response.data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
            }
            setError(errorMsg);
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Failed to create profile. Please check your details.",
            });
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { value: 'author', label: 'Author' },
        { value: 'participant', label: 'Participant' },
        { value: 'organizer', label: 'Organizer' },
        { value: 'reviewer', label: 'Reviewer' },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">

            <div className="mb-8 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
                <Link to="/" className="flex items-center gap-1 group">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">S</div>
                    <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">SciCon<span className="text-blue-600">.</span></span>
                </Link>
            </div>

            <Card className="w-full max-w-xl border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10 rounded-[2rem] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
                <CardHeader className="text-center pt-10 pb-6">
                    <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 shadow-sm ring-1 ring-blue-100">
                        <UserPlus size={24} />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">Register</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mt-2">Create your professional profile</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-tight flex items-center gap-3 animate-shake">
                                <Sparkles size={16} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Username</Label>
                                <Input name="username" value={formData.username} onChange={handleChange} required className="rounded-xl border-slate-200 h-11 focus:ring-blue-500" placeholder="j.smith" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email</Label>
                                <Input name="email" type="email" value={formData.email} onChange={handleChange} required className="rounded-xl border-slate-200 h-11 focus:ring-blue-500" placeholder="smith@research.org" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Role</Label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-white h-11 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                {roles.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Institution</Label>
                                <Input name="institution" value={formData.institution} onChange={handleChange} className="rounded-xl border-slate-200 h-11 focus:ring-blue-500" placeholder="e.g. Stanford University" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Research Field</Label>
                                <Input name="research_domain" value={formData.research_domain} onChange={handleChange} className="rounded-xl border-slate-200 h-11 focus:ring-blue-500" placeholder="e.g. Quantum Computing" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Password</Label>
                                <Input name="password" type="password" value={formData.password} onChange={handleChange} required className="rounded-xl border-slate-200 h-11 focus:ring-blue-500" placeholder="••••••••" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Confirm Password</Label>
                                <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="rounded-xl border-slate-200 h-11 focus:ring-blue-500" placeholder="••••••••" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all hover:shadow-lg hover:shadow-slate-900/10 active:scale-[0.98]" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Register Profile"}
                        </Button>

                        <div className="text-center pt-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Existing member?{" "}
                                <Link to="/login" className="text-blue-600 hover:underline">
                                    Return to Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default RegisterForm;
