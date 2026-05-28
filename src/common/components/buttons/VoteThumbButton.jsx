import { Icon } from '@/assets/icons/icons';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const VoteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid ${({ $voted }) => ($voted ? '#e0d39a' : '#d8d8d8')};
  background: ${({ $voted }) => ($voted ? '#f4ca25' : '#ffffff')};
  color: ${({ $voted }) => ($voted ? '#1a1a1a' : '#9a9a9a')};
  border-radius: 999px;
  width: 2rem;
  height: 2rem;
  padding: 0;
  cursor: pointer;

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }

  &:hover:not(:disabled) {
    background: ${({ $voted }) => ($voted ? '#e8bc20' : '#f8ebc3')};
    border-color: #e0d39a;
    color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function VoteThumbButton({
  hasVoted = false,
  isVoting = false,
  onClick,
  ...rest
}) {
  const ariaLabel = isVoting
    ? 'Submitting vote'
    : hasVoted
      ? 'Remove your vote'
      : 'Vote for this idea';

  return (
    <VoteButton
      type='button'
      onClick={onClick}
      disabled={isVoting}
      $voted={hasVoted}
      aria-label={ariaLabel}
      aria-pressed={hasVoted}
      {...rest}
    >
      <Icon.thumbUp aria-hidden='true' />
    </VoteButton>
  );
}

VoteThumbButton.propTypes = {
  hasVoted: PropTypes.bool,
  isVoting: PropTypes.bool,
  onClick: PropTypes.func,
};
