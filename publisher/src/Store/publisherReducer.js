import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { BASE_URL, api, setAuthHeader } from '../Api/api'
import { Bounce, toast } from 'react-toastify'

export const uploadBook = createAsyncThunk(
  'uploadBook',
  async ({ jwt, bookName, bookFile }) => {
    setAuthHeader(jwt, api)
    try {
      const response = await api.post(`${BASE_URL}/api/publisher/upload`, {
        params: {
          bookName: bookName,
          book: bookFile
        }
      })
      return response.data
    } catch (error) {
      throw Error(error.response.data.error)
    }
  }
)

export const publishBook = createAsyncThunk(
  'publishBook',
  async ({ jwt, bookName,description, localPath, s3path,s3CoverImagePath, bookPrice, pubId }) => {
    setAuthHeader(jwt, api)
    try {
      const response = await api.post(`${BASE_URL}/api/publisher/publish`, {},{
        params: {
          bookName: bookName,
          description:description,
          localPath: localPath,
          s3path: s3path,
          s3CoverImagePath:s3CoverImagePath,
          bookPrice: bookPrice,
          pubId: pubId
        }
      })

      return response.data
    } catch (error) {
      throw Error(error.response.data.error)
    }
  }
)


export const createChunk = createAsyncThunk(
  'createChunk',
  async ({ jwt, bookId, startPage, endPage, chPrice }) => {
    setAuthHeader(jwt, api)
    try {
      const response = await api.post(`${BASE_URL}/api/publisher/book/create/chunk`, {},{
        params: {
          bookId:bookId,
          startPage:startPage,
          endPage:endPage,
          chPrice:chPrice
        }
      })
      return response.data
    } catch (error) {
      throw Error(error.response.data.error)
    }
  }
)

export const getBookById = createAsyncThunk(
  'getBookById',
  async ({ jwt, bookId }) => {
    setAuthHeader(jwt, api)
    try {
      const response = await api.get(`${BASE_URL}/api/publisher/book/${bookId}`)
      return response.data
    } catch (error) {
      throw Error(error.response.data.error)
    }
  }
)

export const getBookChunks=createAsyncThunk(
  'getBookChunks',
  async({jwt,bookId})=>{
    setAuthHeader(jwt, api)
    try {
      const response = await api.get(`${BASE_URL}/api/publisher/chunk/${bookId}`)
      return response.data
    } catch (error) {
      throw Error(error.response.data.error)

    }
  }
)

export const getMyBooks = createAsyncThunk(
  'getMyBooks',
  async ({ jwt, email }) => {
    setAuthHeader(jwt, api)
    try {
      const response = await api.get(`${BASE_URL}/api/publisher/bookBy/${email}`)
      return response.data
    } catch (error) {
      throw Error(error.response.data.error)
    }
  }
)

export const deleteChunk = createAsyncThunk(
  'deleteChunk',
  async ({ jwt, chunkId }) => {
    setAuthHeader(jwt, api)
    try {
      const response = await api.delete(`${BASE_URL}/api/publisher/chunk/${chunkId}`)
      return response.data
    } catch (error) {
      throw Error(error.response.data.error)
    }
  }
)

export const deleteBook = createAsyncThunk(
  'deleteBook',
  async ({ jwt, bookId }) => {
    setAuthHeader(jwt, api)
    try {
      const response = await api.delete(`${BASE_URL}/api/publisher/book/${bookId}`)
      return response.data
    } catch (error) {
      throw Error(error.response.data.error)
    }
  }
)



const publisherSlice = createSlice({
  name: 'publisher',
  initialState: {
    MyBooks: [],
    ChunksOfBook: [],
    BookById: [],
    BookPaths: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(uploadBook.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadBook.fulfilled, (state, action) => {
        state.loading = false
        state.BookPaths = action.payload
        state.error = null
      })
      .addCase(uploadBook.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(publishBook.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(publishBook.fulfilled, state => {
        state.loading = false
        state.error = null
      })
      .addCase(publishBook.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(getMyBooks.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getMyBooks.fulfilled, (state, action) => {
        state.loading = false
        state.MyBooks = action.payload
        state.error = null
      })
      .addCase(getMyBooks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(getBookById.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.loading = false
        state.BookById = action.payload
        state.error = null
      })
      .addCase(getBookById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(getBookChunks.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getBookChunks.fulfilled, (state, action) => {
        state.loading = false
        state.ChunksOfBook = action.payload
        state.error = null
      })
      .addCase(getBookChunks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(createChunk.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createChunk.fulfilled, (state, action) => {
        state.loading = false
        state.ChunksOfBook = [...state.ChunksOfBook,action.payload]
        state.error = null
      })
      .addCase(createChunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(deleteChunk.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteChunk.fulfilled, (state, action) => {
        const deletedChunkId = action.meta.arg.chunkId;
      
        state.loading = false;
        state.ChunksOfBook = state.ChunksOfBook.filter(
          (chunk) => chunk.chId !== deletedChunkId
        );
        state.error = null;
      })
      .addCase(deleteChunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(deleteBook.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        const deletedBookId = action.meta.arg.bookId;
        state.loading = false;
        state.MyBooks = state.MyBooks.filter(
          (book) => book.bid !== deletedBookId
        );
        state.error = null;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
  }
})

export default publisherSlice.reducer
