import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authHeaders } from "../utils/auth"
import api from "../api/axios"

export const fetchAdminProfile = createAsyncThunk(
    "adminProfile/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/auth/profile", { headers: authHeaders() })
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.detail || err.message || "Failed to fetch profile")
        }
    }
)

const adminProfileSlice = createSlice({
    name: "adminProfile",
    initialState: {
        first_name: "",
        last_name: "",
        email: "",
        about: "",
        github_url: "",
        profile_picture: "",
        status: "idle",
        error: null,
    },
    reducers: {
        setProfilePicture(state, action) {
            state.profile_picture = action.payload
        },
        setAbout(state, action) {
            state.about = action.payload
        },
        setGithub(state, action) {
            state.github_url = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProfile.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchAdminProfile.fulfilled, (state, action) => {
                state.status = "succeeded"
                Object.assign(state, action.payload)
            })
            .addCase(fetchAdminProfile.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload
            })
    },
})

export const { setProfilePicture, setAbout, setGithub } = adminProfileSlice.actions
export default adminProfileSlice.reducer
