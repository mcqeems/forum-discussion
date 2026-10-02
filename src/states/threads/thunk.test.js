/**
 * Skenario pengujian:
 *
 * - asyncPopulateThreads thunk
 *   - should dispatch setThreads when fetching threads succeeds
 * - asyncCreateThread thunk
 *   - should dispatch addThread and return the thread when creation succeeds
 * - asyncVoteThread thunk
 *   - should dispatch optimisticVote and call up-vote API when voting succeeds
 *   - should restore previous threads when voting fails
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { api } from '../../utils/api.js';
import {
  asyncPopulateThreads, asyncCreateThread, asyncVoteThread, setThreads, addThread, optimisticVote,
} from './slice.js';

vi.mock('../../utils/api.js');

describe('threads thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('asyncPopulateThreads should dispatch setThreads when fetching threads succeeds', async () => {
    const threads = [{ id: 'thread-1' }];
    api.getThreads.mockResolvedValue({ threads });
    const dispatch = vi.fn();

    await asyncPopulateThreads()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setThreads(threads));
  });

  it('asyncCreateThread should dispatch addThread and return the thread when creation succeeds', async () => {
    const thread = { id: 'thread-1', title: 'Halo' };
    api.createThread.mockResolvedValue({ thread });
    const dispatch = vi.fn();

    const result = await asyncCreateThread({ title: 'Halo', body: 'Isi', category: 'general' })(dispatch);

    expect(api.createThread).toHaveBeenCalledWith({ title: 'Halo', body: 'Isi', category: 'general' });
    expect(dispatch).toHaveBeenCalledWith(addThread(thread));
    expect(result).toEqual(thread);
  });

  it('asyncVoteThread should dispatch optimisticVote and call up-vote API when voting succeeds', async () => {
    api.upVoteThread.mockResolvedValue({});
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({ threads: [] }));

    await asyncVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: 'up' })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(optimisticVote({ threadId: 'thread-1', userId: 'user-1', voteType: 'up' }));
    expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
  });

  it('asyncVoteThread should restore previous threads when voting fails', async () => {
    const prev = [{ id: 'thread-1' }];
    api.downVoteThread.mockRejectedValue(new Error('network error'));
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({ threads: prev }));

    await asyncVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: 'down' })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(setThreads(prev));
  });
});
