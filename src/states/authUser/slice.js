import { createSlice } from '@reduxjs/toolkit';
import { api, clearToken } from '../../utils/api.js';
import { showLoading, hideLoading } from '../loadingBar/slice.js';
import { setIsPreload } from '../isPreload/slice.js';

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: { user: null, error: '' },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.error = '';
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    unsetAuthUser: (state) => {
      state.user = null;
      state.error = '';
    },
  },
});

export const { setAuthUser, setAuthError, unsetAuthUser } = authUserSlice.actions;

export function asyncRegister({ name, email, password }) {
  return async (dispatch) => {
    dispatch(showLoading());
    dispatch(setAuthError(''));
    try {
      await api.register({ name, email, password });
    } catch (error) {
      dispatch(setAuthError(error.message));
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncLogin({ email, password }) {
  return async (dispatch) => {
    dispatch(showLoading());
    dispatch(setAuthError(''));
    try {
      await api.login({ email, password });
      const { user } = await api.getOwnProfile();
      dispatch(setAuthUser(user));
    } catch (error) {
      dispatch(setAuthError(error.message));
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncPreload() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const { user } = await api.getOwnProfile();
      dispatch(setAuthUser(user));
    } catch (_error) {
      dispatch(unsetAuthUser());
    } finally {
      dispatch(setIsPreload(false));
      dispatch(hideLoading());
    }
  };
}

export function asyncLogout() {
  return (dispatch) => {
    clearToken();
    dispatch(unsetAuthUser());
  };
}

export default authUserSlice.reducer;
