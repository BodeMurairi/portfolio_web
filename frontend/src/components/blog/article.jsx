import { useState, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks"
import { fetchArticles } from "../../services/articles"
import frame5 from "../../assets/blog/frame5.webp"
import api from "../../api/axios"

function formatDate(dateStr) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric"
    })
}

function readTime(content) {
    if (!content) return ""
    const mins = Math.max(1, Math.round(content.trim().split(/\s+/).length / 200))
    return `${mins} min read`
}

function Avatar({ name, size = 10 }) {
    const colors = ["#1E3A8A", "#1d4ed8", "#0f766e", "#7c3aed", "#b91c1c", "#0369a1"]
    const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length]
    return (
        <div
            className={`w-${size} h-${size} rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold`}
            style={{ backgroundColor: color, fontSize: size >= 10 ? "1rem" : "0.7rem" }}
        >
            {name?.[0]?.toUpperCase() ?? "?"}
        </div>
    )
}

/* ─── Comment form ─────────────────────────────────────────── */
function CommentForm({ onSubmit, placeholder = "Share your thoughts…", submitLabel = "Post Comment", compact = false }) {
    const [form, setForm] = useState({ author_name: "", author_email: "", content: "" })
    const [focused, setFocused] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        if (!form.author_name.trim() || !form.content.trim()) return
        onSubmit(form)
        setForm({ author_name: "", author_email: "", content: "" })
        setFocused(false)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {(focused || compact) && (
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        required
                        value={form.author_name}
                        onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                        placeholder="Your name *"
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                    />
                    <input
                        value={form.author_email}
                        onChange={e => setForm(f => ({ ...f, author_email: e.target.value }))}
                        placeholder="Email (optional)"
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                    />
                </div>
            )}
            <textarea
                required
                value={form.content}
                onFocus={() => setFocused(true)}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={focused || compact ? 4 : 2}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent resize-none transition-all"
            />
            {(focused || compact) && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Be kind and constructive.</p>
                    <button
                        type="submit"
                        className="px-6 py-2.5 text-sm font-semibold rounded-lg text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: "#1E3A8A" }}
                    >
                        {submitLabel}
                    </button>
                </div>
            )}
        </form>
    )
}

