import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchAbout } from '../../services/about'
import bodeImg from '../../assets/bode.webp'

function Hero() {
  const dispatch = useAppDispatch()
  const { github_url, profile_picture } = useAppSelector(s => s.about)
  const [displaySrc, setDisplaySrc] = useState(bodeImg)

  useEffect(() => {
    dispatch(fetchAbout())
  }, [dispatch])

  useEffect(() => {
    if (!profile_picture) return
    const img = new Image()
    img.onload  = () => setDisplaySrc(profile_picture)
    img.onerror = () => setDisplaySrc(bodeImg)
    img.src = profile_picture
  }, [profile_picture])

  const socials = [
    { icon: 'fa-brands fa-github',    href: github_url || 'https://github.com/BodeMurairi2',       label: 'GitHub' },
    { icon: 'fa-brands fa-x-twitter', href: 'https://twitter.com/bodemurairi',                     label: 'X' },
    { icon: 'fa-brands fa-linkedin',  href: 'https://www.linkedin.com/in/bode-murairi-9b1a4b1b3/', label: 'LinkedIn' },
    { icon: 'fa-brands fa-slack',     href: 'https://slack.com',                                   label: 'Slack' },
    { icon: 'fa-regular fa-envelope', href: 'mailto:bodemurairi2@gmail.com',                       label: 'Email' },
    { icon: 'fa-brands fa-google',    href: 'mailto:bodemurairi2@gmail.com',                       label: 'Gmail' },
    { icon: 'fa-brands fa-discord',   href: 'https://discord.com',                                 label: 'Discord' },
    { icon: 'fa-brands fa-instagram', href: 'https://instagram.com/bodemurairi',                   label: 'Instagram' },
  ]

  return (
    <section className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 sm:px-10 lg:px-12 gap-8 lg:gap-4 py-16 lg:py-0">

      {/* Profile image */}
      <div className="flex-shrink-0">
        <div className="w-48 h-60 sm:w-56 sm:h-72 lg:w-64 lg:h-80 rounded-[50%] overflow-hidden border-4 border-blue-800 shadow-lg">
          <img
            src={displaySrc}
            alt="Bode Murairi"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-1 text-center lg:text-left max-w-md lg:pl-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wide leading-tight m-0" style={{ color: '#1E3A8A' }}>
          Bode Murai Murairi
        </h1>
        <p className="text-base lg:text-lg tracking-widest" style={{ color: '#1E3A8A' }}>
          Software Engineering &amp;&amp; AI Enthusiast
        </p>

        {/* Social links box */}
        <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 w-fit mt-3 mx-auto lg:mx-0">
          <p className="text-sm text-gray-500 mb-3">Find me on:</p>
          <div className="grid grid-cols-4 gap-3">
            {socials.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-800 transition-colors text-lg"
              >
                <i className={icon}></i>
              </a>
            ))}
          </div>
          <div className="mt-6 w-full h-[2px] bg-blue-800"></div>
        </div>
      </div>

    </section>
  )
}

export default Hero
