const menuItems = [
    { label: "Edit Profile", key: "profile",  icon: "👤" },
    { label: "Posts",        key: "posts",    icon: "📝" },
    { label: "Analytics",    key: "analytics", icon: "📊" },
    { label: "Edit CV",      key: "cv",       icon: "📄" },
    { label: "Messages",     key: "messages", icon: "✉️" },
]

function DashboardMenu({ active, onSelect }) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-3 hidden lg:block">Menu</p>
            <div className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
            {menuItems.map(item => (
                <button
                    key={item.key}
                    onClick={() => onSelect(item.key)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-left flex-shrink-0 lg:w-full transition-all"
                    style={active === item.key
                        ? { backgroundColor: "#1E3A8A", color: "#fff" }
                        : { backgroundColor: "transparent", color: "#1E3A8A" }
                    }
                >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                </button>
            ))}
            </div>
        </div>
    )
}

export default DashboardMenu
