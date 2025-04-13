import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL, api, setAuthHeader } from "../Api/api";

export const getBookById = createAsyncThunk(
  "getBookById",
  async ({  bookId }) => {
    
    try {
      const response = await api.get(`${BASE_URL}/api/consumer/book/${bookId}`);
      return response.data;
    } catch (error) {
      throw Error(error.response.data.error);
    }
  }
);

export const getBookChunks = createAsyncThunk(
  "getBookChunks",
  async ({ jwt, bookId }) => {
    setAuthHeader(jwt, api);
    try {
      const response = await api.get(
        `${BASE_URL}/api/consumer/chunk/${bookId}`
      );
      return response.data;
    } catch (error) {
      throw Error(error.response.data.error);
    }
  }
);

export const getMyBooks = createAsyncThunk(
  "getMyBooks",
  async ({ jwt, email }) => {
    setAuthHeader(jwt, api);
    try {
      const response = await api.get(
        `${BASE_URL}/api/consumer/bookBy/${email}`
      );
      return response.data;
    } catch (error) {
      throw Error(error.response.data.error);
    }
  }
);

export const getBooks = createAsyncThunk("getBooks", async () => {
  // setAuthHeader(api);
  try {
    const response = await api.get(`${BASE_URL}/api/consumer/books`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
});

const consumerSlice = createSlice({
  name: "consumer",
  initialState: {
    MyBooks: [],
    ChunksOfBook: [],
    BookById: [],
    Books: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.MyBooks = action.payload;
        state.error = null;
      })
      .addCase(getMyBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.BookById = action.payload;
        state.error = null;
      })
      .addCase(getBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getBookChunks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookChunks.fulfilled, (state, action) => {
        state.loading = false;
        state.ChunksOfBook = action.payload;
        state.error = null;
      })
      .addCase(getBookChunks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.Books = action.payload;
        state.error = null;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default consumerSlice.reducer;
