import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    friendId: null,
    chatRoomId: null
  },
  reducers: {
    setFriendId: (state, action) => {
      console.log("Setting friendId:", action.payload);
      state.friendId = action.payload;
      state.chatRoomId = null;
    },
    setChatRoomId: (state, action) => {
      console.log("Setting chatRoomId:", action.payload);
      state.chatRoomId = action.payload;
    }
  }
});

export const { setFriendId, setChatRoomId } = chatSlice.actions;
export default chatSlice.reducer;
