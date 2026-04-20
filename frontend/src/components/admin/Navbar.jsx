import { useNavigate } from "react-router-dom"
import { clearToken } from "../../utils/auth"

function AdminNavbar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        clearToken()
        navigate("/login")
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-10 py-4 text-blue-900" style={{ backgroundColor: "#e5e7eb" }}>
            <a href="/" className="font-bold text-xl italic no-underline text-blue-900">Bode</a>
            <ul className="flex gap-8 list-none m-0 p-0 items-center">
                <li>
                    <a href="/" className="no-underline text-blue-900 font-semibold italic hover:text-purple-600 transition-colors text-sm">
                        Home
                    </a>
                </li>
                <li>
                    <a href="/blog" className="no-underline text-blue-900 font-semibold italic hover:text-purple-600 transition-colors text-sm">
                        Blog
                    </a>
                </li>
                <li>
                    <button
                        onClick={handleLogout}
                        className="no-underline text-blue-900 font-semibold italic hover:text-purple-600 transition-colors text-sm bg-transparent border-none cursor-pointer p-0"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default AdminNavbar
