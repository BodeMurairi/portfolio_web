import { useState, useEffect } from "react"
import { FormInput, FormTextarea, SaveButton, ActionButtons, SectionHeader } from "../FormFields"
import { authHeaders } from "../../../utils/auth"
import Spinner from "../../Spinner"
import api from "../../../api/axios"

const empty = { name: "", organization: "", description: "", date: "", credential_url: "" }

function toDateInput(dt) {
    if (!dt) return ""
    try { return new Date(dt).toISOString().slice(0, 10) } catch { return "" }
}

function CertificatesTab() {
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
            const res = await api.get('/certificates/')
            setItems(res.data)
        } catch (err) { setError(err.response?.data?.detail || err.message || "Failed to fetch certificates") }
        finally { setLoading(false) }
    }

    function openEdit(item) {
        setForm({
            name:           item.name           || "",
            organization:   item.organization   || "",
            description:    item.description    || "",
            date:           toDateInput(item.date),
            credential_url: item.credential_url || "",
        })
        setEditing(item.certification_id)
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
                name:           form.name,
                organization:   form.organization,
                description:    form.description,
                date:           form.date,
                credential_url: form.credential_url.trim() || null,
            }
            const url    = editing ? `/certificates/update/${editing}` : '/certificates/create'
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
        if (!confirm("Delete this certificate?")) return
        setDeleting(id)
        try {
            await api.delete(`/certificates/delete/${id}`, { headers: authHeaders() })
            await load()
        } catch (err) { setError(err.response?.data?.detail || err.message || "Delete failed") }
        finally { setDeleting(null) }
    }

    return (
        <div className="max-w-2xl">
            <SectionHeader title="Certificates" showForm={show} onToggle={() => { setForm(empty); setEditing(null); setShow(!show) }} />

            {error && <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>{error}</div>}

            {show && (
                <form onSubmit={handleSubmit} className="border border-gray-100 rounded-xl p-6 bg-gray-50 flex flex-col gap-4 mb-6">
                    <FormInput    label="Certificate Name" name="name"           value={form.name}           onChange={set} required />
                    <FormInput    label="Organization"     name="organization"   value={form.organization}   onChange={set} required />
                    <FormTextarea label="Description"      name="description"    value={form.description}    onChange={set} />
                    <FormInput    label="Date"             name="date"           value={form.date}           onChange={set} type="date" required />
                    <FormInput    label="Credential URL"   name="credential_url" value={form.credential_url} onChange={set} />
                    <SaveButton loading={saving} editing={!!editing} />
                </form>
            )}

            {loading ? <Spinner /> : (
                <div className="flex flex-col gap-3">
                    {items.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No certificates yet.</p>}
                    {items.map(item => (
                        <div key={item.certification_id} className="flex justify-between items-start p-4 border border-gray-100 rounded-xl hover:border-[#1E3A8A] transition-colors">
                            <div>
                                <p className="font-semibold text-sm" style={{ color: "#1E3A8A" }}>{item.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{item.organization}</p>
                                {item.date && <p className="text-xs text-gray-300 mt-0.5">{toDateInput(item.date)}</p>}
                            </div>
                            <ActionButtons
                                onEdit={() => openEdit(item)}
                                onDelete={() => handleDelete(item.certification_id)}
                                disabled={deleting === item.certification_id}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CertificatesTab
