import AdminNavbar from "../../components/admin/Navbar"
import AdminHero from "../../components/admin/AdminHero"
import CVTabs from "../../components/admin/CVTabs"
import Footer from "../../components/portfolio/footer"

function EditCV() {
    return (
        <div className="min-h-screen flex flex-col pt-[64px]">
            <AdminNavbar />
            <main className="flex-1">
                <AdminHero title="Edit CV" subtitle="Manage your education, experience, skills, certificates and projects" />
                <CVTabs />
            </main>
            <Footer />
        </div>
    )
}

export default EditCV
