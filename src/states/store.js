import { configureStore } from '@reduxjs/toolkit';
import authUser from './authUser/slice.js';
import users from './users/slice.js';
import threads from './threads/slice.js';
import threadDetail from './threadDetail/slice.js';
import leaderboards from './leaderboards/slice.js';
import isPreload from './isPreload/slice.js';
import loadingBar from './loadingBar/slice.js';

const store = configureStore({
  reducer: {
    authUser,
    users,
    threads,
    threadDetail,
    leaderboards,
    isPreload,
    loadingBar,
  },
});

export default store;
