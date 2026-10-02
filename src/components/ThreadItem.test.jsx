/**
 * Skenario pengujian:
 *
 * - ThreadItem component
 *   - should render thread title, category, and owner name
 *   - should disable vote buttons when no user is logged in
 *   - should dispatch vote thunk when logged in user clicks up vote
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThreadItem from './ThreadItem.jsx';
import authUserReducer from '../states/authUser/slice.js';
import usersReducer from '../states/users/slice.js';
import threadsReducer, { asyncVoteThread } from '../states/threads/slice.js';

vi.mock('../states/threads/slice.js', async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, asyncVoteThread: vi.fn(() => ({ type: 'mock/vote' })) };
});

const thread = {
  id: 'thread-1',
  title: 'Belajar React itu seru',
  body: '<p>Isi thread</p>',
  category: 'react',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: ['user-2'],
  downVotesBy: [],
  totalComments: 3,
};

function renderThreadItem({ user = null } = {}) {
  const store = configureStore({
    reducer: { authUser: authUserReducer, users: usersReducer, threads: threadsReducer },
    preloadedState: {
      authUser: { user, error: '' },
      users: [{ id: 'user-1', name: 'Dicoding', avatar: 'https://avatar.url' }],
      threads: [thread],
    },
  });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThreadItem thread={thread} />
      </MemoryRouter>
    </Provider>,
  );
  return store;
}

describe('ThreadItem component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render thread title, category, and owner name', () => {
    renderThreadItem();

    expect(screen.getByText('Belajar React itu seru')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('Dicoding')).toBeInTheDocument();
    expect(screen.getByText(/3 komentar/)).toBeInTheDocument();
  });

  it('should disable vote buttons when no user is logged in', () => {
    renderThreadItem({ user: null });

    expect(screen.getByLabelText('up vote')).toBeDisabled();
    expect(screen.getByLabelText('down vote')).toBeDisabled();
  });

  it('should dispatch vote thunk when logged in user clicks up vote', async () => {
    renderThreadItem({ user: { id: 'user-9', name: 'Reviewer' } });

    await userEvent.click(screen.getByLabelText('up vote'));

    expect(asyncVoteThread).toHaveBeenCalledWith({ threadId: 'thread-1', userId: 'user-9', voteType: 'up' });
  });
});
