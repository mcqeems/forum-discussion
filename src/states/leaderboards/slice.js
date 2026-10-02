import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';
import { showLoading, hideLoading } from '../loadingBar/slice.js';

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: [],
  reducers: {
    setLeaderboards: (_state, action) => action.payload,
  },
});

export const { setLeaderboards } = leaderboardsSlice.actions;

export function asyncPopulateLeaderboards() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const { leaderboards } = await api.getLeaderboards();
      dispatch(setLeaderboards(leaderboards));
    } finally {
      dispatch(hideLoading());
    }
  };
}

export default leaderboardsSlice.reducer;
