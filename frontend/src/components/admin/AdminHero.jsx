import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks"
import { fetchAdminProfile } from "../../services/adminProfile"
import heroBg from "../../assets/blog/hero-bg.webp"
import bodeImg from "../../assets/bode.webp"

function AdminHero() {
    const dispatch = useAppDispatch()
    const { first_name, last_name, profile_picture, status } = useAppSelector(s => s.adminProfile)
    const [displaySrc, setDisplaySrc] = useState(bodeImg)

    useEffect(() => {
        if (status === "idle") dispatch(fetchAdminProfile())
    }, [dispatch, status])

    // Pre-load the remote image — only swap src once fully downloaded
    useEffect(() => {
        if (!profile_picture) return
        const img = new Image()
        img.onload  = () => setDisplaySrc(profile_picture)
        img.onerror = () => setDisplaySrc(bodeImg)
        img.src = profile_picture
    }, [profile_picture])

    const name = `${first_name} ${last_name}`.trim()

    return (
        <div
            className="w-full relative flex items-end px-4 sm:px-10 py-8"
            style={{
                backgroundImage: `url(${heroBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "200px",
            }}
        >
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(10,20,60,0.45)" }} />

            <div className="relative z-10 flex items-center gap-4">
                <img
                    src={displaySrc}
                    alt={name || "Admin"}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={e => { e.currentTarget.src = bodeImg }}
                />
                <div>
                    {name && (
                        <p className="text-white font-bold text-lg leading-tight">{name}</p>
                    )}
                    <p className="text-blue-200 text-sm">Administrator</p>
                </div>
            </div>

            <div className="relative z-10 ml-auto hidden sm:block">
                <p className="text-white text-3xl font-light tracking-widest opacity-60">
                    W e l c o m e
                </p>
            </div>
        </div>
    )
}

export default AdminHero
