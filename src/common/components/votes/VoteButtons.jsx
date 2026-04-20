import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const VoteButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => {
    if (props.$active === 'up') return '#22c55e';
    if (props.$active === 'down') return '#ef4444';
    return '#9ca3af';
  }};
  transition: transform 0.1s ease, color 0.15s ease;

  &:hover {
    transform: scale(1.15);
    color: ${(props) => {
      if (props.$active === 'up') return '#16a34a';
      if (props.$active === 'down') return '#dc2626';
      return '#6b7280';
    }};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }
`;

const ArrowIcon = styled.svg`
  width: 18px;
  height: 18px;
`;

const Count = styled.span`
  font-size: 0.88rem;
  font-weight: 600;
  color: #4d4d4d;
  min-width: 2rem;
  text-align: center;
`;

const UpArrow = () => (
  <ArrowIcon viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 4l-8 8h5v8h6v-8h5z' />
  </ArrowIcon>
);

const DownArrow = () => (
  <ArrowIcon viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 20l8-8h-5v-8h-6v8h-5z' />
  </ArrowIcon>
);

export default function VoteButtons({ votes, userVote, onVote, disabled = false }) {
  const handleUpvote = () => onVote(userVote === 'up' ? null : 'up');
  const handleDownvote = () => onVote(userVote === 'down' ? null : 'down');

  return (
    <Container>
      <VoteButton
        $active={userVote === 'up' ? 'up' : null}
        onClick={handleUpvote}
        disabled={disabled}
        aria-label='Upvote'
      >
        <UpArrow />
      </VoteButton>
      <Count>{votes}</Count>
      <VoteButton
        $active={userVote === 'down' ? 'down' : null}
        onClick={handleDownvote}
        disabled={disabled}
        aria-label='Downvote'
      >
        <DownArrow />
      </VoteButton>
    </Container>
  );
}
