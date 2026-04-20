import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchAbout = createAsyncThunk(
  'about/fetchAbout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/about/');
      return {
        about: res.data.about || "",
        github_url: res.data.github_url || "",
        profile_picture: res.data.profile_picture || "",
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to fetch data');
    }
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    content: "",
    github_url: "",
    profile_picture: "",
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.content = action.payload.about;
        state.github_url = action.payload.github_url;
        state.profile_picture = action.payload.profile_picture;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default aboutSlice.reducer;
