import VoteThumbButton from '@/common/components/buttons/VoteThumbButton';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #dfdfdf;
  border-radius: 15px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  overflow: hidden;
  margin-bottom: 1.2rem;
`;

const CategoryAccentBar = styled.div`
  background-color: #f4ca25;
  width: 8px;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  padding: 1.3rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
`;

const CategoryBadge = styled.span`
  border-radius: 6px;
  border: 1px solid ${(props) => props.$borderColor || '#d5d5d5'};
  background-color: ${(props) => props.$backgroundColor || '#f4f4f4'};
  color: ${(props) => props.$textColor || '#3d3d3d'};
  padding: 0.24rem 0.58rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const VoteCount = styled.div`
  color: #4d4d4d;
  font-size: 0.88rem;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;
  color: #333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FooterRow = styled.div`
  border-top: 1px solid #e7e7e7;
  margin-top: 0.1rem;
  padding-top: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DateText = styled.span`
  color: #7f7f7f;
  font-size: 0.85rem;
  font-weight: 600;
`;

const DetailButton = styled.button`
  border: none;
  background: none;
  color: #1a1a1a;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: #f4ca25;
  }
`;

const VoteBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const getCategoryBadgeColors = (category) => {
  const normalized = category?.trim().toLowerCase().replace(/&/g, 'and') || '';

  if (normalized.includes('hous')) {
    return {
      backgroundColor: '#E8F1FB',
      borderColor: '#8FB7E3',
      textColor: '#1F5F99',
    };
  }

  if (normalized.includes('health') || normalized.includes('wellness')) {
    return {
      backgroundColor: '#E7F5EC',
      borderColor: '#8AC9A3',
      textColor: '#226A42',
    };
  }

  if (normalized.includes('econ')) {
    return {
      backgroundColor: '#FFF0E3',
      borderColor: '#E7B07A',
      textColor: '#A45508',
    };
  }

  if (normalized.includes('art') || normalized.includes('cult')) {
    return {
      backgroundColor: '#F6EAF4',
      borderColor: '#D7A9CF',
      textColor: '#8A467B',
    };
  }

  if (normalized.includes('educ')) {
    return {
      backgroundColor: '#E7F4F2',
      borderColor: '#86C3BB',
      textColor: '#17685F',
    };
  }

  return {
    backgroundColor: '#F3F3F3',
    borderColor: '#D4D4D4',
    textColor: '#4A4A4A',
  };
};

export default function ProposalEntry({
  title,
  category,
  description,
  date,
  votes,
  onCommentClick,
  onVote,
  hasVoted = false,
  voteAllowed = true,
  isVoting = false,
}) {
  const badgeColors = getCategoryBadgeColors(category);

  return (
    <CardContainer>
      <CategoryAccentBar />
      <ContentContainer>
        <HeaderRow>
          <TitleGroup>
            <Title>{title}</Title>
            <CategoryBadge
              $backgroundColor={badgeColors.backgroundColor}
              $borderColor={badgeColors.borderColor}
              $textColor={badgeColors.textColor}
            >
              {category}
            </CategoryBadge>
          </TitleGroup>
          <VoteBlock>
            {voteAllowed && onVote ? (
              <VoteThumbButton
                hasVoted={hasVoted}
                isVoting={isVoting}
                onClick={onVote}
              />
            ) : null}
            <VoteCount>{votes} Votes</VoteCount>
          </VoteBlock>
        </HeaderRow>

        <Description>{description}</Description>

        <FooterRow>
          <DateText>{date}</DateText>
          <DetailButton onClick={onCommentClick}>View Details</DetailButton>
        </FooterRow>
      </ContentContainer>
    </CardContainer>
  );
}
