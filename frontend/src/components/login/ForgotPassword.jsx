import { useState, useEffect, useRef } from "react"
import api from "../../api/axios"

const EyeIcon = ({ open }) => open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
)

/* ── Step 1: request OTP ──────────────────────────────────── */
function StepEmail({ onNext, onBack }) {
    const [email, setEmail]     = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true); setError("")
        try {
            await api.post("/auth/forgot-password/request-otp", { email })
            onNext(email)
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to send OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 text-center">
                Enter your email and we'll send a 6-digit code valid for 15 minutes.
            </p>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#1E3A8A] tracking-widest uppercase">Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E3A8A] text-white font-semibold tracking-widest uppercase py-2.5 rounded-md text-sm transition-colors disabled:opacity-60 hover:bg-[#1e3380]"
            >
                {loading ? "Sending…" : "Send OTP"}
            </button>
            <button type="button" onClick={onBack} className="text-sm text-gray-400 hover:text-[#1E3A8A] text-center transition-colors">
                ← Back to login
            </button>
        </form>
    )
}

/* ── Step 2: verify OTP ───────────────────────────────────── */
function StepOTP({ email, onNext, onBack }) {
    const [otp, setOtp]         = useState(["", "", "", "", "", ""])
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState("")
    const [resending, setResending] = useState(false)
    const [countdown, setCountdown] = useState(900) // 15 min
    const inputs = useRef([])

    useEffect(() => {
        const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
        return () => clearInterval(t)
    }, [])

    const minutes = String(Math.floor(countdown / 60)).padStart(2, "0")
    const seconds = String(countdown % 60).padStart(2, "0")

    function handleInput(i, val) {
        if (!/^\d?$/.test(val)) return
        const next = [...otp]
        next[i] = val
        setOtp(next)
        if (val && i < 5) inputs.current[i + 1]?.focus()
    }

    function handleKeyDown(i, e) {
        if (e.key === "Backspace" && !otp[i] && i > 0) {
            inputs.current[i - 1]?.focus()
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const code = otp.join("")
        if (code.length < 6) { setError("Enter all 6 digits"); return }
        setLoading(true); setError("")
        try {
            await api.post("/auth/forgot-password/verify-otp", { email, otp_code: code })
            onNext(code)
        } catch (err) {
            setError(err.response?.data?.detail || "Invalid or expired OTP.")
        } finally {
            setLoading(false)
        }
    }

    async function handleResend() {
        setResending(true); setError("")
        try {
            await api.post("/auth/forgot-password/request-otp", { email })
            setCountdown(900)
            setOtp(["", "", "", "", "", ""])
            inputs.current[0]?.focus()
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to resend OTP.")
        } finally {
            setResending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 text-center">
                A 6-digit code was sent to <span className="font-semibold text-[#1E3A8A]">{email}</span>
            </p>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* OTP boxes */}
            <div className="flex justify-center gap-2">
                {otp.map((d, i) => (
                    <input
                        key={i}
                        ref={el => inputs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={e => handleInput(i, e.target.value)}
                        onKeyDown={e => handleKeyDown(i, e)}
                        className="w-11 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:border-[#1E3A8A] transition-colors"
                        style={{ borderColor: d ? "#1E3A8A" : "#e5e7eb", color: "#1E3A8A" }}
                    />
                ))}
            </div>

            <p className="text-center text-xs text-gray-400">
                Expires in <span className="font-semibold" style={{ color: countdown < 60 ? "#ef4444" : "#1E3A8A" }}>{minutes}:{seconds}</span>
            </p>

            <button
                type="submit"
                disabled={loading || otp.join("").length < 6}
                className="w-full bg-[#1E3A8A] text-white font-semibold tracking-widest uppercase py-2.5 rounded-md text-sm transition-colors disabled:opacity-60 hover:bg-[#1e3380]"
            >
                {loading ? "Verifying…" : "Verify Code"}
            </button>

            <div className="flex justify-between text-sm">
                <button type="button" onClick={onBack} className="text-gray-400 hover:text-[#1E3A8A] transition-colors">
                    ← Back
                </button>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || countdown > 840}
                    className="text-[#1E3A8A] font-medium hover:underline disabled:opacity-40 transition-opacity"
                >
                    {resending ? "Sending…" : "Resend code"}
                </button>
            </div>
        </form>
    )
}

/* ── Step 3: new password ─────────────────────────────────── */
function StepReset({ email, otpCode, onDone }) {
    const [password, setPassword]   = useState("")
    const [confirm, setConfirm]     = useState("")
    const [showPw, setShowPw]       = useState(false)
    const [showCf, setShowCf]       = useState(false)
    const [loading, setLoading]     = useState(false)
    const [error, setError]         = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        if (password !== confirm) { setError("Passwords do not match"); return }
        if (password.length < 8)  { setError("Password must be at least 8 characters"); return }
        setLoading(true); setError("")
        try {
            await api.post("/auth/forgot-password/reset", { email, otp_code: otpCode, new_password: password })
            onDone()
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to reset password.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 text-center">Choose a new password for your account.</p>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* New password */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#1E3A8A] tracking-widest uppercase">New Password</label>
                <div className="relative">
                    <input
                        type={showPw ? "text" : "password"}
                        required
                        minLength={8}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <EyeIcon open={showPw} />
                    </button>
                </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#1E3A8A] tracking-widest uppercase">Confirm Password</label>
                <div className="relative">
                    <input
                        type={showCf ? "text" : "password"}
                        required
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        placeholder="Repeat your password"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                    <button type="button" onClick={() => setShowCf(v => !v)} tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <EyeIcon open={showCf} />
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E3A8A] text-white font-semibold tracking-widest uppercase py-2.5 rounded-md text-sm transition-colors disabled:opacity-60 hover:bg-[#1e3380]"
            >
                {loading ? "Saving…" : "Set New Password"}
            </button>
        </form>
    )
}

/* ── Root component ───────────────────────────────────────── */
export default function ForgotPassword({ onBack }) {
    const [step, setStep]       = useState("email")   // email | otp | reset | done
    const [email, setEmail]     = useState("")
    const [otpCode, setOtpCode] = useState("")

    if (step === "done") {
        return (
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                    style={{ backgroundColor: "#E0E7FF" }}>
                    ✓
                </div>
                <p className="text-lg font-bold" style={{ color: "#1E3A8A" }}>Password updated!</p>
                <p className="text-sm text-gray-500 text-center">Your password has been changed. You can now log in.</p>
                <button
                    onClick={onBack}
                    className="w-full bg-[#1E3A8A] text-white font-semibold tracking-widest uppercase py-2.5 rounded-md text-sm hover:bg-[#1e3380]"
                >
                    Back to Login
                </button>
            </div>
        )
    }

    const stepLabel = { email: "1 / 3 — Enter email", otp: "2 / 3 — Verify code", reset: "3 / 3 — New password" }

    return (
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-center mb-1" style={{ color: "#1E3A8A" }}>
                    Forgot Password
                </p>
                <p className="text-xs text-gray-400 text-center">{stepLabel[step]}</p>
                {/* Progress bar */}
                <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ backgroundColor: "#1E3A8A", width: step === "email" ? "33%" : step === "otp" ? "66%" : "100%" }}
                    />
                </div>
            </div>

            {step === "email" && (
                <StepEmail onNext={e => { setEmail(e); setStep("otp") }} onBack={onBack} />
            )}
            {step === "otp" && (
                <StepOTP email={email} onNext={code => { setOtpCode(code); setStep("reset") }} onBack={() => setStep("email")} />
            )}
            {step === "reset" && (
                <StepReset email={email} otpCode={otpCode} onDone={() => setStep("done")} />
            )}
        </div>
    )
}
