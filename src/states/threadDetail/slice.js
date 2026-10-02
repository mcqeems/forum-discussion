import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';
import { showLoading, hideLoading } from '../loadingBar/slice.js';

function toggleVote(entity, userId, voteType) {
  const up = entity.upVotesBy.includes(userId);
  const down = entity.downVotesBy.includes(userId);
  let upVotesBy = [...entity.upVotesBy];
  let downVotesBy = [...entity.downVotesBy];
  if (voteType === 'up') {
    upVotesBy = up ? upVotesBy.filter((id) => id !== userId) : [...upVotesBy, userId];
    downVotesBy = downVotesBy.filter((id) => id !== userId);
    if (!up) {
      downVotesBy = downVotesBy.filter((id) => id !== userId);
    }
  } else if (voteType === 'down') {
    downVotesBy = down ? downVotesBy.filter((id) => id !== userId) : [...downVotesBy, userId];
    upVotesBy = upVotesBy.filter((id) => id !== userId);
  } else {
    upVotesBy = upVotesBy.filter((id) => id !== userId);
    downVotesBy = downVotesBy.filter((id) => id !== userId);
  }
  return { ...entity, upVotesBy, downVotesBy };
}

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: null,
  reducers: {
    setDetail: (_state, action) => action.payload,
    clearDetail: () => null,
    addComment: (state, action) => {
      if (state) {
        state.comments.push(action.payload);
      }
    },
    optimisticThreadVote: (state, action) => {
      if (!state) {
        return state;
      }
      return toggleVote(state, action.payload.userId, action.payload.voteType);
    },
    optimisticCommentVote: (state, action) => {
      if (!state) {
        return state;
      }
      const { commentId, userId, voteType } = action.payload;
      return {
        ...state,
        comments: state.comments.map((comment) => (comment.id === commentId
          ? toggleVote(comment, userId, voteType)
          : comment)),
      };
    },
  },
});

export const {
  setDetail,
  clearDetail,
  addComment,
  optimisticThreadVote,
  optimisticCommentVote,
} = threadDetailSlice.actions;

export function asyncGetDetail(threadId) {
  return async (dispatch) => {
    dispatch(showLoading());
    dispatch(clearDetail());
    try {
      const { detailThread } = await api.getThreadDetail(threadId);
      dispatch(setDetail(detailThread));
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncCreateComment(threadId, content) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const { comment } = await api.createComment(threadId, content);
      dispatch(addComment(comment));
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncVoteDetailThread({ threadId, userId, voteType }) {
  return async (dispatch, getState) => {
    const prev = getState().threadDetail;
    dispatch(optimisticThreadVote({ userId, voteType }));
    try {
      if (voteType === 'up') {
        await api.upVoteThread(threadId);
      } else if (voteType === 'down') {
        await api.downVoteThread(threadId);
      } else {
        await api.neutralizeThread(threadId);
      }
    } catch (_error) {
      dispatch(setDetail(prev));
    }
  };
}

export function asyncVoteComment({ threadId, commentId, userId, voteType }) {
  return async (dispatch, getState) => {
    const prev = getState().threadDetail;
    dispatch(optimisticCommentVote({ commentId, userId, voteType }));
    try {
      if (voteType === 'up') {
        await api.upVoteComment(threadId, commentId);
      } else if (voteType === 'down') {
        await api.downVoteComment(threadId, commentId);
      } else {
        await api.neutralizeComment(threadId, commentId);
      }
    } catch (_error) {
      dispatch(setDetail(prev));
    }
  };
}

export default threadDetailSlice.reducer;
