import ProposalVotePanel from '@/common/components/proposals/ProposalVotePanel';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 24px;
  width: 92%;
  max-width: 900px;
  max-height: 86vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1.3rem;
  border: none;
  background: none;
  font-size: 1.4rem;
  color: #8f8f8f;
  cursor: pointer;
`;

const Title = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1.75rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderCopy = styled.div`
  flex: 1;
  min-width: 0;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-bottom: 1.2rem;
  color: #666;
  font-size: 0.9rem;
`;

const InfoBadge = styled.span`
  border: 1px solid #e4e4e4;
  border-radius: 999px;
  background: #f9f9f9;
  padding: 0.2rem 0.6rem;
`;

const DetailBox = styled.div`
  border: 1px solid #e4e4e4;
  border-radius: 14px;
  background: #fafafa;
  padding: 1rem;
  margin-top: 0.8rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const Text = styled.p`
  margin: 0.55rem 0 0;
  line-height: 1.6;
  color: #2e2e2e;
`;

const TagsWrap = styled.div`
  margin-top: 0.6rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const TagChip = styled.span`
  border: 1px solid #d9d9d9;
  border-radius: 999px;
  background: #fff;
  padding: 0.2rem 0.6rem;
  font-size: 0.78rem;
  color: #555;
`;

const StateText = styled.div`
  margin-top: 1rem;
  border: 1px dashed #d5d5d5;
  border-radius: 12px;
  background: #fbfbfb;
  color: ${(props) => (props.$error ? '#cb3939' : '#696969')};
  padding: 0.95rem;
`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function ProposalModal({
  proposalData,
  isLoading,
  error,
  onClose,
  onVote,
}) {
  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(event) => event.stopPropagation()}>
        <CloseButton onClick={onClose}>x</CloseButton>

        {isLoading ? <StateText>Loading proposal details...</StateText> : null}

        {!isLoading && error ? <StateText $error>{error}</StateText> : null}

        {!isLoading && !error && proposalData ? (
          <>
            <HeaderRow>
              <HeaderCopy>
                <Title>{proposalData.title}</Title>
                <Meta>
                  <InfoBadge>Category: {proposalData.category}</InfoBadge>
                  <InfoBadge>Status: {proposalData.status}</InfoBadge>
                  <InfoBadge>
                    Submitted By: {proposalData.submittedBy}
                  </InfoBadge>
                  <InfoBadge>
                    Submitted: {formatDate(proposalData.submittedAt)}
                  </InfoBadge>
                </Meta>
              </HeaderCopy>

              <ProposalVotePanel
                currentVote={proposalData.currentVote}
                downvotes={proposalData.downvotes}
                onVote={onVote}
                upvotes={proposalData.upvotes}
                votes={proposalData.votes}
              />
            </HeaderRow>

            <DetailBox>
              <SectionTitle>Description</SectionTitle>
              <Text>{proposalData.description}</Text>
            </DetailBox>

            <DetailBox>
              <SectionTitle>Tags</SectionTitle>
              {proposalData.tags?.length ? (
                <TagsWrap>
                  {proposalData.tags.map((tag) => (
                    <TagChip key={tag}>{tag}</TagChip>
                  ))}
                </TagsWrap>
              ) : (
                <Text>No tags provided.</Text>
              )}
            </DetailBox>
          </>
        ) : null}
      </ModalContent>
    </Overlay>
  );
}

ProposalModal.propTypes = {
  error: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onVote: PropTypes.func.isRequired,
  proposalData: PropTypes.shape({
    category: PropTypes.string.isRequired,
    currentVote: PropTypes.oneOf(['up', 'down', null]),
    description: PropTypes.string.isRequired,
    downvotes: PropTypes.number.isRequired,
    status: PropTypes.string,
    submittedAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
    submittedBy: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string.isRequired,
    upvotes: PropTypes.number.isRequired,
    votes: PropTypes.number.isRequired,
  }),
};

ProposalModal.defaultProps = {
  proposalData: null,
};
