import { createSlice } from '@reduxjs/toolkit';

const isPreloadSlice = createSlice({
  name: 'isPreload',
  initialState: true,
  reducers: {
    setIsPreload: (_state, action) => action.payload,
  },
});

export const { setIsPreload } = isPreloadSlice.actions;
export default isPreloadSlice.reducer;
