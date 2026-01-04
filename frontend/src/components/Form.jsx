import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({ route, method }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await api.post(route, { email, password });

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/dashboard"); // Redirect to dashboard after login
            } else {
                alert("Registration successful! Please log in.");
                navigate("/login");
            }
        }
        catch (error) {
            alert("An error occurred. Please try again.");
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <form onSubmit={handleSubmit} className="bg-[#1a1a2e] p-8 rounded-2xl shadow-xl border border-gray-800 w-full max-w-sm">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">{name}</h1>

                <div className="space-y-4">
                    <input
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />

                    <input
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                </div>

                <button
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Processing..." : name}
                </button>
            </form>
        </div>
    );
}

export default Form;