import AdminNavbar from "../../components/admin/Navbar"
import AdminHero from "../../components/admin/AdminHero"
import ProfileForms from "../../components/admin/ProfileForms"
import Footer from "../../components/portfolio/footer"

function EditProfile() {
    return (
        <div className="min-h-screen flex flex-col">
            <AdminNavbar />
            <main className="flex-1">
                <AdminHero title="Edit Profile" subtitle="Update your profile picture, bio, links and password" />
                <ProfileForms />
            </main>
            <Footer />
        </div>
    )
}

export default EditProfile
