import VoteButton from './VoteButton.jsx';

export default {
  title: 'Components/VoteButton',
  component: VoteButton,
};

export function Default() {
  return <VoteButton upVotesBy={[]} downVotesBy={[]} authUserId="user-1" onVote={() => {}} />;
}

export function VotedUp() {
  return (
    <VoteButton
      upVotesBy={['user-1', 'user-2']}
      downVotesBy={[]}
      authUserId="user-1"
      onVote={() => {}}
    />
  );
}

export function VotedDown() {
  return (
    <VoteButton
      upVotesBy={['user-2']}
      downVotesBy={['user-1']}
      authUserId="user-1"
      onVote={() => {}}
    />
  );
}

export function LoggedOut() {
  return <VoteButton upVotesBy={['user-2']} downVotesBy={[]} authUserId={null} onVote={() => {}} />;
}
