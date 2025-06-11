import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: {
    id: null,
    name: null,
    email: null,
  },
  token: null,
  isLoggedIn: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logoutAdmin: (state) => {
      state.admin = { name: null, email: null, id: null };
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem("adminToken");
    },
    updateAdmin: (state, action) => {
      state.admin = { ...state.admin, ...action.payload };
    },
  },
});

export const { setAdmin, logoutAdmin, updateAdmin } = adminSlice.actions;
export default adminSlice.reducer;
