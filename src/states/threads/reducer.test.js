/**
 * Skenario pengujian:
 *
 * - threadsReducer function
 *   - should return the initial state when given an unknown action
 *   - should return the threads when given setThreads action
 *   - should prepend the new thread when given addThread action
 *   - should toggle up vote when given optimisticVote up action
 *   - should toggle down vote and neutralize when given optimisticVote actions
 *   - should ignore optimisticVote for unknown thread id
 */

import { describe, it, expect } from 'vitest';
import reducer, { setThreads, addThread, optimisticVote } from './slice.js';

function makeThread(overrides = {}) {
  return {
    id: 'thread-1',
    title: 'Thread title',
    body: 'Thread body',
    category: 'general',
    createdAt: '2024-01-01T00:00:00.000Z',
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
    ...overrides,
  };
}

describe('threadsReducer function', () => {
  it('should return the initial state when given an unknown action', () => {
    const nextState = reducer(undefined, { type: 'UNKNOWN' });

    expect(nextState).toEqual([]);
  });

  it('should return the threads when given setThreads action', () => {
    const threads = [makeThread(), makeThread({ id: 'thread-2' })];

    const nextState = reducer([], setThreads(threads));

    expect(nextState).toEqual(threads);
  });

  it('should prepend the new thread when given addThread action', () => {
    const initialState = [makeThread({ id: 'thread-2' })];
    const thread = makeThread();

    const nextState = reducer(initialState, addThread(thread));

    expect(nextState).toEqual([thread, ...initialState]);
  });

  it('should toggle up vote when given optimisticVote up action', () => {
    const initialState = [makeThread()];

    const voted = reducer(initialState, optimisticVote({ threadId: 'thread-1', userId: 'user-1', voteType: 'up' }));
    expect(voted[0].upVotesBy).toEqual(['user-1']);

    // voting up again neutralizes (removes the vote)
    const neutralized = reducer(voted, optimisticVote({ threadId: 'thread-1', userId: 'user-1', voteType: 'up' }));
    expect(neutralized[0].upVotesBy).toEqual([]);
  });

  it('should toggle down vote and neutralize when given optimisticVote actions', () => {
    const initialState = [makeThread({ upVotesBy: ['user-1'] })];

    // down vote moves user from upVotesBy to downVotesBy
    const downvoted = reducer(initialState, optimisticVote({ threadId: 'thread-1', userId: 'user-1', voteType: 'down' }));
    expect(downvoted[0].upVotesBy).toEqual([]);
    expect(downvoted[0].downVotesBy).toEqual(['user-1']);

    // neutral removes all votes by the user
    const neutralized = reducer(downvoted, optimisticVote({ threadId: 'thread-1', userId: 'user-1', voteType: 'neutral' }));
    expect(neutralized[0].upVotesBy).toEqual([]);
    expect(neutralized[0].downVotesBy).toEqual([]);
  });

  it('should ignore optimisticVote for unknown thread id', () => {
    const initialState = [makeThread()];

    const nextState = reducer(initialState, optimisticVote({ threadId: 'thread-unknown', userId: 'user-1', voteType: 'up' }));

    expect(nextState).toEqual(initialState);
  });
});
