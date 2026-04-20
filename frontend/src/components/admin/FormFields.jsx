export function FormInput({ label, name, value, onChange, type = "text", required }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
                {label}{required && " *"}
            </label>
            <input
                type={type}
                required={required}
                value={value}
                onChange={e => onChange(name, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
        </div>
    )
}

export function FormTextarea({ label, name, value, onChange, rows = 3 }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">{label}</label>
            <textarea
                rows={rows}
                value={value}
                onChange={e => onChange(name, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] resize-none"
            />
        </div>
    )
}

export function SaveButton({ loading, editing }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="self-start px-5 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1E3A8A" }}
        >
            {loading ? "Saving..." : editing ? "Update" : "Create"}
        </button>
    )
}

export function ActionButtons({ onEdit, onDelete, disabled = false }) {
    return (
        <div className="flex gap-2 flex-shrink-0">
            <button onClick={onEdit} disabled={disabled} className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-opacity hover:opacity-80 disabled:opacity-40" style={{ backgroundColor: "#1E3A8A" }}>
                Edit
            </button>
            <button onClick={onDelete} disabled={disabled} className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg bg-red-400 hover:bg-red-500 transition-colors disabled:opacity-40">
                {disabled ? "Deleting…" : "Delete"}
            </button>
        </div>
    )
}

export function SectionHeader({ title, showForm, onToggle }) {
    return (
        <div className="flex justify-between items-center mb-5">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#1E3A8A" }}>
                {title}
            </h2>
            <button
                onClick={onToggle}
                className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#1E3A8A" }}
            >
                {showForm ? "Cancel" : "+ Add"}
            </button>
        </div>
    )
}
