import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks"
import { fetchArticles } from "../../services/articles"
import { authHeaders } from "../../utils/auth"
import { FormInput, FormTextarea, SaveButton, ActionButtons } from "./FormFields"
import api from "../../api/axios"

const empty = {
    title: "", subtitle: "", headline: "", content: "",
    author_name: "", article_source: "", type: "",
}

const PAGE_SIZE = 10

function formatDate(dateStr) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    })
}

/* ── Image entry: either a URL string or a File object ─────── */
function ImageEntry({ index, entry, onChange, onRemove }) {
    return (
        <div className="flex flex-col gap-2 p-3 border border-gray-100 rounded-lg bg-white">
            <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-gray-500">Image {index + 1}</p>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-xs text-red-400 hover:text-red-600 font-semibold"
                >
                    Remove
                </button>
            </div>

            {/* Toggle: URL or File */}
            <div className="flex gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                        type="radio"
                        name={`img-mode-${index}`}
                        checked={entry.mode === "url"}
                        onChange={() => onChange({ mode: "url", value: "" })}
                    />
                    Link (URL)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                        type="radio"
                        name={`img-mode-${index}`}
                        checked={entry.mode === "file"}
                        onChange={() => onChange({ mode: "file", value: null })}
                    />
                    Upload from device
                </label>
            </div>

            {entry.mode === "url" ? (
                <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={entry.value || ""}
                    onChange={e => onChange({ ...entry, value: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
            ) : (
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => onChange({ ...entry, value: e.target.files[0] || null })}
                    className="text-sm text-gray-500"
                />
            )}

            {/* Preview */}
            {entry.mode === "url" && entry.value && (
                <img src={entry.value} alt="" className="h-24 w-full object-cover rounded-md mt-1" onError={e => e.currentTarget.style.display = "none"} />
            )}
            {entry.mode === "file" && entry.value && (
                <img src={URL.createObjectURL(entry.value)} alt="" className="h-24 w-full object-cover rounded-md mt-1" />
            )}
        </div>
    )
}

/* ── Existing image (shown when editing) ───────────────────── */
function ExistingImage({ url, onRemove }) {
    return (
        <div className="relative group">
            <img src={url} alt="" className="h-24 w-full object-cover rounded-lg border border-gray-100" />
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                ×
            </button>
        </div>
    )
}

function PostsManager() {
    const dispatch = useAppDispatch()
    const { items: articles, status } = useAppSelector(s => s.articles)

    const [form, setForm]           = useState(empty)
    const [editing, setEditing]     = useState(null)
    const [showForm, setShowForm]   = useState(false)
    const [newImages, setNewImages] = useState([])          // ImageEntry objects for new uploads
    const [existingImages, setExistingImages] = useState([]) // URLs already saved on the article
    const [saving, setSaving]       = useState(false)
    const [deleting, setDeleting]   = useState(null)
    const [error, setError]         = useState("")
    const [page, setPage]           = useState(1)

    const totalPages   = Math.max(1, Math.ceil(articles.length / PAGE_SIZE))
    const pageArticles = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    useEffect(() => {
        if (status === "idle") dispatch(fetchArticles())
    }, [dispatch, status])


    function openNew() {
        setForm(empty); setEditing(null)
        setNewImages([]); setExistingImages([])
        setError(""); setShowForm(true)
    }

    function openEdit(a) {
        setForm({
            title:          a.title          || "",
            subtitle:       a.subtitle       || "",
            headline:       a.headline       || "",
            content:        a.content        || "",
            author_name:    a.author_name    || "",
            article_source: a.article_source || "",
            type:           a.type && a.type !== "N/A" ? a.type : "",
        })
        setEditing(a.article_sys_id)
        setNewImages([])
        setExistingImages(a.image_url ? [a.image_url] : [])
        setError(""); setShowForm(true)
    }

    function cancel() {
        setShowForm(false); setEditing(null)
        setForm(empty); setNewImages([]); setExistingImages([]); setError("")
    }

    function addImageSlot() {
        setNewImages(imgs => [...imgs, { mode: "url", value: "" }])
    }

    function updateImage(i, entry) {
        setNewImages(imgs => imgs.map((img, idx) => idx === i ? entry : img))
    }

    function removeNewImage(i) {
        setNewImages(imgs => imgs.filter((_, idx) => idx !== i))
    }

    async function removeExistingImage(url) {
        if (!editing) return
        try {
            await api.delete('/articles_management/articles/remove_image', {
                data: { article_id: editing, image_url: url },
                headers: authHeaders(),
            })
            setExistingImages(imgs => imgs.filter(u => u !== url))
        } catch {
            setError("Failed to remove image")
        }
    }

    async function uploadImages(articleId) {
        for (const entry of newImages) {
            if (!entry.value) continue
            try {
                if (entry.mode === "url") {
                    await api.post('/articles_management/articles/add_image_url',
                        { article_id: articleId, image_url: entry.value },
                        { headers: authHeaders() }
                    )
                } else {
                    const fd = new FormData()
                    fd.append("article_id", articleId)
                    fd.append("image", entry.value)
                    await api.post('/articles_management/articles/upload_images', fd, { headers: authHeaders() })
                }
            } catch {
                // non-fatal: article saved, image may have failed
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true); setError("")
        try {
            let res

            if (editing) {
                res = await api.put(
                    `/articles_management/update?article_id=${encodeURIComponent(editing)}`,
                    form,
                    { headers: authHeaders() }
                )
            } else {
                res = await api.post('/articles_management/create', form, { headers: authHeaders() })
            }

            const data = res.data
            const articleId = editing || data.article_sys_id
            await uploadImages(articleId)

            dispatch(fetchArticles())
            if (!editing) setPage(1)
            cancel()
        } catch (err) {
            const detail = err.response?.data?.detail
            setError(typeof detail === "string" ? detail : JSON.stringify(detail) || err.message || "Failed to save article")
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(articleSysId) {
        if (!confirm("Delete this article? This cannot be undone.")) return
        setDeleting(articleSysId)
        try {
            await api.delete(
                `/articles_management/delete?article_id=${encodeURIComponent(articleSysId)}`,
                { headers: authHeaders() }
            )
            dispatch(fetchArticles())
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Failed to delete article")
        } finally {
            setDeleting(null)
        }
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {status === "loading" ? "Loading…" : `${articles.length} article${articles.length !== 1 ? "s" : ""}`}
                </p>
                <button
                    onClick={showForm ? cancel : openNew}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#1E3A8A" }}
                >
                    {showForm ? "Cancel" : "+ New Article"}
                </button>
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                    {error}
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div className="mb-6 border border-gray-100 rounded-xl p-6 bg-gray-50 flex flex-col gap-4">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#1E3A8A" }}>
                        {editing ? "Edit Article" : "New Article"}
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FormInput label="Title"           name="title"          value={form.title}          onChange={set} required />
                        <FormInput label="Subtitle"         name="subtitle"       value={form.subtitle}       onChange={set} />
                        <FormInput label="Headline"         name="headline"       value={form.headline}       onChange={set} />
                        <FormInput label="Type / Category"  name="type"           value={form.type}           onChange={set} />
                        <FormInput label="Author Name"      name="author_name"    value={form.author_name}    onChange={set} required />
                        <FormInput label="Source URL"       name="article_source" value={form.article_source} onChange={set} />
                        <FormTextarea label="Content *"    name="content"        value={form.content}        onChange={set} rows={6} />

                        {/* ── Images ──────────────────────────────── */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
                                    Images
                                </label>
                                <button
                                    type="button"
                                    onClick={addImageSlot}
                                    className="text-xs font-semibold px-3 py-1 rounded-lg text-white hover:opacity-80"
                                    style={{ backgroundColor: "#1E3A8A" }}
                                >
                                    + Add Image
                                </button>
                            </div>

                            {/* Existing saved images */}
                            {existingImages.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-2">Saved images (hover to remove)</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {existingImages.map(url => (
                                            <ExistingImage
                                                key={url}
                                                url={url}
                                                onRemove={() => removeExistingImage(url)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New image slots */}
                            {newImages.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    {newImages.map((entry, i) => (
                                        <ImageEntry
                                            key={i}
                                            index={i}
                                            entry={entry}
                                            onChange={e => updateImage(i, e)}
                                            onRemove={() => removeNewImage(i)}
                                        />
                                    ))}
                                </div>
                            )}

                            {newImages.length === 0 && existingImages.length === 0 && (
                                <p className="text-xs text-gray-400">No images added. Click "+ Add Image" to attach one.</p>
                            )}
                        </div>

                        <SaveButton loading={saving} editing={!!editing} />
                    </form>
                </div>
            )}

            {/* Article list */}
            <div className="flex flex-col gap-3">
                {status !== "loading" && articles.length === 0 && (
                    <div className="text-center py-10 text-gray-300 text-sm">No articles yet. Create your first one.</div>
                )}
                {pageArticles.map(a => (
                    <div
                        key={a.article_sys_id}
                        className="flex justify-between items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-[#1E3A8A] transition-colors"
                    >
                        {a.image_url && (
                            <img src={a.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate" style={{ color: "#1E3A8A" }}>{a.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {a.author_name}
                                {a.type && a.type !== "N/A" && ` · ${a.type}`}
                                {` · ${formatDate(a.updated_at)}`}
                            </p>
                        </div>
                        <ActionButtons
                            onEdit={() => openEdit(a)}
                            onDelete={() => handleDelete(a.article_sys_id)}
                            disabled={deleting === a.article_sys_id}
                        />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-400 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-30 transition-colors"
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className="w-8 h-8 text-xs font-semibold rounded-lg border transition-colors"
                            style={
                                n === page
                                    ? { backgroundColor: "#1E3A8A", color: "#fff", borderColor: "#1E3A8A" }
                                    : { backgroundColor: "transparent", color: "#6b7280", borderColor: "#e5e7eb" }
                            }
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-400 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-30 transition-colors"
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    )
}

export default PostsManager
