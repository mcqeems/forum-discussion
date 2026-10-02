import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';
import { showLoading, hideLoading } from '../loadingBar/slice.js';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (_state, action) => action.payload,
  },
});

export const { setUsers } = usersSlice.actions;

export function asyncPopulateUsers() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const { users } = await api.getAllUsers();
      dispatch(setUsers(users));
    } finally {
      dispatch(hideLoading());
    }
  };
}

export default usersSlice.reducer;
