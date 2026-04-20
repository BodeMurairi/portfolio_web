export default function Spinner({ size = "md" }) {
    const dim = size === "sm" ? "w-8 h-8 border-2" : size === "lg" ? "w-20 h-20 border-[6px]" : "w-14 h-14 border-4"
    return (
        <div className="flex items-center justify-center min-h-[40vh] w-full">
            <div
                className={`${dim} rounded-full animate-spin`}
                style={{ borderColor: "#1E3A8A1a", borderTopColor: "#1E3A8A" }}
            />
        </div>
    )
}
