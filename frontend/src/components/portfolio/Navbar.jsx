import { useState } from 'react'

const links = [
    { label: 'Home',      href: '/#home' },
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Skills',    href: '/#skills' },
    { label: 'Contact',   href: '/#contact' },
    { label: 'Blog',      href: '/blog' },
]

function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 text-blue-900" style={{ backgroundColor: '#e5e7eb' }}>
            <div className="flex justify-between items-center px-6 sm:px-10 py-4">
                <a href="/" className="font-bold text-xl italic no-underline text-blue-900">Bode</a>

                {/* Desktop links */}
                <ul className="hidden md:flex gap-8 list-none m-0 p-0">
                    {links.map(({ label, href }) => (
                        <li key={label}>
                            <a
                                href={href}
                                className="no-underline text-blue-900 font-semibold italic hover:text-purple-600 transition-colors text-sm"
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-1"
                    onClick={() => setOpen(o => !o)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-blue-900 transition-transform duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-blue-900 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-blue-900 transition-transform duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-blue-100 px-6 py-4 flex flex-col gap-4" style={{ backgroundColor: '#e5e7eb' }}>
                    {links.map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="no-underline text-blue-900 font-semibold italic hover:text-purple-600 transition-colors text-sm"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    )
}

export default Navbar
