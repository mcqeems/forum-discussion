function voteTypeOf({ upVotesBy, downVotesBy }, userId) {
  if (!userId) {
    return 'neutral';
  }
  if (upVotesBy.includes(userId)) {
    return 'up';
  }
  if (downVotesBy.includes(userId)) {
    return 'down';
  }
  return 'neutral';
}

function VoteButton({ upVotesBy, downVotesBy, authUserId, onVote }) {
  const current = voteTypeOf({ upVotesBy, downVotesBy }, authUserId);
  const score = upVotesBy.length - downVotesBy.length;

  const handleClick = (type) => {
    if (!authUserId) {
      return;
    }
    onVote(current === type ? 'neutral' : type);
  };

  return (
    <div className="votes">
      <button
        type="button"
        aria-label="up vote"
        className={current === 'up' ? 'vote-btn active-up' : 'vote-btn'}
        onClick={() => handleClick('up')}
        disabled={!authUserId}
        title={authUserId ? 'Up vote' : 'Masuk untuk vote'}
      >
        ▲ {upVotesBy.length}
      </button>
      <span className="vote-score">{score}</span>
      <button
        type="button"
        aria-label="down vote"
        className={current === 'down' ? 'vote-btn active-down' : 'vote-btn'}
        onClick={() => handleClick('down')}
        disabled={!authUserId}
        title={authUserId ? 'Down vote' : 'Masuk untuk vote'}
      >
        ▼ {downVotesBy.length}
      </button>
    </div>
  );
}

export default VoteButton;
