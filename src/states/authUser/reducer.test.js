/**
 * Skenario pengujian:
 *
 * - authUserReducer function
 *   - should return the initial state when given an unknown action
 *   - should store the user and clear error when given setAuthUser action
 *   - should store the error when given setAuthError action
 *   - should clear the user and error when given unsetAuthUser action
 */

import { describe, it, expect } from 'vitest';
import reducer, { setAuthUser, setAuthError, unsetAuthUser } from './slice.js';

describe('authUserReducer function', () => {
  it('should return the initial state when given an unknown action', () => {
    const nextState = reducer(undefined, { type: 'UNKNOWN' });

    expect(nextState).toEqual({ user: null, error: '' });
  });

  it('should store the user and clear error when given setAuthUser action', () => {
    const initialState = { user: null, error: 'previous error' };
    const user = { id: 'user-1', name: 'Dicoding', avatar: 'https://avatar.url' };

    const nextState = reducer(initialState, setAuthUser(user));

    expect(nextState).toEqual({ user, error: '' });
  });

  it('should store the error when given setAuthError action', () => {
    const nextState = reducer(undefined, setAuthError('email or password is wrong'));

    expect(nextState).toEqual({ user: null, error: 'email or password is wrong' });
  });

  it('should clear the user and error when given unsetAuthUser action', () => {
    const initialState = { user: { id: 'user-1' }, error: 'some error' };

    const nextState = reducer(initialState, unsetAuthUser());

    expect(nextState).toEqual({ user: null, error: '' });
  });
});
