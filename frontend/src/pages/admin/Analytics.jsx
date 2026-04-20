import AdminNavbar from "../../components/admin/Navbar"
import AdminHero from "../../components/admin/AdminHero"
import AnalyticsStats from "../../components/admin/AnalyticsStats"
import Footer from "../../components/portfolio/footer"

function Analytics() {
    return (
        <div className="min-h-screen flex flex-col pt-[64px]">
            <AdminNavbar />
            <main className="flex-1">
                <AdminHero title="Analytics" subtitle="Track reads, likes and engagement across your articles" />
                <AnalyticsStats />
            </main>
            <Footer />
        </div>
    )
}

export default Analytics
