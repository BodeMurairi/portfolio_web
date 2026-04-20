import Navbar from "../components/portfolio/Navbar";
import Footer from "../components/portfolio/footer";
import Hero from "../components/blog/hero";
import Main from "../components/blog/main";

function Blog_home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <section id="header">
                    <Hero />
                </section>
                <section id="main">
                    <Main />
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default Blog_home
