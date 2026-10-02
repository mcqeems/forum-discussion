import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import postedAt from '../utils/postedAt.js';
import { asyncGetDetail, asyncCreateComment, asyncVoteDetailThread } from '../states/threadDetail/slice.js';
import VoteButton from '../components/VoteButton.jsx';
import CommentItem from '../components/CommentItem.jsx';

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const detail = useSelector((state) => state.threadDetail);
  const { user } = useSelector((state) => state.authUser);
  const [content, setContent] = useState('');

  useEffect(() => {
    dispatch(asyncGetDetail(id));
  }, [dispatch, id]);

  if (!detail) {
    return <p className="muted">Memuat detail thread…</p>;
  }

  const onVoteThread = (voteType) => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(asyncVoteDetailThread({ threadId: detail.id, userId: user.id, voteType }));
  };

  const onSubmitComment = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!content.trim()) {
      return;
    }
    await dispatch(asyncCreateComment(detail.id, content));
    setContent('');
  };

  return (
    <section>
      <Link to="/" className="muted">← Kembali</Link>
      <p className="meta">#{detail.category} · {postedAt(detail.createdAt)}</p>
      <h1>{detail.title}</h1>
      <div className="owner-row">
        <img src={detail.owner.avatar} alt={detail.owner.name} className="avatar-sm" />
        <strong>{detail.owner.name}</strong>
      </div>
      <div className="thread-body" dangerouslySetInnerHTML={{ __html: detail.body }} />
      <VoteButton
        upVotesBy={detail.upVotesBy}
        downVotesBy={detail.downVotesBy}
        authUserId={user?.id}
        onVote={onVoteThread}
      />
      <h2>Komentar ({detail.comments.length})</h2>
      <form onSubmit={onSubmitComment} className="form">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={user ? 'Tulis komentar…' : 'Masuk untuk berkomentar'}
          rows={3}
        />
        <button type="submit" className="btn btn-primary">Kirim Komentar</button>
      </form>
      <div className="list">
        {detail.comments.map((comment) => (
          <CommentItem key={comment.id} threadId={detail.id} comment={comment} />
        ))}
      </div>
    </section>
  );
}

export default DetailPage;
