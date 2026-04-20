import { useState, useEffect } from "react"
import { authHeaders } from "../../utils/auth"
import api from "../../api/axios"

const PAGE_SIZE = 10

function formatDate(dateStr) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })
}

function StatCard({ label, value, icon, loading }) {
    return (
        <div className="flex flex-col gap-2 p-5 border border-gray-100 rounded-xl bg-gray-50">
            <div className="flex justify-between items-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
                <span className="text-lg">{icon}</span>
            </div>
            {loading
                ? <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
                : <p className="text-3xl font-bold" style={{ color: "#1E3A8A" }}>{value}</p>
            }
        </div>
    )
}

/* ── Single comment + nested replies ───────────────────────── */
function CommentItem({ comment, depth = 0 }) {
    const [showReplies, setShowReplies] = useState(true)

    return (
        <div className={depth > 0 ? "ml-8 border-l-2 border-gray-100 pl-4 mt-3" : "mt-4"}>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                        <span className="font-semibold text-sm" style={{ color: "#1E3A8A" }}>
                            {comment.author_name}
                        </span>
                        {comment.author_email && (
                            <span className="text-xs text-gray-400 ml-2">{comment.author_email}</span>
                        )}
                    </div>
                    <span className="text-xs text-gray-300 flex-shrink-0">{formatDate(comment.commented_at)}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                {comment.replies?.length > 0 && (
                    <button
                        onClick={() => setShowReplies(v => !v)}
                        className="mt-2 text-xs font-semibold hover:opacity-70 transition-opacity"
                        style={{ color: "#1E3A8A" }}
                    >
                        {showReplies ? "Hide" : "Show"} {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                    </button>
                )}
            </div>
            {showReplies && comment.replies?.map(reply => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
        </div>
    )
}

/* ── Inline comments panel ──────────────────────────────────── */
function CommentsPanel({ article, onClose }) {
    const [comments, setComments] = useState([])
    const [loading, setLoading]   = useState(true)
    const [error, setError]       = useState("")

    useEffect(() => {
        api.get(`/comments/${article.article_sys_id}`)
            .then(r => setComments(r.data))
            .catch(err => setError(err.response?.data?.detail || err.message || "Failed to load comments"))
            .finally(() => setLoading(false))
    }, [article.article_sys_id])

    const totalReplies = comments.reduce((n, c) => n + (c.replies?.length || 0), 0)
    const total = comments.length + totalReplies

    return (
        <div className="mt-2 border border-gray-100 rounded-xl bg-gray-50 p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="font-semibold text-sm" style={{ color: "#1E3A8A" }}>{article.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {loading ? "Loading…" : `${total} comment${total !== 1 ? "s" : ""} · ${comments.length} top-level · ${totalReplies} replies`}
                    </p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && comments.length === 0 && !error && (
                <p className="text-sm text-gray-300 text-center py-6">No comments yet.</p>
            )}

            <div className="flex flex-col">
                {comments.map(c => <CommentItem key={c.id} comment={c} />)}
            </div>
        </div>
    )
}

function AnalyticsStats() {
    const [data, setData]                   = useState(null)
    const [loading, setLoading]             = useState(true)
    const [error, setError]                 = useState("")
    const [page, setPage]                   = useState(1)
    const [commentSummary, setCommentSummary] = useState({ total_comments: 0, per_article: {} })
    const [viewingComments, setViewingComments] = useState(null)

    useEffect(() => {
        api.get('/articles_management/analytics', { headers: authHeaders() })
            .then(r => setData(r.data))
            .catch(err => setError(err.response?.data?.detail || err.message || "Failed to load analytics"))
            .finally(() => setLoading(false))

        api.get('/articles_management/comments/summary', { headers: authHeaders() })
            .then(r => setCommentSummary(r.data))
            .catch(() => {})
    }, [])

    const articles     = data?.articles     ?? []
    const totalPosts   = data?.total_posts  ?? 0
    const totalViews   = data?.total_views  ?? 0
    const totalLikes   = data?.total_likes  ?? 0
    const totalReads   = data?.total_reads  ?? 0

    const totalPages   = Math.max(1, Math.ceil(articles.length / PAGE_SIZE))
    const pageArticles = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return (
        <div>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <StatCard label="Total Posts"    value={totalPosts}  icon="📝" loading={loading} />
                <StatCard label="Total Views"    value={totalViews}  icon="👁"  loading={loading} />
                <StatCard label="Total Reads"    value={totalReads}  icon="📖" loading={loading} />
                <StatCard label="Total Likes"    value={totalLikes}  icon="👍" loading={loading} />
                <StatCard label="Total Comments" value={commentSummary.total_comments} icon="💬" loading={loading} />
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                    {error}
                </div>
            )}

            {/* Per-article table */}
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 mt-8">Per Article</p>

            {loading && (
                <div className="flex flex-col gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && articles.length === 0 && !error && (
                <div className="text-center py-10 text-gray-300 text-sm">No articles yet.</div>
            )}

            {!loading && articles.length > 0 && (
                <div className="flex flex-col gap-2">
                    {pageArticles.map(a => {
                        const commentCount = commentSummary.per_article[a.article_sys_id] ?? 0
                        const isViewing = viewingComments?.article_sys_id === a.article_sys_id
                        return (
                            <div key={a.article_sys_id}>
                                <div className={`flex justify-between items-center gap-4 p-4 border rounded-xl transition-colors ${isViewing ? "border-[#1E3A8A]" : "border-gray-100 hover:border-[#1E3A8A]"}`}>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold truncate" style={{ color: "#1E3A8A" }}>
                                            {a.title}
                                        </p>
                                        {a.type && (
                                            <p className="text-xs text-gray-400 mt-0.5">{a.type}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-shrink-0">
                                        <span title="Views">👁 {a.views_count}</span>
                                        <span title="Reads">📖 {a.read_count}</span>
                                        <span title="Likes">👍 {a.likes_count}</span>
                                        <button
                                            onClick={() => setViewingComments(isViewing ? null : a)}
                                            title="Comments"
                                            className="flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold hover:opacity-80 transition-opacity"
                                            style={{
                                                backgroundColor: commentCount > 0 ? "#E0E7FF" : "#f3f4f6",
                                                color: commentCount > 0 ? "#1E3A8A" : "#9ca3af",
                                            }}
                                        >
                                            💬 {commentCount}
                                        </button>
                                    </div>
                                </div>
                                {isViewing && (
                                    <CommentsPanel article={a} onClose={() => setViewingComments(null)} />
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-400 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-30 transition-colors"
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className="w-8 h-8 text-xs font-semibold rounded-lg border transition-colors"
                            style={
                                n === page
                                    ? { backgroundColor: "#1E3A8A", color: "#fff", borderColor: "#1E3A8A" }
                                    : { backgroundColor: "transparent", color: "#6b7280", borderColor: "#e5e7eb" }
                            }
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-400 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-30 transition-colors"
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    )
}

export default AnalyticsStats
