import { useState } from "react";
import api from "../../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";
import { Loader2, ArrowRight } from "lucide-react";
import "../../../styles/Form.css";

function Form({ route, method }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const isLogin = method === "login";
    const name = isLogin ? "Welcome Back" : "Create Account";
    const buttonText = isLogin ? "Sign In" : "Register";
    const subtitle = isLogin
        ? "Enter your credentials to access your account"
        : "Join us and start managing your scientific events";

    const handleSubmit = async (e) => {
        setLoading(true);
        setError("");
        e.preventDefault();

        try {
            const data = { email, password };
            // Add user type or other fields if registration needs them in future

            const response = await api.post(route, data);

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/dashboard"); // Redirect to dashboard after login
            } else {
                // If registration successful
                navigate("/login", { state: { message: "Registration successful! Please log in." } });
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setError("Invalid email or password.");
            } else if (err.response?.data) {
                // Try to show specific backend errors if available
                const backendErrors = Object.values(err.response.data).flat();
                setError(backendErrors.length > 0 ? backendErrors[0] : "An error occurred. Please try again.");
            } else {
                setError("Something went wrong. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl border border-gray-200 shadow-xl">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                        {name}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {subtitle}
                    </p>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Email Address</label>
                            <input
                                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-xl px-4 py-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Password</label>
                            <input
                                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-xl px-4 py-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                {buttonText}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <Link
                            to={isLogin ? "/register" : "/login"}
                            className="ml-2 font-bold text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            {isLogin ? "Sign up now" : "Log in"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Form;