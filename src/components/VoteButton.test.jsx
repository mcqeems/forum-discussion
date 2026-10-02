/**
 * Skenario pengujian:
 *
 * - VoteButton component
 *   - should render up vote count, down vote count, and score
 *   - should call onVote with up when up vote button is clicked
 *   - should call onVote with neutral when active vote button is clicked again
 *   - should disable buttons when no user is logged in
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoteButton from './VoteButton.jsx';

describe('VoteButton component', () => {
  it('should render up vote count, down vote count, and score', () => {
    render(<VoteButton upVotesBy={['user-1', 'user-2']} downVotesBy={['user-3']} authUserId="user-4" onVote={() => {}} />);

    expect(screen.getByLabelText('up vote')).toHaveTextContent('2');
    expect(screen.getByLabelText('down vote')).toHaveTextContent('1');
    expect(screen.getByText('1')).toBeInTheDocument(); // score = 2 - 1
  });

  it('should call onVote with up when up vote button is clicked', async () => {
    const onVote = vi.fn();
    render(<VoteButton upVotesBy={[]} downVotesBy={[]} authUserId="user-1" onVote={onVote} />);

    await userEvent.click(screen.getByLabelText('up vote'));

    expect(onVote).toHaveBeenCalledWith('up');
  });

  it('should call onVote with neutral when active vote button is clicked again', async () => {
    const onVote = vi.fn();
    render(<VoteButton upVotesBy={['user-1']} downVotesBy={[]} authUserId="user-1" onVote={onVote} />);

    await userEvent.click(screen.getByLabelText('up vote'));

    expect(onVote).toHaveBeenCalledWith('neutral');
  });

  it('should disable buttons when no user is logged in', () => {
    render(<VoteButton upVotesBy={[]} downVotesBy={[]} authUserId={null} onVote={() => {}} />);

    expect(screen.getByLabelText('up vote')).toBeDisabled();
    expect(screen.getByLabelText('down vote')).toBeDisabled();
  });
});
