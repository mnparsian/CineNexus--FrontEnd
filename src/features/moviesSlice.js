import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchMovies = createAsyncThunk("movies/fetchMovies", async (category = "movie/popular") => {
  const response = await fetch(`${BASE_URL}/api/media-query/category?category=${category}&size=10`);
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }
  return await response.json();
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    category: "movie/popular"
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.content;
        console.log(action.payload.content);
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const { setCategory } = moviesSlice.actions;
export default moviesSlice.reducer;
