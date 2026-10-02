/**
 * Skenario pengujian:
 *
 * - asyncGetDetail thunk
 *   - should dispatch setDetail when fetching detail succeeds
 * - asyncCreateComment thunk
 *   - should dispatch addComment when creating comment succeeds
 * - asyncVoteDetailThread thunk
 *   - should dispatch optimisticThreadVote when voting succeeds
 *   - should restore previous detail when voting fails
 * - asyncVoteComment thunk
 *   - should dispatch optimisticCommentVote and call up-vote API when voting succeeds
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { api } from '../../utils/api.js';
import {
  asyncGetDetail,
  asyncCreateComment,
  asyncVoteDetailThread,
  asyncVoteComment,
  setDetail,
  addComment,
  optimisticThreadVote,
  optimisticCommentVote,
} from './slice.js';

vi.mock('../../utils/api.js');

describe('threadDetail thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('asyncGetDetail should dispatch setDetail when fetching detail succeeds', async () => {
    const detailThread = { id: 'thread-1' };
    api.getThreadDetail.mockResolvedValue({ detailThread });
    const dispatch = vi.fn();

    await asyncGetDetail('thread-1')(dispatch);

    expect(api.getThreadDetail).toHaveBeenCalledWith('thread-1');
    expect(dispatch).toHaveBeenCalledWith(setDetail(detailThread));
  });

  it('asyncCreateComment should dispatch addComment when creating comment succeeds', async () => {
    const comment = { id: 'comment-1', content: 'Bagus!' };
    api.createComment.mockResolvedValue({ comment });
    const dispatch = vi.fn();

    await asyncCreateComment('thread-1', 'Bagus!')(dispatch);

    expect(api.createComment).toHaveBeenCalledWith('thread-1', 'Bagus!');
    expect(dispatch).toHaveBeenCalledWith(addComment(comment));
  });

  it('asyncVoteDetailThread should dispatch optimisticThreadVote when voting succeeds', async () => {
    api.upVoteThread.mockResolvedValue({});
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({ threadDetail: null }));

    await asyncVoteDetailThread({ threadId: 'thread-1', userId: 'user-1', voteType: 'up' })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(optimisticThreadVote({ userId: 'user-1', voteType: 'up' }));
    expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
  });

  it('asyncVoteDetailThread should restore previous detail when voting fails', async () => {
    const prev = { id: 'thread-1' };
    api.downVoteThread.mockRejectedValue(new Error('network error'));
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({ threadDetail: prev }));

    await asyncVoteDetailThread({ threadId: 'thread-1', userId: 'user-1', voteType: 'down' })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(setDetail(prev));
  });

  it('asyncVoteComment should dispatch optimisticCommentVote and call up-vote API when voting succeeds', async () => {
    api.upVoteComment.mockResolvedValue({});
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({ threadDetail: null }));

    await asyncVoteComment({
      threadId: 'thread-1', commentId: 'comment-1', userId: 'user-1', voteType: 'up',
    })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      optimisticCommentVote({ commentId: 'comment-1', userId: 'user-1', voteType: 'up' }),
    );
    expect(api.upVoteComment).toHaveBeenCalledWith('thread-1', 'comment-1');
  });
});
