import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:8080/api/favorites";

// Fetch favorite movies
export const fetchFavorites = createAsyncThunk("favorites/fetchFavorites", async (userId, { getState }) => {
  const token = getState().auth.token;
  const response = await fetch(`${API_BASE_URL}?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.json();
});

// Add movie to favorites
export const addToFavorites = createAsyncThunk("favorites/addToFavorites", async ({ userId, tmdbId }, { getState }) => {
  const token = getState().auth.token;
  const response = await fetch(`${API_BASE_URL}?userId=${userId}&tmdbId=${tmdbId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, tmdbId })
  });
  const data = await response.json();
  return data;
});

// Remove movie from favorites
export const removeFromFavorites = createAsyncThunk("favorites/removeFromFavorites", async ({ userId, tmdbId }, { getState }) => {
  const token = getState().auth.token;
  await fetch(`${API_BASE_URL}?userId=${userId}&tmdbId=${tmdbId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return tmdbId;
});

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = state.items.filter((movie) => movie.tmdbId !== action.payload);
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  }
});

export default favoriteSlice.reducer;
