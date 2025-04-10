import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { BASE_URL, api, setAuthHeader } from '../Api/api'
import { Bounce, toast } from 'react-toastify'

const publisherSlice = createSlice({
  name: 'publisher',
  initialState: {
    publishedBooks: [],
    chunks: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(gethostel.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(gethostel.fulfilled, (state, action) => {
        state.loading = false
        state.hostels = action.payload
        state.error = null
      })
      .addCase(gethostel.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
  }
})

export default publisherSlice.reducer
