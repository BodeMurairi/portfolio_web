
import { Link } from 'react-router-dom'

function Footer() {
    const socials = [
        { icon: 'fa-brands fa-instagram', href: 'https://instagram.com/bodemurairi' },
        { icon: 'fa-brands fa-linkedin',  href: 'https://www.linkedin.com/in/bode-murairi-9b1a4b1b3/' },
        { icon: 'fa-brands fa-facebook',  href: 'https://www.facebook.com/bodemurairi' },
        { icon: 'fa-brands fa-x-twitter', href: 'https://twitter.com/bodemurairi' },
    ]

    const links = [
        {
            title: 'Blog',
            items: [
                { label: 'Company',  to: '/blog', internal: true },
                { label: 'Career',   to: '/blog', internal: true },
                { label: 'Tech',     to: '/blog', internal: true },
                { label: 'Business', to: '/blog', internal: true },
            ],
        },
        {
            title: 'About',
            items: [
                { label: 'Contacts',   to: '/#contact',    internal: false },
                { label: 'About',      to: '/#about',      internal: false },
                { label: 'Experience', to: '/#experience', internal: false },
            ],
        },
        {
            title: 'Product',
            items: [
                { label: 'Terms of use',   to: '#',      internal: false },
                { label: 'Privacy policy', to: '#',      internal: false },
                { label: 'Log in',         to: '/login', internal: true  },
            ],
        },
    ]

    return (
        <footer className="mt-10 px-6 sm:px-12 py-8 sm:py-10" style={{ backgroundColor: '#e5e7eb' }}>
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">

                {/* Left — brand info */}
                <div className="flex flex-col gap-4 sm:w-52">
                    <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#1E3A8A' }}>
                        Bode Murairi
                    </p>
                    <div className="flex flex-col gap-1 mt-2">
                        <p className="text-xs" style={{ color: '#1E3A8A' }}>bodemurairi2@gmail.com</p>
                        <p className="text-xs" style={{ color: '#1E3A8A' }}>+250 795 020 998</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                        {socials.map(({ icon, href }) => (
                            <a
                                key={icon}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 flex items-center justify-center rounded border border-blue-200 hover:border-blue-800 transition-colors text-sm"
                                style={{ color: '#1E3A8A' }}
                            >
                                <i className={icon}></i>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right — link columns */}
                <div className="flex flex-wrap gap-10 sm:gap-16 sm:flex-1 sm:justify-end">
                    {links.map(({ title, items }) => (
                        <div key={title} className="flex flex-col gap-3">
                            <p className="font-semibold text-sm" style={{ color: '#1E3A8A' }}>{title}</p>
                            {items.map(({ label, to, internal }) => (
                                internal
                                    ? <Link
                                        key={label}
                                        to={to}
                                        onClick={() => window.scrollTo(0, 0)}
                                        className="text-xs no-underline hover:underline"
                                        style={{ color: '#1E3A8A' }}
                                      >
                                        {label}
                                      </Link>
                                    : <a
                                        key={label}
                                        href={to}
                                        className="text-xs no-underline hover:underline"
                                        style={{ color: '#1E3A8A' }}
                                      >
                                        {label}
                                      </a>
                            ))}
                        </div>
                    ))}
                </div>

            </div>
        </footer>
    )
}

export default Footer
