import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  collapsed: boolean;
}

const initialState: SidebarState = {
  collapsed: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    collapseSidebar(state) {
      state.collapsed = true;
    },
    expandSidebar(state) {
      state.collapsed = false;
    },
    toggleSidebar(state) {
      state.collapsed = !state.collapsed;
    },
  },
});

export const { collapseSidebar, expandSidebar, toggleSidebar } =
  sidebarSlice.actions;
export default sidebarSlice.reducer;
