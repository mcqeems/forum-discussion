import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem.jsx';
import authUserReducer from '../states/authUser/slice.js';
import usersReducer from '../states/users/slice.js';
import threadsReducer from '../states/threads/slice.js';

const thread = {
  id: 'thread-1',
  title: 'Belajar React itu seru',
  body: '<p>Isi thread pertama untuk storybook</p>',
  category: 'react',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: ['user-2'],
  downVotesBy: [],
  totalComments: 3,
};

function WithStore({ children, user = null }) {
  const store = configureStore({
    reducer: { authUser: authUserReducer, users: usersReducer, threads: threadsReducer },
    preloadedState: {
      authUser: { user, error: '' },
      users: [{ id: 'user-1', name: 'Dicoding', avatar: 'https://ui-avatars.com/api/?name=D&background=random' }],
      threads: [thread],
    },
  });
  return (
    <Provider store={store}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </Provider>
  );
}

export default {
  title: 'Components/ThreadItem',
  component: ThreadItem,
};

export function LoggedOut() {
  return (
    <WithStore>
      <ThreadItem thread={thread} />
    </WithStore>
  );
}

export function LoggedIn() {
  return (
    <WithStore user={{ id: 'user-9', name: 'Reviewer' }}>
      <ThreadItem thread={thread} />
    </WithStore>
  );
}
