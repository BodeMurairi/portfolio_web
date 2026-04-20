import { useState, useEffect } from "react"
import { authHeaders } from "../../utils/auth"
import api from "../../api/axios"

function formatDate(dateStr) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })
}

function MessageCard({ msg: initial }) {
    const [msg, setMsg]         = useState(initial)
    const [open, setOpen]       = useState(false)
    const [replying, setReplying] = useState(false)
    const [text, setText]       = useState("")
    const [status, setStatus]   = useState("idle")
    const [error, setError]     = useState("")

    async function handleSend(e) {
        e.preventDefault()
        setStatus("loading"); setError("")
        try {
            const res = await api.post(`/messages/${msg.id}/reply`, { reply_text: text }, { headers: authHeaders() })
            setMsg(prev => ({ ...prev, replies: [...prev.replies, res.data.reply] }))
            setText("")
            setReplying(false)
            setStatus("sent")
            setTimeout(() => setStatus("idle"), 3000)
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Failed to send reply")
            setStatus("idle")
        }
    }

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-[#1E3A8A] transition-colors">

            {/* ── Header ─────────────────────────────── */}
            <button
                onClick={() => { setOpen(v => !v); setReplying(false); setError("") }}
                className="w-full flex items-center justify-between gap-4 p-4 text-left bg-white"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate" style={{ color: "#1E3A8A" }}>{msg.name}</p>
                        {msg.replies.length > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#E0E7FF", color: "#1E3A8A" }}>
                                {msg.replies.length} {msg.replies.length === 1 ? "reply" : "replies"}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-xs text-gray-300 hidden sm:block">{formatDate(msg.created_at)}</p>
                    <span className="text-gray-300 text-sm">{open ? "▲" : "▼"}</span>
                </div>
            </button>

            {/* ── Expanded body ───────────────────────── */}
            {open && (
                <div className="bg-gray-50 border-t border-gray-100 px-4 pb-5 pt-4 flex flex-col gap-4">
                    <p className="text-xs text-gray-300 sm:hidden">{formatDate(msg.created_at)}</p>

                    {/* Original message */}
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                    {/* Saved replies */}
                    {msg.replies.length > 0 && (
                        <div className="flex flex-col gap-2 border-t border-gray-200 pt-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Your replies</p>
                            {msg.replies.map(r => (
                                <div
                                    key={r.id}
                                    className="rounded-lg px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-l-4"
                                    style={{ backgroundColor: "#EFF6FF", borderColor: "#1E3A8A" }}
                                >
                                    <p>{r.reply_text}</p>
                                    <p className="text-xs text-gray-400 mt-1">{formatDate(r.created_at)}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Sent confirmation */}
                    {status === "sent" && (
                        <p className="text-green-600 text-sm font-semibold">Reply sent to {msg.email}</p>
                    )}

                    {/* Reply toggle */}
                    {!replying && (
                        <button
                            onClick={() => setReplying(true)}
                            className="self-start px-5 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: "#1E3A8A" }}
                        >
                            Reply
                        </button>
                    )}

                    {/* Inline reply form */}
                    {replying && (
                        <form onSubmit={handleSend} className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1E3A8A" }}>
                                Replying to {msg.name} &lt;{msg.email}&gt;
                            </p>
                            <textarea
                                rows={5}
                                required
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder="Write your reply…"
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] resize-none"
                            />
                            {error && <p className="text-xs text-red-500">{error}</p>}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="px-6 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-60 hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#1E3A8A" }}
                                >
                                    {status === "loading" ? "Sending…" : "Send Reply"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setReplying(false); setError("") }}
                                    className="px-5 py-2 text-sm font-semibold border border-gray-200 rounded-lg text-gray-500 hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}

function MessagesPanel() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading]   = useState(true)
    const [error, setError]       = useState("")

    useEffect(() => {
        api.get("/messages/", { headers: authHeaders() })
            .then(r => setMessages(r.data))
            .catch(err => setError(err.response?.data?.detail || err.message || "Failed to load messages"))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                {loading ? "Loading…" : `${messages.length} message${messages.length !== 1 ? "s" : ""}`}
            </p>

            {error && (
                <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                    {error}
                </div>
            )}

            {!loading && messages.length === 0 && !error && (
                <div className="text-center py-16 text-gray-300 text-sm">No messages yet.</div>
            )}

            <div className="flex flex-col gap-3">
                {messages.map(msg => (
                    <MessageCard key={msg.id} msg={msg} />
                ))}
            </div>
        </div>
    )
}

export default MessagesPanel
