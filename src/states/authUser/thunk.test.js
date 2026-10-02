/**
 * Skenario pengujian:
 *
 * - asyncLogin thunk
 *   - should dispatch setAuthUser when login and profile fetch succeed
 *   - should dispatch setAuthError and rethrow when login fails
 * - asyncPreload thunk
 *   - should dispatch setAuthUser when stored session is valid
 *   - should dispatch unsetAuthUser when stored session is invalid
 * - asyncRegister thunk
 *   - should finish without error state when registration succeeds
 *   - should dispatch setAuthError and rethrow when registration fails
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { api } from '../../utils/api.js';
import {
  asyncLogin, asyncPreload, asyncRegister, setAuthUser, setAuthError, unsetAuthUser,
} from './slice.js';
import { showLoading, hideLoading } from '../loadingBar/slice.js';
import { setIsPreload } from '../isPreload/slice.js';

vi.mock('../../utils/api.js');

describe('authUser thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('asyncLogin thunk', () => {
    it('should dispatch setAuthUser when login and profile fetch succeed', async () => {
      const user = { id: 'user-1', name: 'Dicoding' };
      api.login.mockResolvedValue({ token: 'token' });
      api.getOwnProfile.mockResolvedValue({ user });
      const dispatch = vi.fn();

      await asyncLogin({ email: 'a@b.c', password: 'secret' })(dispatch);

      expect(api.login).toHaveBeenCalledWith({ email: 'a@b.c', password: 'secret' });
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(dispatch).toHaveBeenCalledWith(setAuthUser(user));
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });

    it('should dispatch setAuthError and rethrow when login fails', async () => {
      api.login.mockRejectedValue(new Error('email or password is wrong'));
      const dispatch = vi.fn();

      await expect(asyncLogin({ email: 'a@b.c', password: 'wrong' })(dispatch)).rejects.toThrow();

      expect(dispatch).toHaveBeenCalledWith(setAuthError('email or password is wrong'));
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
      expect(dispatch).not.toHaveBeenCalledWith(setAuthUser(expect.anything()));
    });
  });

  describe('asyncPreload thunk', () => {
    it('should dispatch setAuthUser when stored session is valid', async () => {
      const user = { id: 'user-1', name: 'Dicoding' };
      api.getOwnProfile.mockResolvedValue({ user });
      const dispatch = vi.fn();

      await asyncPreload()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setAuthUser(user));
      expect(dispatch).toHaveBeenCalledWith(setIsPreload(false));
    });

    it('should dispatch unsetAuthUser when stored session is invalid', async () => {
      api.getOwnProfile.mockRejectedValue(new Error('unauthorized'));
      const dispatch = vi.fn();

      await asyncPreload()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(unsetAuthUser());
      expect(dispatch).toHaveBeenCalledWith(setIsPreload(false));
    });
  });

  describe('asyncRegister thunk', () => {
    it('should finish without error state when registration succeeds', async () => {
      api.register.mockResolvedValue({ user: { id: 'user-1' } });
      const dispatch = vi.fn();

      await asyncRegister({ name: 'Dicoding', email: 'a@b.c', password: 'secret' })(dispatch);

      expect(api.register).toHaveBeenCalledWith({ name: 'Dicoding', email: 'a@b.c', password: 'secret' });
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });

    it('should dispatch setAuthError and rethrow when registration fails', async () => {
      api.register.mockRejectedValue(new Error('email is already used'));
      const dispatch = vi.fn();

      await expect(
        asyncRegister({ name: 'Dicoding', email: 'a@b.c', password: 'secret' })(dispatch),
      ).rejects.toThrow();

      expect(dispatch).toHaveBeenCalledWith(setAuthError('email is already used'));
    });
  });
});
