import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import postedAt from '../utils/postedAt.js';
import { asyncVoteThread } from '../states/threads/slice.js';
import VoteButton from './VoteButton.jsx';

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

function ThreadItem({ thread }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authUser);
  const owner = useSelector((state) => state.users.find((u) => u.id === thread.ownerId));

  const onVote = (voteType) => {
    if (!user) {
      return;
    }
    dispatch(asyncVoteThread({ threadId: thread.id, userId: user.id, voteType }));
  };

  return (
    <article className="card">
      <div className="card-main">
        <p className="meta">
          <span className="category">#{thread.category}</span>
          <span> · {postedAt(thread.createdAt)}</span>
          <span> · {thread.totalComments} komentar</span>
        </p>
        <Link to={`/threads/${thread.id}`} className="thread-title">{thread.title}</Link>
        <p className="thread-snippet">{stripHtml(thread.body).slice(0, 140)}</p>
        <div className="owner-row">
          {owner && <img src={owner.avatar} alt={owner.name} className="avatar-sm" />}
          <span>{owner ? owner.name : thread.ownerId}</span>
        </div>
      </div>
      <VoteButton
        upVotesBy={thread.upVotesBy}
        downVotesBy={thread.downVotesBy}
        authUserId={user?.id}
        onVote={onVote}
      />
    </article>
  );
}

export default ThreadItem;
