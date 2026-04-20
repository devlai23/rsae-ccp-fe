import PropTypes from 'prop-types';
import styled from 'styled-components';

const VotePanel = styled.div`
  min-width: 108px;
  border: 1px solid #efe4c7;
  border-radius: 18px;
  background: linear-gradient(180deg, #fffdf7 0%, #fbf6e9 100%);
  padding: 0.85rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
`;

const ArrowButton = styled.button`
  width: 38px;
  height: 38px;
  border: 1px solid
    ${(props) => {
      if (props.$active && props.$direction === 'up') {
        return '#479b5c';
      }

      if (props.$active && props.$direction === 'down') {
        return '#d16a58';
      }

      return '#ddd4c0';
    }};
  border-radius: 999px;
  background: ${(props) => {
    if (props.$active && props.$direction === 'up') {
      return '#ebf8ef';
    }

    if (props.$active && props.$direction === 'down') {
      return '#fdf0ed';
    }

    return '#ffffff';
  }};
  color: ${(props) => {
    if (props.$active && props.$direction === 'up') {
      return '#2f8a47';
    }

    if (props.$active && props.$direction === 'down') {
      return '#bf4f3e';
    }

    return '#7a7368';
  }};
  display: grid;
  place-items: center;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${(props) =>
      props.$direction === 'up' ? '#72b885' : '#de8f80'};
  }
`;

const ArrowIcon = styled.span`
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: ${(props) =>
    props.$direction === 'down' ? '11px solid currentColor' : '0'};
  border-bottom: ${(props) =>
    props.$direction === 'up' ? '11px solid currentColor' : '0'};
`;

const ScoreValue = styled.div`
  color: #171717;
  font-size: 1.18rem;
  font-weight: 800;
  line-height: 1;
`;

const ScoreLabel = styled.div`
  color: #6a655d;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Breakdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.12rem;
`;

const CountText = styled.span`
  color: ${(props) => (props.$tone === 'up' ? '#2f8a47' : '#bf4f3e')};
  font-size: 0.78rem;
  font-weight: 700;
`;

export default function ProposalVotePanel({
  currentVote,
  downvotes,
  onVote,
  upvotes,
  votes,
}) {
  return (
    <VotePanel>
      <ArrowButton
        type='button'
        $active={currentVote === 'up'}
        $direction='up'
        aria-label={currentVote === 'up' ? 'Remove upvote' : 'Upvote proposal'}
        aria-pressed={currentVote === 'up'}
        onClick={() => onVote('up')}
      >
        <ArrowIcon $direction='up' />
      </ArrowButton>

      <ScoreValue>{votes}</ScoreValue>
      <ScoreLabel>score</ScoreLabel>

      <ArrowButton
        type='button'
        $active={currentVote === 'down'}
        $direction='down'
        aria-label={
          currentVote === 'down' ? 'Remove downvote' : 'Downvote proposal'
        }
        aria-pressed={currentVote === 'down'}
        onClick={() => onVote('down')}
      >
        <ArrowIcon $direction='down' />
      </ArrowButton>

      <Breakdown>
        <CountText $tone='up'>{upvotes} up</CountText>
        <CountText $tone='down'>{downvotes} down</CountText>
      </Breakdown>
    </VotePanel>
  );
}

ProposalVotePanel.propTypes = {
  currentVote: PropTypes.oneOf(['up', 'down', null]),
  downvotes: PropTypes.number.isRequired,
  onVote: PropTypes.func.isRequired,
  upvotes: PropTypes.number.isRequired,
  votes: PropTypes.number.isRequired,
};

ProposalVotePanel.defaultProps = {
  currentVote: null,
};