/* ─── Single comment ───────────────────────────────────────── */
function CommentItem({ comment, articleSysId, onReload, depth = 0 }) {
    const [showReply, setShowReply] = useState(false)

    async function submitReply(form) {
        await api.post(`/comments/${articleSysId}`, { ...form, parent_id: comment.id })
        setShowReply(false)
        onReload()
    }

    return (
        <div className={depth > 0 ? "mt-4 ml-12 pl-4 border-l-2 border-gray-100" : "mt-6"}>
            <div className="flex gap-3">
                <Avatar name={comment.author_name} size={depth > 0 ? 8 : 10} />
                <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-800">{comment.author_name}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-400">{formatDate(comment.commented_at)}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 px-1">
                        <button
                            onClick={() => setShowReply(v => !v)}
                            className="text-xs font-semibold text-gray-400 hover:text-[#1E3A8A] transition-colors flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            {showReply ? "Cancel" : "Reply"}
                        </button>
                    </div>
                    {showReply && (
                        <div className="mt-3">
                            <CommentForm
                                onSubmit={submitReply}
                                placeholder={`Reply to ${comment.author_name}…`}
                                submitLabel="Reply"
                                compact
                            />
                        </div>
                    )}
                    {comment.replies?.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            articleSysId={articleSysId}
                            onReload={onReload}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ─── Popular topics with pagination ──────────────────────── */
function PopularTopicsList({ topics }) {
    const PAGE = 3
    const [visible, setVisible] = useState(PAGE)
    const filtered = topics.filter(t => t.type && t.type !== "N/A")
    const shown = filtered.slice(0, visible)
    const hasMore = visible < filtered.length

    return (
        <div className="w-full lg:w-44 flex-shrink-0">
            <h2 className="text-xl font-bold mb-6" style={{ color: "#1E3A8A" }}>
                Popular Topics
            </h2>
            <div className="flex flex-col gap-3">
                {shown.map(topic => (
                    <a
                        key={topic.type}
                        href={`/blog/topics/${encodeURIComponent(topic.type)}`}
                        className="px-5 py-2.5 rounded-full text-sm font-semibold text-center no-underline transition-opacity hover:opacity-80"
                        style={{ backgroundColor: "#C7D2FE", color: "#1E3A8A" }}
                    >
                        {topic.type}
                    </a>
                ))}
                {hasMore && (
                    <button
                        onClick={() => setVisible(v => v + PAGE)}
                        className="px-5 py-2.5 rounded-full text-sm font-semibold text-center border-2 transition-colors hover:bg-blue-50"
                        style={{ borderColor: "#C7D2FE", color: "#1E3A8A" }}
                    >
                        View More
                    </button>
                )}
            </div>
        </div>
    )
}

/* ─── Main article component ───────────────────────────────── */
function ArticleComponent({ article }) {
    const dispatch = useAppDispatch()
    const { items: allArticles, status } = useAppSelector(s => s.articles)

    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [comments, setComments] = useState([])
    const [popularTopics, setPopularTopics] = useState([])

    useEffect(() => {
        if (status === "idle") dispatch(fetchArticles())
    }, [dispatch, status])

    useEffect(() => {
        api.get(`/articles/${article.article_sys_id}/stats`)
            .then(r => setLikes(r.data.likes_count))
            .catch(() => {})
    }, [article.article_sys_id])

    useEffect(() => {
        api.put(`/articles/articles_stat/view_count?article_id=${article.article_sys_id}`)
            .catch(() => {})
    }, [article.article_sys_id])

    const loadComments = useCallback(() => {
        api.get(`/comments/${article.article_sys_id}`)
            .then(r => setComments(Array.isArray(r.data) ? r.data : []))
            .catch(() => setComments([]))
    }, [article.article_sys_id])

    useEffect(() => { loadComments() }, [loadComments])

    useEffect(() => {
        api.get('/articles/topics/popular')
            .then(r => setPopularTopics(Array.isArray(r.data) ? r.data : []))
            .catch(() => {})
    }, [])

    async function handleLike() {
        if (liked) return
        setLiked(true)
        setLikes(n => n + 1)
        try {
            await api.put(`/articles/articles_stat/likes_count?article_id=${article.article_sys_id}`)
        } catch {
            setLiked(false)
            setLikes(n => n - 1)
        }
    }

    async function handleDownload() {
        setDownloading(true)
        try {
            const res = await api.get(`/articles/${article.article_sys_id}/download`, { responseType: "blob" })
            const url = URL.createObjectURL(res.data)
            const a = document.createElement("a")
            a.href = url
            a.download = `${article.title}.pdf`
            a.click()
            URL.revokeObjectURL(url)
        } catch {
            alert("Download failed. Please try again.")
        } finally {
            setDownloading(false)
        }
    }

    async function submitComment(form) {
        await api.post(`/comments/${article.article_sys_id}`, { ...form, parent_id: null })
        loadComments()
    }

    const latestArticles = allArticles
        .filter(a => a.article_sys_id !== article.article_sys_id)
        .slice(0, 3)

    // Strip news-API truncation marker "[+N chars]" and capture remainder flag
    const rawContent = article.content || ""
    const truncationMatch = rawContent.match(/\[?\+\d+\s*chars?\]?/i)
    const cleanContent = rawContent.replace(/\[?\+\d+\s*chars?\]?/gi, "").trim()
    const isTruncated = !!truncationMatch && !!article.article_source

    const paragraphs = cleanContent.split(/\n+/).filter(p => p.trim())
    const heroBg = article.image_url || frame5

    return (
        <div className="bg-white">

            {/* ── Hero: clean image, no text ──────────────── */}
            <div
                className="w-full"
                style={{
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "440px",
                }}
            />

            {/* ── Article title block (below image) ────────── */}
            <div className="max-w-3xl mx-auto px-6 pt-12 pb-8 text-center">
                {/* Title first */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-5" style={{ color: "#1E3A8A" }}>
                    {article.title}
                </h1>

                {/* Author · date · type — all centered below title */}
                <div className="flex items-center justify-center flex-wrap gap-4 mb-5">
                    <div className="flex items-center gap-2">
                        <Avatar name={article.author_name} size={8} />
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold text-gray-700">{article.author_name}</span>
                            <span className="text-xs text-gray-400">
                                {formatDate(article.updated_at)}
                                {article.content && ` · ${readTime(article.content)}`}
                            </span>
                        </div>
                    </div>
                    {article.type && article.type !== "N/A" && (
                        <>
                            <span className="text-gray-300">·</span>
                            <span
                                className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full text-white"
                                style={{ backgroundColor: "#1E3A8A" }}
                            >
                                {article.type}
                            </span>
                        </>
                    )}
                </div>

                {article.subtitle && (
                    <p className="text-lg text-gray-500 leading-relaxed">{article.subtitle}</p>
                )}
            </div>

            {/* ── Divider ───────────────────────────────────── */}
            <div className="max-w-3xl mx-auto px-6">
                <hr className="border-gray-100" />
            </div>

            {/* ── Article body ──────────────────────────────── */}
            <div className="max-w-2xl mx-auto px-6 py-10">
                {article.headline && article.headline !== "N/A" && (
                    <blockquote
                        className="mb-8 pl-5 text-lg font-medium text-gray-700 leading-relaxed italic"
                        style={{ borderLeft: "4px solid #1E3A8A" }}
                    >
                        {article.headline}
                    </blockquote>
                )}
                {paragraphs.map((para, i) => (
                    <p key={i} className="text-base text-gray-700 leading-8 mb-5">{para}</p>
                ))}
                {isTruncated && (
                    <a
                        href={article.article_source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-2 text-sm font-semibold hover:underline"
                        style={{ color: "#1E3A8A" }}
                    >
                        Read full article
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                )}
            </div>

            {/* ── Like + Download row ───────────────────────── */}
            <div className="border-t border-b border-gray-100 py-8">
                <div className="max-w-2xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4">
                    {/* Like button */}
                    <button
                        onClick={handleLike}
                        disabled={liked}
                        className={`flex items-center gap-2.5 px-7 py-2.5 rounded-full border-2 font-semibold text-sm transition-all ${
                            liked
                                ? "border-[#1E3A8A] text-[#1E3A8A] bg-blue-50 cursor-default"
                                : "border-gray-200 text-gray-500 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:bg-blue-50"
                        }`}
                    >
                        <span className="text-lg">👍</span>
                        <span>{likes} {likes === 1 ? "like" : "likes"}</span>
                    </button>

                    {/* Download button */}
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex items-center gap-2.5 px-7 py-2.5 rounded-full border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:bg-blue-50 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>{downloading ? "Generating…" : "Download PDF"}</span>
                    </button>
                </div>
            </div>

            {/* ── Comments ──────────────────────────────────── */}
            <div className="max-w-2xl mx-auto px-6 py-12">
                <h2 className="text-xl font-bold mb-1" style={{ color: "#1E3A8A" }}>Discussion</h2>
                <p className="text-sm text-gray-400 mb-8">
                    {comments.length === 0
                        ? "Be the first to share your thoughts."
                        : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
                </p>

                {/* New comment form */}
                <div className="bg-gray-50 rounded-2xl p-5 mb-8">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Join the conversation</p>
                    <CommentForm onSubmit={submitComment} />
                </div>

                {comments.length > 0 && <div className="border-t border-gray-100 mb-2" />}

                {comments.map(c => (
                    <CommentItem
                        key={c.id}
                        comment={c}
                        articleSysId={article.article_sys_id}
                        onReload={loadComments}
                    />
                ))}
            </div>

            {/* ── Latest Articles + Popular Topics ──────────── */}
            <div className="bg-white border-t border-gray-100">
                <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12">
                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* Left: Latest Articles — 3-column card grid */}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-6" style={{ color: "#1E3A8A" }}>
                                Latest Articles
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {latestArticles.map(a => (
                                    <a
                                        key={a.article_sys_id}
                                        href={`/blog/${a.article_sys_id}`}
                                        className="flex flex-col no-underline group"
                                    >
                                        {/* Thumbnail */}
                                        {a.image_url ? (
                                            <img
                                                src={a.image_url}
                                                alt={a.title}
                                                className="w-full h-28 object-cover rounded-sm mb-3"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-28 rounded-sm mb-3 flex items-center justify-center"
                                                style={{ backgroundColor: "#E0E7FF" }}
                                            >
                                                <span className="text-[#1E3A8A] opacity-30 text-2xl">✦</span>
                                            </div>
                                        )}

                                        {/* Title */}
                                        <p
                                            className="text-sm font-bold leading-snug mb-2 group-hover:underline"
                                            style={{ color: "#1E3A8A" }}
                                        >
                                            {a.title}
                                        </p>

                                        {/* Description */}
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            {a.subtitle || a.content?.slice(0, 80) + "…"}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px bg-gray-100 self-stretch" />

                        {/* Right: Popular Topics — paginated pills */}
                        <PopularTopicsList topics={popularTopics} />

                    </div>
                </div>
            </div>

        </div>
    )
}

export default ArticleComponent
