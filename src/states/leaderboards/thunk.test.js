/**
 * Skenario pengujian:
 *
 * - asyncPopulateLeaderboards thunk
 *   - should dispatch setLeaderboards when fetching leaderboards succeeds
 *   - should hide loading even when fetching leaderboards fails
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { api } from '../../utils/api.js';
import { asyncPopulateLeaderboards, setLeaderboards } from './slice.js';
import { hideLoading } from '../loadingBar/slice.js';

vi.mock('../../utils/api.js');

describe('asyncPopulateLeaderboards thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch setLeaderboards when fetching leaderboards succeeds', async () => {
    const leaderboards = [{ user: { id: 'user-1' }, score: 10 }];
    api.getLeaderboards.mockResolvedValue({ leaderboards });
    const dispatch = vi.fn();

    await asyncPopulateLeaderboards()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(setLeaderboards(leaderboards));
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should hide loading even when fetching leaderboards fails', async () => {
    api.getLeaderboards.mockRejectedValue(new Error('network error'));
    const dispatch = vi.fn();

    await expect(asyncPopulateLeaderboards()(dispatch)).rejects.toThrow();

    expect(dispatch).not.toHaveBeenCalledWith(setLeaderboards(expect.anything()));
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });
});
