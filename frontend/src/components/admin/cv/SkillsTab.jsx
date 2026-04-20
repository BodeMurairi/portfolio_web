import { useState, useEffect } from "react"
import { SaveButton, SectionHeader } from "../FormFields"
import { authHeaders } from "../../../utils/auth"
import Spinner from "../../Spinner"
import api from "../../../api/axios"

const empty = { skill_name: "", is_certificate_available: false }

function SkillsTab() {
    const [items, setItems]       = useState([])
    const [loading, setLoading]   = useState(true)
    const [show, setShow]         = useState(false)
    const [editing, setEditing]   = useState(null)
    const [form, setForm]         = useState(empty)
    const [saving, setSaving]     = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [error, setError]       = useState("")

    useEffect(() => { load() }, [])

    async function load() {
        setLoading(true)
        try {
            const res = await api.get('/skills/')
            setItems(res.data)
        } catch (err) { setError(err.response?.data?.detail || err.message || "Failed to fetch skills") }
        finally { setLoading(false) }
    }

    function openEdit(item) {
        setForm({ skill_name: item.skill_name, is_certificate_available: item.is_certificate_available })
        setEditing(item.skill_id)
        setError(""); setShow(true)
    }

    function cancel() {
        setShow(false); setEditing(null); setForm(empty); setError("")
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true); setError("")
        try {
            const url    = editing ? `/skill-management/update/${editing}` : '/skill-management/create'
            const method = editing ? "put" : "post"
            const res = await api[method](url, form, { headers: authHeaders() })
            if (!res.data) throw new Error("Save failed")
            await load(); cancel()
        } catch (err) {
            const detail = err.response?.data?.detail
            setError(typeof detail === "string" ? detail : JSON.stringify(detail) || err.message || "Save failed")
        }
        finally { setSaving(false) }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this skill?")) return
        setDeleting(id)
        try {
            await api.delete(`/skill-management/delete/${id}`, { headers: authHeaders() })
            await load()
        } catch (err) { setError(err.response?.data?.detail || err.message || "Delete failed") }
        finally { setDeleting(null) }
    }

    return (
        <div className="max-w-2xl">
            <SectionHeader title="Skills" showForm={show} onToggle={() => { setForm(empty); setEditing(null); setShow(!show) }} />

            {error && <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>{error}</div>}

            {show && (
                <form onSubmit={handleSubmit} className="border border-gray-100 rounded-xl p-6 bg-gray-50 flex flex-col gap-4 mb-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">Skill Name *</label>
                        <input
                            required
                            value={form.skill_name}
                            onChange={e => setForm(f => ({ ...f, skill_name: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[#1E3A8A] cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.is_certificate_available}
                            onChange={e => setForm(f => ({ ...f, is_certificate_available: e.target.checked }))}
                        />
                        Certificate available
                    </label>
                    <SaveButton loading={saving} editing={!!editing} />
                </form>
            )}

            {loading ? <Spinner /> : (
                <div className="flex flex-wrap gap-2">
                    {items.length === 0 && <p className="text-sm text-gray-400 w-full text-center py-6">No skills yet.</p>}
                    {items.map(item => (
                        <div key={item.skill_id} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: "#E0E7FF", color: "#1E3A8A" }}>
                            <span>{item.skill_name}</span>
                            <button
                                onClick={() => openEdit(item)}
                                disabled={deleting === item.skill_id}
                                className="hover:opacity-70 text-xs"
                            >✏️</button>
                            <button
                                onClick={() => handleDelete(item.skill_id)}
                                disabled={deleting === item.skill_id}
                                className="text-red-400 text-xs hover:opacity-70"
                            >{deleting === item.skill_id ? "…" : "✕"}</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SkillsTab
