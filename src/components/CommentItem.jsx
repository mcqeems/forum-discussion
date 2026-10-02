import { useDispatch, useSelector } from 'react-redux';
import postedAt from '../utils/postedAt.js';
import { asyncVoteComment } from '../states/threadDetail/slice.js';
import VoteButton from './VoteButton.jsx';

function CommentItem({ threadId, comment }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authUser);

  const onVote = (voteType) => {
    if (!user) {
      return;
    }
    dispatch(asyncVoteComment({ threadId, commentId: comment.id, userId: user.id, voteType }));
  };

  return (
    <div className="comment">
      <div className="owner-row">
        <img src={comment.owner.avatar} alt={comment.owner.name} className="avatar-sm" />
        <strong>{comment.owner.name}</strong>
        <span className="muted">· {postedAt(comment.createdAt)}</span>
      </div>
      <div className="comment-body" dangerouslySetInnerHTML={{ __html: comment.content }} />
      <VoteButton
        upVotesBy={comment.upVotesBy}
        downVotesBy={comment.downVotesBy}
        authUserId={user?.id}
        onVote={onVote}
      />
    </div>
  );
}

export default CommentItem;
