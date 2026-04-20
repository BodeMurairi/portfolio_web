import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ForgotPassword from "./ForgotPassword";

function Login() {
    const [view, setView] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (view === "forgot") {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <h1 className="text-4xl font-bold mb-8 tracking-wide" style={{ color: "#1E3A8A" }}>Login</h1>
                <div className="w-full max-w-sm border border-[#1E3A8A] rounded-xl p-8">
                    <ForgotPassword onBack={() => setView("login")} />
                </div>
            </div>
        );
    }

    const handleGoogleLogin = () => {
        window.location.href = "/auth/google";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            const data = res.data;

            const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
            localStorage.setItem("adminToken", data.access_token);
            localStorage.setItem("adminTokenExpiry", String(expiresAt));

            navigate("/admin");
        } catch (err) {
            setError(err.response?.data?.detail || "Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <h1 className="text-4xl font-bold mb-8 tracking-wide" style={{ color: "#1E3A8A" }}>Login</h1>

            <div className="w-full max-w-sm border border-[#1E3A8A] rounded-xl p-8">
                <h2 className="text-lg font-semibold mb-6 tracking-widest uppercase text-center" style={{ color: "#1E3A8A" }}>
                    Login to your account
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-semibold text-[#1E3A8A] tracking-widest uppercase">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-semibold text-[#1E3A8A] tracking-widest uppercase">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Login button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1E3A8A] hover:bg-[#1e3380] text-white font-semibold tracking-widest uppercase py-2.5 rounded-md text-sm transition-colors disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login Now"}
                    </button>

                    <button
                        type="button"
                        onClick={() => setView("forgot")}
                        className="text-sm text-[#1E3A8A] hover:underline text-center"
                    >
                        Forgot password?
                    </button>

                    {/* Google button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-md text-sm transition-colors"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>

                    {/* Register link */}
                    <p className="text-center text-sm text-gray-500 mt-1">
                        Don&apos;t have an account?{" "}
                        <a href="/register" className="text-[#1E3A8A] font-medium hover:underline">
                            Register
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
export default Login
