import { useState } from "react"
import AdminNavbar from "../../components/admin/Navbar"
import AdminHero from "../../components/admin/AdminHero"
import DashboardMenu from "../../components/admin/DashboardMenu"
import ProfileForms from "../../components/admin/ProfileForms"
import PostsManager from "../../components/admin/PostsManager"
import AnalyticsStats from "../../components/admin/AnalyticsStats"
import CVTabs from "../../components/admin/CVTabs"
import MessagesPanel from "../../components/admin/MessagesPanel"
import Footer from "../../components/portfolio/footer"

const panels = {
    profile:   { title: "Edit Profile",   component: <ProfileForms /> },
    posts:     { title: "Posts",           component: <PostsManager /> },
    analytics: { title: "Analytics",       component: <AnalyticsStats /> },
    cv:        { title: "Edit CV",         component: <CVTabs /> },
    messages:  { title: "Messages",        component: <MessagesPanel /> },
}

function Dashboard() {
    const [active, setActive] = useState("profile")

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fc" }}>
            <AdminNavbar />
            <AdminHero />

            <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8">
                <div className="flex flex-col lg:flex-row gap-6 items-start max-w-6xl mx-auto">

                    {/* Sidebar */}
                    <aside className="w-full lg:w-52 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <DashboardMenu active={active} onSelect={setActive} />
                    </aside>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8">
                        <h1 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 text-left" style={{ color: "#1E3A8A" }}>
                            {panels[active].title}
                        </h1>
                        {panels[active].component}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Dashboard
