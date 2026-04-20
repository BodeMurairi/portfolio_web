import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/portfolio/Navbar"
import Footer from "../components/portfolio/footer"
import ArticleComponent from "../components/blog/article"
import api from "../api/axios"

function Article() {
    const { id } = useParams()
    const [article, setArticle] = useState(null)
    const [status, setStatus] = useState("loading")

    useEffect(() => {
        setStatus("loading")
        api.get(`/articles/${id}`)
            .then(res => {
                setArticle(res.data)
                setStatus("success")
            })
            .catch(() => setStatus("error"))
    }, [id])

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {status === "loading" && (
                    <div className="flex items-center justify-center py-32">
                        <p className="text-gray-400 text-sm">Loading article…</p>
                    </div>
                )}
                {status === "error" && (
                    <div className="flex items-center justify-center py-32">
                        <p className="text-gray-500">Article not found.</p>
                    </div>
                )}
                {status === "success" && article && (
                    <ArticleComponent article={article} />
                )}
            </main>
            <Footer />
        </div>
    )
}

export default Article
