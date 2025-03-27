import { createSlice, createAction } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showAuthSidebar: false
  },
  reducers: {
    openAuthSidebar: (state) => {
      state.showAuthSidebar = true;
    },
    closeAuthSidebar: (state) => {
      state.showAuthSidebar = false;
    }
  }
});

export const openAuthSidebar = createAction("ui/openAuthSidebar");
export const closeAuthSidebar = createAction("ui/closeAuthSidebar");
export default uiSlice.reducer;
