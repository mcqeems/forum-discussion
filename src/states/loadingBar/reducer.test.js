/**
 * Skenario pengujian:
 *
 * - loadingBarReducer function
 *   - should return the initial state when given an unknown action
 *   - should increment the counter when given showLoading action
 *   - should decrement the counter when given hideLoading action
 *   - should never go below zero when given hideLoading on empty counter
 */

import { describe, it, expect } from 'vitest';
import reducer, { showLoading, hideLoading } from './slice.js';

describe('loadingBarReducer function', () => {
  it('should return the initial state when given an unknown action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toBe(0);
  });

  it('should increment the counter when given showLoading action', () => {
    expect(reducer(0, showLoading())).toBe(1);
    expect(reducer(2, showLoading())).toBe(3);
  });

  it('should decrement the counter when given hideLoading action', () => {
    expect(reducer(2, hideLoading())).toBe(1);
  });

  it('should never go below zero when given hideLoading on empty counter', () => {
    expect(reducer(0, hideLoading())).toBe(0);
  });
});
