import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_BASE_URL = `${BASE_URL}/api/friends`;

export const fetchFriendships = createAsyncThunk("friends/fetchFriendships", async (userId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/${userId}?page=0&size=20`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("Failed to fetch friendships");

    const data = await response.json();
    console.log("Raw API Data in fetchFriendships:", data);

    if (!data || !Array.isArray(data.content)) {
      console.error("Invalid API response format:", data);
      return rejectWithValue("Invalid API response format");
    }

    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const sendFriendRequest = createAsyncThunk("friends/sendFriendRequest", async ({ userId, friendId }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await fetch(`${BASE_URL}/api/friends/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ friendId: Number(friendId) })
    });

    if (!response.ok) throw new Error("Failed to send friend request");

    return Number(friendId);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const acceptFriendRequest = createAsyncThunk("friends/acceptRequest", async (friendshipId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/${friendshipId}/accept`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to accept request");
    return friendshipId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const rejectFriendRequest = createAsyncThunk("friends/rejectRequest", async (friendshipId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/${friendshipId}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to reject request");
    return friendshipId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeFriend = createAsyncThunk("friends/removeFriend", async ({ userId, friendId }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/${userId}/${friendId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to remove friend");
    return friendId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    friendsList: [],
    friendRequests: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendships.fulfilled, (state, action) => {
        console.log("Processed API Response:", action.payload);

        state.friendsList = [];
        state.friendRequests = [];

        const friendships = action.payload?.content || [];
        const userId = action.meta.arg;

        const uniqueFriends = new Map();

        friendships.forEach((friendship) => {
          console.log("Processing Friendship:", friendship);

          if (friendship.requestStatus === "PENDING" && friendship.friendId === userId) {
            state.friendRequests.push(friendship);
          }

          const friendUserId = friendship.userId === userId ? friendship.friendId : friendship.userId;
          const friendUsername = friendship.userId === userId ? friendship.friendUsername : friendship.username;
          const friendName = friendship.userId === userId ? friendship.friendName : friendship.name;
          const friendSurname = friendship.userId === userId ? friendship.friendSurname : friendship.surname;
          const correctFriendship = friendships.find((friendship) => friendship.userId === userId || friendship.friendId === userId);
          console.log("Correct Friendship:", correctFriendship);

          const friendProfileUrl = friendship.userId === userId ? friendship.friendProfileUrl : friendship.profileUrl;

          console.log("✅ Correct Friendship:", friendship);
          console.log("🎯 Final Profile URL:", friendProfileUrl);
          const key = `${userId}-${friendUserId}`;
          if (friendship.requestStatus === "ACCEPTED" && !uniqueFriends.has(key)) {
            let finalProfileUrl = friendship.userId === userId ? friendship.friendProfileUrl : friendship.profileUrl;

            if (!finalProfileUrl || finalProfileUrl === "undefined") {
              console.warn("⚠️ Profile URL is undefined! Using default profile picture.");
              finalProfileUrl = "DEFAULT_IMAGE_URL";
            }

            console.log("✅ Correct Final Profile URL Before Push:", finalProfileUrl);

            const friendData = {
              id: friendship.id,
              userId: friendUserId,
              username: friendUsername,
              name: friendName,
              surname: friendSurname,
              profileUrl: finalProfileUrl
            };

            console.log("✅ Final Friend Data Before Push:", friendData);

            const existingIndex = state.friendsList.findIndex((f) => f.userId === friendUserId);

            if (existingIndex !== -1) {
              if (state.friendsList[existingIndex].profileUrl === "DEFAULT_IMAGE_URL" && finalProfileUrl !== "DEFAULT_IMAGE_URL") {
                console.log("🔄 Replacing old friend data with better one...");
                state.friendsList[existingIndex] = friendData;
              }
            } else {
              state.friendsList.push(friendData);
            }

            console.log("✅ Updated Friends List (After Push):", state.friendsList);
          }
        });

        console.log("Updated Friends List (Filtered):", state.friendsList);
        console.log("Updated Friend Requests:", state.friendRequests);
      })

      .addCase(removeFriend.fulfilled, (state, action) => {
        state.friendsList = state.friendsList.filter((friend) => friend.id !== action.payload);
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const acceptedFriend = state.friendRequests.find((request) => request.id === action.payload);
        if (acceptedFriend) {
          state.friendsList.push({ ...acceptedFriend, status: "ACCEPTED" });
          state.friendRequests = state.friendRequests.filter((request) => request.id !== action.payload);
        }
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.friendRequests = state.friendRequests.filter((request) => request.id !== action.payload);
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        console.log("✅ Friend request sent successfully!");

        if (!state.sentRequests) {
          state.sentRequests = [];
        }

        state.sentRequests.push(action.payload);
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        console.error("❌ Friend request failed:", action.payload);
      });
  }
});

export default friendsSlice.reducer;
