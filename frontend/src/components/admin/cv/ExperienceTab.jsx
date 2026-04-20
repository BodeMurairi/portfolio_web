import { useState, useEffect } from "react"
import { FormInput, FormTextarea, SaveButton, ActionButtons, SectionHeader } from "../FormFields"
import { authHeaders } from "../../../utils/auth"
import Spinner from "../../Spinner"
import api from "../../../api/axios"

const empty = { company: "", company_url: "", role: "", responsabilities: "", start_date: "", end_date: "" }

function toDateInput(dt) {
    if (!dt) return ""
    try { return new Date(dt).toISOString().slice(0, 10) } catch { return "" }
}

function ExperienceTab() {
    const [items, setItems]       = useState([])
    const [loading, setLoading]   = useState(true)
    const [show, setShow]         = useState(false)
    const [editing, setEditing]   = useState(null)
    const [form, setForm]         = useState(empty)
    const [saving, setSaving]     = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [error, setError]       = useState("")

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    useEffect(() => { load() }, [])

    async function load() {
        setLoading(true)
        try {
            const res = await api.get('/experience/experiences')
            setItems(res.data)
        } catch (err) { setError(err.response?.data?.detail || err.message || "Failed to fetch experience") }
        finally { setLoading(false) }
    }

    function openEdit(item) {
        setForm({
            company:         item.company         || "",
            company_url:     item.company_url     || "",
            role:            item.role            || "",
            responsabilities: item.responsabilities || "",
            start_date:      toDateInput(item.start_date),
            end_date:        toDateInput(item.end_date),
        })
        setEditing(item.experience_id)
        setError(""); setShow(true)
    }

    function cancel() {
        setShow(false); setEditing(null); setForm(empty); setError("")
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true); setError("")
        try {
            const payload = {
                company:          form.company,
                role:             form.role,
                responsabilities: form.responsabilities || null,
                start_date:       form.start_date,
                end_date:         form.end_date || null,
                company_url:      form.company_url.trim() || null,
            }
            const url    = editing ? `/admin-work-experience/update/${editing}` : '/admin-work-experience/create'
            const method = editing ? "put" : "post"
            const res = await api[method](url, payload, { headers: authHeaders() })
            if (!res.data) throw new Error("Save failed")
            await load(); cancel()
        } catch (err) {
            const detail = err.response?.data?.detail
            setError(typeof detail === "string" ? detail : JSON.stringify(detail) || err.message || "Save failed")
        }
        finally { setSaving(false) }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this experience entry?")) return
        setDeleting(id)
        try {
            await api.delete(`/admin-work-experience/delete/${id}`, { headers: authHeaders() })
            await load()
        } catch (err) { setError(err.response?.data?.detail || err.message || "Delete failed") }
        finally { setDeleting(null) }
    }

    return (
        <div className="max-w-2xl">
            <SectionHeader title="Work Experience" showForm={show} onToggle={() => { setForm(empty); setEditing(null); setShow(!show) }} />

            {error && <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>{error}</div>}

            {show && (
                <form onSubmit={handleSubmit} className="border border-gray-100 rounded-xl p-6 bg-gray-50 flex flex-col gap-4 mb-6">
                    <FormInput label="Company"     name="company"     value={form.company}     onChange={set} required />
                    <FormInput label="Company URL" name="company_url" value={form.company_url} onChange={set} />
                    <FormInput label="Role"        name="role"        value={form.role}        onChange={set} required />
                    <FormTextarea label="Responsibilities" name="responsabilities" value={form.responsabilities} onChange={set} />
                    <FormInput label="Start Date"               name="start_date" value={form.start_date} onChange={set} type="date" required />
                    <FormInput label="End Date (blank = current)" name="end_date" value={form.end_date}   onChange={set} type="date" />
                    <SaveButton loading={saving} editing={!!editing} />
                </form>
            )}

            {loading ? <Spinner /> : (
                <div className="flex flex-col gap-3">
                    {items.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No experience entries yet.</p>}
                    {items.map(item => (
                        <div key={item.experience_id} className="flex justify-between items-start p-4 border border-gray-100 rounded-xl hover:border-[#1E3A8A] transition-colors">
                            <div>
                                <p className="font-semibold text-sm" style={{ color: "#1E3A8A" }}>{item.role}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{item.company}</p>
                                {item.start_date && <p className="text-xs text-gray-300 mt-0.5">{toDateInput(item.start_date)}{item.end_date ? ` → ${toDateInput(item.end_date)}` : " → Present"}</p>}
                            </div>
                            <ActionButtons
                                onEdit={() => openEdit(item)}
                                onDelete={() => handleDelete(item.experience_id)}
                                disabled={deleting === item.experience_id}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ExperienceTab
