import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchExperience = createAsyncThunk(
  'experience/fetchExperience',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/experience/experiences');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to fetch experience');
    }
  }
);

const experienceSlice = createSlice({
  name: 'experience',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperience.pending,   (state) => { state.status = 'loading'; })
      .addCase(fetchExperience.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items  = action.payload;
      })
      .addCase(fetchExperience.rejected,  (state, action) => {
        state.status = 'failed';
        state.error  = action.payload;
      });
  },
});

export default experienceSlice.reducer;
