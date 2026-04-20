import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const sendContactEmail = createAsyncThunk(
  'contact/sendEmail',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/send_email/send', formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to send message');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {
    resetContact: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContactEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendContactEmail.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(sendContactEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetContact } = contactSlice.actions;
export default contactSlice.reducer;
