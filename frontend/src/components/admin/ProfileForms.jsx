import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks"
import { fetchAdminProfile, setProfilePicture, setAbout as setAboutStore, setGithub as setGithubStore } from "../../services/adminProfile"
import { authHeaders } from "../../utils/auth"
import bodeImg from "../../assets/bode.webp"
import api from "../../api/axios"

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-gray-50"
const btnCls   = "px-5 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-60 transition-opacity hover:opacity-90"
const cardCls  = "border border-gray-100 rounded-xl p-5 mb-5 flex flex-col gap-3 bg-gray-50"
const labelCls = "text-xs font-semibold uppercase tracking-widest"

function Toast({ message, type }) {
    if (!message) return null
    const bg = type === "error" ? "#FEE2E2" : "#E0E7FF"
    const color = type === "error" ? "#991B1B" : "#1E3A8A"
    return (
        <div className="mb-5 px-4 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: bg, color }}>
            {message}
        </div>
    )
}

function ProfileForms() {
    const dispatch = useAppDispatch()
    const { about: storedAbout, github_url: storedGithub, profile_picture, status } = useAppSelector(s => s.adminProfile)

    const [about, setAbout]             = useState("")
    const [github, setGithub]           = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [showOld, setShowOld]         = useState(false)
    const [showNew, setShowNew]         = useState(false)
    const [profileFile, setProfileFile] = useState(null)
    const [localPreview, setLocalPreview] = useState(null)   // blob URL from file picker
    const [displaySrc, setDisplaySrc]   = useState(bodeImg)  // what the <img> actually shows

    const [toast, setToast]   = useState({ message: "", type: "success" })
    const [loading, setLoading] = useState({
        about: false, github: false, password: false, picture: false
    })

    // Fetch profile once on mount
    useEffect(() => {
        if (status === "idle") dispatch(fetchAdminProfile())
    }, [dispatch, status])

    // Sync form fields from Redux store
    useEffect(() => {
        setAbout(storedAbout || "")
        setGithub(storedGithub || "")
    }, [storedAbout, storedGithub])

    // Pre-load the saved remote picture — swap only after it's fully downloaded
    useEffect(() => {
        if (localPreview) return          // user picked a new file; keep showing that
        if (!profile_picture) {
            setDisplaySrc(bodeImg)
            return
        }
        const img = new Image()
        img.onload  = () => setDisplaySrc(profile_picture)
        img.onerror = () => setDisplaySrc(bodeImg)
        img.src = profile_picture
    }, [profile_picture, localPreview])

    function notify(message, type = "success") {
        setToast({ message, type })
        setTimeout(() => setToast({ message: "", type: "success" }), 4000)
    }

    function setLoad(key, val) {
        setLoading(l => ({ ...l, [key]: val }))
    }

    // About
    async function handleAbout(e) {
        e.preventDefault()
        setLoad("about", true)
        try {
            const res = await api.put("/auth/update/about", { about }, { headers: authHeaders() })
            dispatch(setAboutStore(about))
            notify(res.data.message)
        } catch (err) {
            notify(err.response?.data?.detail || err.message || "Failed to update about", "error")
        } finally {
            setLoad("about", false)
        }
    }

    // GitHub
    async function handleGithub(e) {
        e.preventDefault()
        setLoad("github", true)
        try {
            const res = await api.put("/auth/update/github", { github_link: github }, { headers: authHeaders() })
            dispatch(setGithubStore(github))
            notify(res.data.message)
        } catch (err) {
            notify(err.response?.data?.detail || err.message || "Failed to update GitHub link", "error")
        } finally {
            setLoad("github", false)
        }
    }

    // Password
    async function handlePassword(e) {
        e.preventDefault()
        setLoad("password", true)
        try {
            const res = await api.put("/auth/update/password", { old_password: oldPassword, new_password: newPassword }, { headers: authHeaders() })
            notify(res.data.message)
            setOldPassword("")
            setNewPassword("")
        } catch (err) {
            notify(err.response?.data?.detail || err.message || "Failed to change password", "error")
        } finally {
            setLoad("password", false)
        }
    }

    // Profile picture — show local blob preview instantly
    function handleFileChange(e) {
        const file = e.target.files[0]
        if (!file) return
        setProfileFile(file)
        if (localPreview) URL.revokeObjectURL(localPreview)
        const objectUrl = URL.createObjectURL(file)
        setLocalPreview(objectUrl)
        setDisplaySrc(objectUrl)
    }

    async function handlePicture(e) {
        e.preventDefault()
        if (!profileFile) return
        setLoad("picture", true)
        try {
            const formData = new FormData()
            formData.append("image", profileFile)
            const res = await api.post("/auth/update/profile-picture", formData, { headers: authHeaders() })
            dispatch(setProfilePicture(res.data.profile_picture))
            setProfileFile(null)
            if (localPreview) URL.revokeObjectURL(localPreview)
            setLocalPreview(null)
            notify(res.data.message)
        } catch (err) {
            notify(err.response?.data?.detail || err.message || "Upload failed", "error")
        } finally {
            setLoad("picture", false)
        }
    }

    return (
        <div className="max-w-lg">
            <Toast message={toast.message} type={toast.type} />

            {/* Profile Picture */}
            <form onSubmit={handlePicture} className={cardCls}>
                <p className={labelCls} style={{ color: "#1E3A8A" }}>Profile Picture</p>
                <img
                    src={displaySrc}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#1E3A8A]"
                    onError={e => { e.currentTarget.src = bodeImg }}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm text-gray-500"
                />
                <button
                    type="submit"
                    disabled={!profileFile || loading.picture}
                    className={btnCls}
                    style={{ backgroundColor: "#1E3A8A" }}
                >
                    {loading.picture ? "Uploading…" : "Upload"}
                </button>
            </form>

            {/* About */}
            <form onSubmit={handleAbout} className={cardCls}>
                <p className={labelCls} style={{ color: "#1E3A8A" }}>About</p>
                <textarea
                    rows={4}
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                    placeholder="Tell us about yourself…"
                    className={`${inputCls} resize-none`}
                />
                <button
                    type="submit"
                    disabled={loading.about}
                    className={btnCls}
                    style={{ backgroundColor: "#1E3A8A" }}
                >
                    {loading.about ? "Saving…" : "Save"}
                </button>
            </form>

            {/* GitHub */}
            <form onSubmit={handleGithub} className={cardCls}>
                <p className={labelCls} style={{ color: "#1E3A8A" }}>GitHub Link</p>
                <input
                    type="url"
                    value={github}
                    onChange={e => setGithub(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className={inputCls}
                />
                <button
                    type="submit"
                    disabled={loading.github}
                    className={btnCls}
                    style={{ backgroundColor: "#1E3A8A" }}
                >
                    {loading.github ? "Saving…" : "Save"}
                </button>
            </form>

            {/* Change Password */}
            <form onSubmit={handlePassword} className={cardCls}>
                <p className={labelCls} style={{ color: "#1E3A8A" }}>Change Password</p>

                <div className="relative">
                    <input
                        type={showOld ? "text" : "password"}
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        placeholder="Current password"
                        required
                        className={`${inputCls} pr-10`}
                    />
                    <button type="button" onClick={() => setShowOld(v => !v)} tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E3A8A] transition-colors">
                        {showOld ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="relative">
                    <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="New password (min 8 chars)"
                        required
                        minLength={8}
                        className={`${inputCls} pr-10`}
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)} tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E3A8A] transition-colors">
                        {showNew ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        )}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading.password}
                    className={btnCls}
                    style={{ backgroundColor: "#1E3A8A" }}
                >
                    {loading.password ? "Changing…" : "Change Password"}
                </button>
            </form>
        </div>
    )
}

export default ProfileForms
