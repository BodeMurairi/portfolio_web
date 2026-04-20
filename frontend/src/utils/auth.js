/**
 * Returns the stored JWT token if it exists and hasn't expired client-side.
 * Clears both token and expiry from localStorage when expired.
 */
export function getToken() {
    const token = localStorage.getItem("adminToken")
    const expiry = localStorage.getItem("adminTokenExpiry")

    if (!token) return null

    if (expiry && Date.now() > Number(expiry)) {
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminTokenExpiry")
        return null
    }

    return token
}

export function clearToken() {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminTokenExpiry")
}

export function authHeaders() {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}
