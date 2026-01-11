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

function AuthForm({ route, method }) {
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
        setLoading(true);
        setError("");
        e.preventDefault();

        try {
            // Backend USERNAME_FIELD is 'email'
            const payload = isLogin ? { email, password } : { username: email, password };
            const res = await api.post(route, isLogin ? { email, password } : { username: email, password });

            if (isLogin) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
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
                navigate("/login");
            }
        } catch (error) {
            console.error("Auth error:", error);
            setError(error.response?.data?.detail || error.response?.data?.message || "Authentication failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 p-4">
            <div className="mb-8">
                <Link to="/" className="flex items-center gap-0.5 hover:opacity-80 transition-opacity">
                    <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">SciCon</span>
                    <span className="text-blue-600 text-3xl leading-none -mt-1">.</span>
                </Link>
            </div>
            <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl">
                <CardHeader className="text-center pt-8">
                    <CardTitle className="text-2xl font-semibold text-slate-900">{title}</CardTitle>
                    <CardDescription className="font-medium">{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isLogin ? "Login" : "Continue")}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <Link to={isLogin ? "/register" : "/login"} className="text-primary hover:underline font-medium">
                                {isLogin ? "Sign up" : "Sign in"}
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default AuthForm;