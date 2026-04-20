import { useState, useMemo, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks"
import { fetchArticles } from "../../services/articles"
import { fetchAbout } from "../../services/about"
import bodeImg from "../../assets/bode.webp"

const INITIAL_COUNT = 2
const PAGE_SIZE = 4

function formatDate(dateStr) {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function readTime(content) {
    if (!content) return ""
    const words = content.trim().split(/\s+/).length
    const mins = Math.max(1, Math.round(words / 200))
    return `${mins} min read`
}

function ArticleCard({ article }) {
    const description = article.subtitle || (article.content?.slice(0, 180) + "…")

    return (
        <div className="flex flex-col">
            {/* Image — always rendered; placeholder shown when no upload yet */}
            <div className="relative w-full mb-4">
                {article.image_url ? (
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-64 object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="w-full h-64 flex items-center justify-center"
                        style={{ backgroundColor: "#1E3A8A" }}
                    >
                        <span className="text-white text-4xl opacity-30">✦</span>
                    </div>
                )}
                <span
                    className="absolute bottom-3 right-3 text-white text-lg leading-none"
                    style={{ textShadow: "0 0 4px rgba(0,0,0,0.5)" }}
                >
                    ✦
                </span>
            </div>

            {/* View More sits between image and title, matching original design */}
            <a
                href={`/blog/${article.article_sys_id}`}
                className="self-start px-3 py-1.5 text-xs font-semibold text-white rounded mb-4"
                style={{ backgroundColor: "#1E3A8A" }}
            >
                View More
            </a>

            <h2
                className="text-xl font-bold mb-4 text-left leading-snug"
                style={{ color: "#1E3A8A" }}
            >
                {article.title}
            </h2>

            <p className="text-xs text-gray-400 mb-4 text-left">
                {formatDate(article.updated_at)}
                {article.content && ` · ${readTime(article.content)}`}
            </p>

            <p className="text-sm text-gray-500 text-left leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function Main() {
    const dispatch = useAppDispatch()
    const { items: articles, status } = useAppSelector((state) => state.articles)
    const { content: aboutText } = useAppSelector((state) => state.about)

    const [query, setQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
    const searchRef = useRef(null)

    useEffect(() => {
        if (status === 'idle') dispatch(fetchArticles())
    }, [dispatch, status])

    useEffect(() => {
        dispatch(fetchAbout())
    }, [dispatch])

    // Partial match on title and type
    const filtered = useMemo(() => {
        if (!query.trim()) return articles
        const q = query.toLowerCase()
        return articles.filter(
            a =>
                a.title.toLowerCase().includes(q) ||
                (a.type && a.type.toLowerCase().includes(q))
        )
    }, [query, articles])

    // Suggestions: unique matching titles + types
    const suggestions = useMemo(() => {
        if (!query.trim()) return []
        const q = query.toLowerCase()
        const hits = new Set()
        articles.forEach(a => {
            if (a.title.toLowerCase().includes(q)) hits.add(a.title)
            if (a.type && a.type.toLowerCase().includes(q)) hits.add(a.type)
        })
        return [...hits].slice(0, 6)
    }, [query, articles])

    const visible = filtered.slice(0, visibleCount)
    const hasMore = visibleCount < filtered.length

    // Reset visible count when search changes
    useEffect(() => {
        setVisibleCount(INITIAL_COUNT)
    }, [query])

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClick(e) {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    function handleSuggestionClick(suggestion) {
        setQuery(suggestion)
        setShowSuggestions(false)
    }

    return (
        <div>
            {/* Topics + Search */}
            <div className="flex flex-col items-center py-8">
                <h1 className="text-2xl font-bold mb-4" style={{ color: "#1E3A8A" }}>Topics</h1>
                <div className="relative w-64" ref={searchRef}>
                    <input
                        type="text"
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value)
                            setShowSuggestions(true)
                        }}
                        onFocus={() => query && setShowSuggestions(true)}
                        placeholder="Search topics"
                        className="w-full border border-[#1E3A8A] rounded-md px-3 py-2 text-sm pr-9 text-[#1E3A8A] placeholder-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#1E3A8A]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
                    </svg>

                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute top-full mt-1 w-full bg-white border border-[#1E3A8A] rounded-md shadow-lg z-10">
                            {suggestions.map((s, i) => (
                                <li
                                    key={i}
                                    onClick={() => handleSuggestionClick(s)}
                                    className="px-3 py-2 text-sm text-[#1E3A8A] hover:bg-blue-50 cursor-pointer"
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Article Cards */}
            {status === 'loading' && (
                <div className="flex justify-center py-16">
                    <p className="text-gray-400 text-sm">Loading articles…</p>
                </div>
            )}

            {status !== 'loading' && filtered.length === 0 && (
                <div className="flex justify-center py-16">
                    <p className="text-gray-400 text-sm">No articles found.</p>
                </div>
            )}

            {status !== 'loading' && visible.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10 pb-10">
                    {visible.map(article => (
                        <ArticleCard key={article.article_sys_id} article={article} />
                    ))}
                </div>
            )}

            {/* View More */}
            {hasMore && (
                <div className="flex justify-center py-10">
                    <button
                        onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                        className="px-16 py-3 text-white font-semibold rounded-full text-base tracking-wide"
                        style={{ backgroundColor: "#3D5A8A" }}
                    >
                        View More
                    </button>
                </div>
            )}

            {/* About Me */}
            <div className="px-6 sm:px-10 py-10 text-left">
                <h2 className="text-xl font-bold mb-4" style={{ color: "#1E3A8A" }}>
                    About Me
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                    <img
                        src={bodeImg}
                        alt="About Me"
                        className="w-full sm:w-48 h-48 sm:h-40 object-cover flex-shrink-0 rounded-sm"
                    />
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {aboutText || ""}
                        </p>
                        <a
                            href="/#contact"
                            className="self-start px-6 py-2 text-sm font-semibold text-white rounded-full"
                            style={{ backgroundColor: "#1E3A8A" }}
                        >
                            Connect with Me
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
