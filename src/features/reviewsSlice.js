import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Base API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/reviews-comments`;

export const fetchUserReviews = createAsyncThunk("reviews/fetchUserReviews", async (userId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/reviews/all/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error("Failed to fetch user reviews");
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchReviewLikes = createAsyncThunk("reviews/fetchReviewLikes", async (reviewId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/reviews/like/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch review likes");
    const data = await response.json();
    console.log(data);
    return { reviewId, likes: data };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchReviewComments = createAsyncThunk("reviews/fetchReviewComments", async (reviewId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/comments/review/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error("Failed to fetch review comments");
    const comments = await response.json();
    return { reviewId, commentsCount: comments.length };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const editReview = createAsyncThunk("reviews/editReview", async ({ reviewId, updatedText, updatedRating }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: updatedText,
        rating: updatedRating
      })
    });

    if (!response.ok) throw new Error("Failed to update review");

    return { reviewId, updatedText, updatedRating };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteReview = createAsyncThunk("reviews/deleteReview", async (reviewId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error("Failed to delete review");
    return reviewId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [],
    likes: {},
    commentsCount: {},
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchReviewLikes.fulfilled, (state, action) => {
        state.likes[action.payload.reviewId] = action.payload.likes;
      })

      .addCase(fetchReviewComments.fulfilled, (state, action) => {
        state.commentsCount[action.payload.reviewId] = action.payload.commentsCount;
      })

      .addCase(editReview.fulfilled, (state, action) => {
        const { reviewId, updatedText, updatedRating } = action.payload;
        const reviewIndex = state.items.findIndex((r) => r.id === reviewId);
        if (reviewIndex !== -1) {
          state.items[reviewIndex].content = updatedText;
          state.items[reviewIndex].rating = updatedRating;
        }
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  }
});

export default reviewsSlice.reducer;
