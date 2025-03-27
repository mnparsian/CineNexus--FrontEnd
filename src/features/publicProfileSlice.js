import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserProfile = createAsyncThunk("publicProfile/fetchUserProfile", async (userId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/users/profile/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch user profile");

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchUserFriends = createAsyncThunk("publicProfile/fetchUserFriends", async (userId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/friends/all/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch friends");

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchLoggedInUserFriends = createAsyncThunk("publicProfile/fetchLoggedInUserFriends", async (loggedInUserId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/friends/all/${loggedInUserId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch logged-in user friends");

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const publicProfileSlice = createSlice({
  name: "publicProfile",
  initialState: {
    user: null,
    friends: [],
    loggedInUserFriends: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchUserFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends = action.payload;
      })
      .addCase(fetchUserFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchLoggedInUserFriends.fulfilled, (state, action) => {
        state.loggedInUserFriends = action.payload;
      });
  }
});

export default publicProfileSlice.reducer;
