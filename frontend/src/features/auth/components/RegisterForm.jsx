import { useState } from "react";
import api from "../../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function RegisterForm({ route }) {
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
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = formData;
            await api.post(route, dataToSend);
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response?.data) {
                const errorMsg = Object.entries(error.response.data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
                setError(errorMsg);
            } else {
                setError("Registration failed. Please try again.");
            }
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 p-4">
            <div className="mb-8">
                <Link to="/" className="flex items-center gap-0.5 hover:opacity-80 transition-opacity">
                    <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">SciCon</span>
                    <span className="text-blue-600 text-3xl leading-none -mt-1">.</span>
                </Link>
            </div>
            <Card className="w-full max-w-xl border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl">
                <CardHeader className="text-center pt-8">
                    <CardTitle className="text-2xl font-semibold text-slate-900">Create an account</CardTitle>
                    <CardDescription className="font-medium">Enter your details below to join SciCon</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm whitespace-pre-wrap">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                {roles.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="institution">Institution (Optional)</Label>
                                <Input id="institution" name="institution" type="text" value={formData.institution} onChange={handleChange} placeholder="e.g., MIT" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="research_domain">Research Domain (Optional)</Label>
                                <Input id="research_domain" name="research_domain" type="text" value={formData.research_domain} onChange={handleChange} placeholder="e.g., AI" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create account"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default RegisterForm;
