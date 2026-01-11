import { useState } from "react";
import api from "../../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function AuthForm({ route, method }) {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const isLogin = method === "login";
    const title = isLogin ? "Welcome back" : "Create an account";
    const description = isLogin
        ? "Enter your credentials to sign in"
        : "Enter your details below to create your account";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post(route, isLogin ? { email, password } : { username: email, password });

            if (isLogin) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                toast({
                    title: "Login Successful",
                    description: "Synchronizing your workspace...",
                });

                const decoded = jwtDecode(res.data.access);
                const role = decoded.role;
                switch (role) {
                    case "organizer": navigate("/dashboard-organizer"); break;
                    case "author": navigate("/dashboard-author"); break;
                    case "reviewer": navigate("/dashboard-reviewer"); break;
                    case "participant": navigate("/dashboard-participant"); break;
                    default: navigate("/");
                }
            } else {
                toast({
                    title: "Registration Successful",
                    description: "You can now sign in with your credentials.",
                });
                navigate("/login");
            }
        } catch (error) {
            console.error("Auth error:", error);
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Login failed. Check credentials.";
            setError(errorMsg);
            toast({
                variant: "destructive",
                title: "Authentication Failed",
                description: errorMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 p-4 font-sans">
            <div className="mb-8">
                <Link to="/" className="flex items-center gap-0.5 hover:opacity-80 transition-opacity">
                    <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">SciCon</span>
                    <span className="text-blue-600 text-3xl leading-none -mt-1">.</span>
                </Link>
            </div>
            <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                <CardHeader className="text-center pt-8 bg-slate-50/30 border-b border-slate-50">
                    <CardTitle className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{title}</CardTitle>
                    <CardDescription className="font-medium text-[11px] uppercase tracking-widest text-slate-500">{description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-tight">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.edu"
                                className="h-11 border-slate-200 bg-white shadow-sm rounded-xl focus-visible:ring-blue-600"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" title="Secure Password" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-11 border-slate-200 bg-white shadow-sm rounded-xl focus-visible:ring-blue-600"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all active:scale-[0.98]" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isLogin ? "Login" : "Register")}
                        </Button>
                        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-4">
                            {isLogin ? "Missing credentials? " : "Existing Researcher? "}
                            <Link to={isLogin ? "/register" : "/login"} className="text-blue-600 hover:text-blue-700 transition-colors">
                                {isLogin ? "Register" : "Login"}
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default AuthForm;