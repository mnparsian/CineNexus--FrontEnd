import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/watchlist`;

export const fetchWatchlist = createAsyncThunk("watchlist/fetchWatchlist", async (userId, { getState }) => {
  const token = getState().auth.token;
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.json();
});

export const addToWatchlist = createAsyncThunk("watchlist/addToWatchlist", async ({ userId, mediaId, statusId }, { getState }) => {
  const token = getState().auth.token;
  const response = await fetch(`${API_BASE_URL}/add?userId=${userId}&mediaId=${mediaId}&statusId=${statusId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.json();
});

export const removeFromWatchlist = createAsyncThunk("watchlist/removeFromWatchlist", async ({ userId, mediaId }, { getState }) => {
  const token = getState().auth.token;
  await fetch(`${API_BASE_URL}/remove?userId=${userId}&mediaId=${mediaId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return mediaId;
});

export const updateWatchlistStatus = createAsyncThunk("watchlist/updateWatchlistStatus", async ({ userId, mediaId, statusId }, { getState }) => {
  const token = getState().auth.token;
  const response = await fetch(`${API_BASE_URL}/update-status?userId=${userId}&mediaId=${mediaId}&statusId=${statusId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.json();
});

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    items: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder;
    builder
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        console.log("✅ Watchlist Data from API:", action.payload);
        if (action.payload) {
          state.items = action.payload;
        }
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
        console.log("Watchlist state in Redux:", state.watchlist);
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.mediaId !== action.payload);
        console.log("Watchlist state in Redux:", state.watchlist);
      })
      .addCase(updateWatchlistStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.mediaId === action.payload.mediaId);
        if (index !== -1) {
          state.items[index].status = action.payload.status;
          console.log("Watchlist state in Redux:", state.watchlist);
        }
      });
  }
});

export default watchlistSlice.reducer;
