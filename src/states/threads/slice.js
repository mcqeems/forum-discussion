import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';
import { showLoading, hideLoading } from '../loadingBar/slice.js';

function toggleVote(list, userId, type) {
  const up = list.upVotesBy.includes(userId);
  const down = list.downVotesBy.includes(userId);
  let next = { upVotesBy: [...list.upVotesBy], downVotesBy: [...list.downVotesBy] };
  if (type === 'up') {
    next = up
      ? { ...next, upVotesBy: next.upVotesBy.filter((id) => id !== userId) }
      : { upVotesBy: [...next.upVotesBy, userId], downVotesBy: next.downVotesBy.filter((id) => id !== userId) };
  } else if (type === 'down') {
    next = down
      ? { ...next, downVotesBy: next.downVotesBy.filter((id) => id !== userId) }
      : { upVotesBy: next.upVotesBy.filter((id) => id !== userId), downVotesBy: [...next.downVotesBy, userId] };
  } else {
    next = {
      upVotesBy: next.upVotesBy.filter((id) => id !== userId),
      downVotesBy: next.downVotesBy.filter((id) => id !== userId),
    };
  }
  return { ...list, ...next };
}

const threadsSlice = createSlice({
  name: 'threads',
  initialState: [],
  reducers: {
    setThreads: (_state, action) => action.payload,
    addThread: (state, action) => {
      state.unshift(action.payload);
    },
    optimisticVote: (state, action) => {
      const { threadId, userId, voteType } = action.payload;
      const index = state.findIndex((thread) => thread.id === threadId);
      if (index >= 0) {
        state[index] = toggleVote(state[index], userId, voteType);
      }
    },
  },
});

export const { setThreads, addThread, optimisticVote } = threadsSlice.actions;

export function asyncPopulateThreads() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const { threads } = await api.getThreads();
      dispatch(setThreads(threads));
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncCreateThread({ title, body, category }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const { thread } = await api.createThread({ title, body, category });
      dispatch(addThread(thread));
      return thread;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncVoteThread({ threadId, userId, voteType }) {
  return async (dispatch, getState) => {
    const prev = getState().threads;
    dispatch(optimisticVote({ threadId, userId, voteType }));
    try {
      if (voteType === 'up') {
        await api.upVoteThread(threadId);
      } else if (voteType === 'down') {
        await api.downVoteThread(threadId);
      } else {
        await api.neutralizeThread(threadId);
      }
    } catch (_error) {
      dispatch(setThreads(prev));
    }
  };
}

export default threadsSlice.reducer;
