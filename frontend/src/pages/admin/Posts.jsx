import AdminNavbar from "../../components/admin/Navbar"
import AdminHero from "../../components/admin/AdminHero"
import PostsManager from "../../components/admin/PostsManager"
import Footer from "../../components/portfolio/footer"

function Posts() {
    return (
        <div className="min-h-screen flex flex-col pt-[64px]">
            <AdminNavbar />
            <main className="flex-1">
                <AdminHero title="Posts" subtitle="Create, edit and delete your blog articles" />
                <PostsManager />
            </main>
            <Footer />
        </div>
    )
}

export default Posts
