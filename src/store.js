import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./features/moviesSlice";
import authReducer from "./features/authSlice";
import watchlistReducer from "./features/watchlistSlice";
import favoriteReducer from "./features/favoriteSlice";
import reviewsReducer from "./features/reviewsSlice";
import friendReducer from "./features/friendsSlice";
import chatReducer from "./features/chatSlice";
import publicProfileReducer from "./features/publicProfileSlice";
import uiReducer from "./features/uiSlice";
import adminReducer from "./features/adminSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    auth: authReducer,
    watchlist: watchlistReducer,
    favorites: favoriteReducer,
    reviews: reviewsReducer,
    friends: friendReducer,
    chat: chatReducer,
    publicProfile: publicProfileReducer,
    ui: uiReducer,
    admin: adminReducer
  }
});

export default store;
