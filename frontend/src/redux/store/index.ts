import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../slices/admin";
import loadingReducer from "../slices/loading";
import sidebarReducer from "../slices/sidebar";
import themeReducer from "../slices/theme";
const store = configureStore({
  reducer: {
    admin: adminReducer,
    loading: loadingReducer,
    sidebar: sidebarReducer,
    theme: themeReducer,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
