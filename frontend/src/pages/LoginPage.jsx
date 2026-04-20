import Navbar from "../components/login/nav";
import Login from "../components/login/login";
import Footer from "../components/portfolio/footer";

function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <section id="login">
                    <Login />
                </section>    
            </main>
            <Footer />

        </div>
    )
}
export default LoginPage
