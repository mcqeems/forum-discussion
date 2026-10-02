/**
 * Skenario pengujian:
 *
 * - threadDetailReducer function
 *   - should return the initial state when given an unknown action
 *   - should store the detail when given setDetail action
 *   - should clear the detail when given clearDetail action
 *   - should append the comment when given addComment action
 *   - should toggle thread vote when given optimisticThreadVote action
 *   - should toggle comment vote when given optimisticCommentVote action
 *   - should keep null state when voting on empty detail
 */

import { describe, it, expect } from 'vitest';
import reducer, {
  setDetail,
  clearDetail,
  addComment,
  optimisticThreadVote,
  optimisticCommentVote,
} from './slice.js';

function makeDetail(overrides = {}) {
  return {
    id: 'thread-1',
    title: 'Thread title',
    body: 'Thread body',
    category: 'general',
    createdAt: '2024-01-01T00:00:00.000Z',
    owner: { id: 'user-1', name: 'Dicoding', avatar: 'https://avatar.url' },
    upVotesBy: [],
    downVotesBy: [],
    comments: [
      {
        id: 'comment-1',
        content: 'A comment',
        createdAt: '2024-01-01T00:00:00.000Z',
        owner: { id: 'user-2', name: 'Reviewer', avatar: 'https://avatar.url' },
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
    ...overrides,
  };
}

describe('threadDetailReducer function', () => {
  it('should return the initial state when given an unknown action', () => {
    const nextState = reducer(undefined, { type: 'UNKNOWN' });

    expect(nextState).toBeNull();
  });

  it('should store the detail when given setDetail action', () => {
    const detail = makeDetail();

    const nextState = reducer(null, setDetail(detail));

    expect(nextState).toEqual(detail);
  });

  it('should clear the detail when given clearDetail action', () => {
    const nextState = reducer(makeDetail(), clearDetail());

    expect(nextState).toBeNull();
  });

  it('should append the comment when given addComment action', () => {
    const initialState = makeDetail();
    const comment = { id: 'comment-2', content: 'New comment' };

    const nextState = reducer(initialState, addComment(comment));

    expect(nextState.comments).toEqual([...initialState.comments, comment]);
  });

  it('should toggle thread vote when given optimisticThreadVote action', () => {
    const voted = reducer(makeDetail(), optimisticThreadVote({ userId: 'user-1', voteType: 'up' }));
    expect(voted.upVotesBy).toEqual(['user-1']);

    const neutralized = reducer(voted, optimisticThreadVote({ userId: 'user-1', voteType: 'neutral' }));
    expect(neutralized.upVotesBy).toEqual([]);
    expect(neutralized.downVotesBy).toEqual([]);
  });

  it('should toggle comment vote when given optimisticCommentVote action', () => {
    const initialState = makeDetail();

    const nextState = reducer(
      initialState,
      optimisticCommentVote({ commentId: 'comment-1', userId: 'user-1', voteType: 'down' }),
    );

    expect(nextState.comments[0].downVotesBy).toEqual(['user-1']);
    // other comments (none here) and thread votes stay untouched
    expect(nextState.upVotesBy).toEqual([]);
  });

  it('should keep null state when voting on empty detail', () => {
    expect(reducer(null, optimisticThreadVote({ userId: 'user-1', voteType: 'up' }))).toBeNull();
    expect(
      reducer(null, optimisticCommentVote({ commentId: 'comment-1', userId: 'user-1', voteType: 'up' })),
    ).toBeNull();
  });
});
