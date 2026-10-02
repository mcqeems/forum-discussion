import { createSlice } from '@reduxjs/toolkit';

const loadingBarSlice = createSlice({
  name: 'loadingBar',
  initialState: 0,
  reducers: {
    showLoading: (state) => state + 1,
    hideLoading: (state) => (state > 0 ? state - 1 : 0),
  },
});

export const { showLoading, hideLoading } = loadingBarSlice.actions;
export default loadingBarSlice.reducer;
