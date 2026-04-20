import { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks"
import { fetchArticles } from "../services/articles"
import { fetchAbout } from "../services/about.jsx"
import Navbar from "../components/portfolio/Navbar"
import Footer from "../components/portfolio/footer"
import bodeImg from "../assets/bode.webp"
import heroBg from "../assets/blog/hero-bg.webp"
import api from "../api/axios"
const PAGE_SIZE = 4

function formatDate(dateStr) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    })
}

function readTime(content) {
    if (!content) return ""
    const words = content.trim().split(/\s+/).length
    return `${Math.max(1, Math.round(words / 200))} min read`
}

/* ── Article card — same structure as blog home ──────────── */
function ArticleCard({ article }) {
    const description = article.subtitle || (article.content?.slice(0, 180) + "…")

    return (
        <div className="flex flex-col">
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

/* ── Featured hero — clean background image, no text ─────── */
function TopicHero({ article }) {
    const bg = article?.image_url || heroBg

    return (
        <div
            className="w-full"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "380px",
            }}
        />
    )
}

/* ── Popular topics pill list ────────────────────────────── */
function PopularTopics({ topics, currentType }) {
    const [visible, setVisible] = useState(4)
    const filtered = topics.filter(t => t.type && t.type !== "N/A")
    const shown = filtered.slice(0, visible)
    const hasMore = visible < filtered.length

    return (
        <div className="w-full lg:w-44 flex-shrink-0">
            <h2 className="text-lg font-bold mb-5" style={{ color: "#1E3A8A" }}>
                Popular Topics
            </h2>
            <div className="flex flex-col gap-3">
                {shown.map(t => (
                    <a
                        key={t.type}
                        href={`/blog/topics/${encodeURIComponent(t.type)}`}
                        className="px-5 py-2.5 rounded-full text-sm font-semibold text-center no-underline transition-opacity hover:opacity-80"
                        style={{
                            backgroundColor: t.type === currentType ? "#1E3A8A" : "#C7D2FE",
                            color: t.type === currentType ? "#ffffff" : "#1E3A8A",
                        }}
                    >
                        {t.type}
                    </a>
                ))}
                {hasMore && (
                    <button
                        onClick={() => setVisible(v => v + 4)}
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

/* ── Main TopicPage ──────────────────────────────────────── */
function TopicPage() {
    const { type } = useParams()
    const dispatch = useAppDispatch()
    const { items: allArticles, status } = useAppSelector(s => s.articles)
    const { content: aboutText } = useAppSelector(s => s.about)

    const [popularTopics, setPopularTopics] = useState([])
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    useEffect(() => {
        if (status === "idle") dispatch(fetchArticles())
        dispatch(fetchAbout())
    }, [dispatch, status])

    useEffect(() => {
        api.get('/articles/topics/popular')
            .then(r => setPopularTopics(Array.isArray(r.data) ? r.data : []))
            .catch(() => {})
    }, [])

    // Reset pagination when topic changes
    useEffect(() => {
        setVisibleCount(PAGE_SIZE)
    }, [type])

    const topicArticles = useMemo(
        () => allArticles.filter(a => a.type === type),
        [allArticles, type]
    )

    const featuredArticle = topicArticles[0] || null
    // Grid shows all articles (including featured) paginated
    const gridArticles = topicArticles.slice(0, visibleCount)
    const hasMore = visibleCount < topicArticles.length

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1">
                {/* ── Hero with featured article ─────────── */}
                <TopicHero article={featuredArticle} />

                {/* ── Articles grid + Popular Topics ──────── */}
                <div className="max-w-6xl mx-auto px-4 sm:px-10 py-12">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Left: article cards */}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-8" style={{ color: "#1E3A8A" }}>
                                Articles in <span className="italic">{type}</span>
                            </h2>

                            {status === "loading" && (
                                <p className="text-gray-400 text-sm py-10 text-center">Loading articles…</p>
                            )}

                            {status !== "loading" && topicArticles.length === 0 && (
                                <p className="text-gray-400 text-sm py-10 text-center">
                                    No articles found for this topic.
                                </p>
                            )}

                            {gridArticles.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {gridArticles.map(article => (
                                        <ArticleCard key={article.article_sys_id} article={article} />
                                    ))}
                                </div>
                            )}

                            {hasMore && (
                                <div className="flex justify-center pt-10">
                                    <button
                                        onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                                        className="px-16 py-3 text-white font-semibold rounded-full text-base tracking-wide"
                                        style={{ backgroundColor: "#3D5A8A" }}
                                    >
                                        View More
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="w-px bg-gray-100 self-stretch hidden lg:block" />

                        {/* Right: Popular Topics */}
                        <PopularTopics topics={popularTopics} currentType={type} />
                    </div>
                </div>

                {/* ── About Me ─────────────────────────────── */}
                <div className="border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-10 py-10 text-left">
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
            </main>

            <Footer />
        </div>
    )
}

export default TopicPage
