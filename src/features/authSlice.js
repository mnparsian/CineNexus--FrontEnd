import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_API_URL = `${BASE_URL}/api/auth`;
const OTP_API_URL = `${BASE_URL}/api/otp`;

// ✅ send OTP
export const sendOtp = createAsyncThunk("auth/sendOtp", async (email) => {
  const response = await fetch(`${OTP_API_URL}/send?email=${email}`, { method: "POST" });
  if (!response.ok) throw new Error("Failed to send OTP");
  return email;
});

// ✅ confirm OTP
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ email, otp }) => {
  const response = await fetch(`${OTP_API_URL}/verify?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
    method: "POST"
  });

  if (!response.ok) throw new Error("OTP verification failed");

  return true;
});

// ✅ Login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// ✅ login user information
export const fetchUserDetails = createAsyncThunk("auth/fetchUserDetails", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token || localStorage.getItem("token");
  if (!token) return rejectWithValue("No token available");

  try {
    const response = await fetch(`${AUTH_API_URL}/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch user details");
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// ✅ signup
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// ✅ update
export const updateUserProfile = createAsyncThunk("auth/updateUserProfile", async (updatedUser, { rejectWithValue, getState }) => {
  try {
    const userId = getState().auth.user.id;
    if (!userId) {
      throw new Error("User ID is missing!");
    }

    console.log("Sending update request for User ID:", userId);
    const token = getState().auth.token;

    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedUser)
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const uploadProfileImage = createAsyncThunk("auth/uploadProfileImage", async ({ userId, file }, { rejectWithValue, dispatch }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/image/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: file
    });

    if (!response.ok) {
      throw new Error("There was a problem uploading the image.");
    }

    const newProfileImage = await response.json();

    dispatch(fetchUserDetails());

    return newProfileImage;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  otpSent: false,
  otpVerified: false,
  status: "idle",
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    resetAuthStatus: (state) => {
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(sendOtp.fulfilled, (state) => {
        state.otpSent = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.otpVerified = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.user = null;
        localStorage.removeItem("user");
      })

      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { logout, resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;
