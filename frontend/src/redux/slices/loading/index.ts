import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface LoadingState {
  loading: boolean;
}
const initialState: LoadingState = {
  loading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});
export const { startLoading, stopLoading, setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
