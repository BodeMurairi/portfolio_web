import Navbar from '../components/portfolio/Navbar'
import Hero from '../components/portfolio/hero'
import About from '../components/portfolio/about'
import Experience from '../components/portfolio/experience'
import Portfolio from '../components/portfolio/portfolio'
import Skills from '../components/portfolio/skills'
import Contact from '../components/portfolio/contact'
import Footer from '../components/portfolio/footer'

function PortfolioPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-[64px]">
                <section id="home">
                    <Hero />
                </section>
                <section id="about">
                    <About />
                </section>
                <section id="experience">
                    <Experience />
                </section>
                <section id="portfolio">
                    <Portfolio />
                </section>
                <section id="skills">
                    <Skills />
                </section>
                <section id="contact">
                    <Contact />
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default PortfolioPage
