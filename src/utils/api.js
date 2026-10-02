const BASE_URL = 'https://forum-api.dicoding.dev/v1';

function getToken() {
  return localStorage.getItem('forum-access-token');
}

function withAuth(headers = {}) {
  const token = getToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
}

async function handleResponse(response) {
  const json = await response.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Request failed');
  }
  return json.data;
}

async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: withAuth(body ? { 'Content-Type': 'application/json' } : {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse(response);
}

function putToken(token) {
  localStorage.setItem('forum-access-token', token);
}

function clearToken() {
  localStorage.removeItem('forum-access-token');
}

const api = {
  register: ({ name, email, password }) => request('/register', {
    method: 'POST',
    body: { name, email, password },
  }),
  login: async ({ email, password }) => {
    const data = await request('/login', { method: 'POST', body: { email, password } });
    putToken(data.token);
    return data;
  },
  getOwnProfile: () => request('/users/me', { auth: true }),
  getAllUsers: () => request('/users'),
  getThreads: () => request('/threads'),
  createThread: ({ title, body, category }) => request('/threads', {
    method: 'POST',
    body: { title, body, category },
    auth: true,
  }),
  getThreadDetail: (id) => request(`/threads/${id}`),
  createComment: (threadId, content) => request(`/threads/${threadId}/comments`, {
    method: 'POST',
    body: { content },
    auth: true,
  }),
  upVoteThread: (id) => request(`/threads/${id}/up-vote`, { method: 'POST', auth: true }),
  downVoteThread: (id) => request(`/threads/${id}/down-vote`, { method: 'POST', auth: true }),
  neutralizeThread: (id) => request(`/threads/${id}/neutral-vote`, { method: 'POST', auth: true }),
  upVoteComment: (threadId, commentId) => request(`/threads/${threadId}/comments/${commentId}/up-vote`, { method: 'POST', auth: true }),
  downVoteComment: (threadId, commentId) => request(`/threads/${threadId}/comments/${commentId}/down-vote`, { method: 'POST', auth: true }),
  neutralizeComment: (threadId, commentId) => request(`/threads/${threadId}/comments/${commentId}/neutral-vote`, { method: 'POST', auth: true }),
  getLeaderboards: () => request('/leaderboards'),
};

export { api, putToken, clearToken, getToken };
