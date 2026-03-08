import { useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import { auth } from '@/firebase-config';

const PAGE_SIZE = 4;

const PageContainer = styled.div`
  background-color: #f8f8f6;
  min-height: calc(100vh - 100px);
  padding: 3rem 4rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Header = styled.h1`
  margin: 0 0 2rem;
  color: #101010;
  font-size: 3rem;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 2.1rem;
  }
`;

const StatsRow = styled.section`
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.8rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  min-height: 150px;
  border: 1px solid #e0e0e0;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #141414;
`;

const PendingBadge = styled.span`
  border: 1px solid #ffd5da;
  border-radius: 999px;
  background-color: #ffe6ea;
  color: #e23256;
  padding: 0.3rem 0.85rem;
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
`;

const CardValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
`;

const MainNumber = styled.span`
  color: #c79a00;
  font-size: 2.9rem;
  line-height: 1;
  font-weight: 800;
`;

const SubText = styled.span`
  color: #6d6d6d;
  font-size: 1.7rem;
`;

const BottomGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(480px, 2fr);
  gap: 1.8rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  border: 1px solid #dfdfdf;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #171717;
  font-size: 2.3rem;
  font-weight: 800;
`;

const DistList = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DistItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.45rem 0.8rem;
`;

const DistName = styled.span`
  color: #5a6c88;
  font-size: 1.5rem;
`;

const DistValue = styled.span`
  color: #151515;
  font-weight: 700;
  font-size: 1.45rem;
`;

const Track = styled.div`
  grid-column: 1 / -1;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #f0f0f2;
  overflow: hidden;
`;

const Fill = styled.div`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  border-radius: inherit;
  background: ${(props) => props.$color};
`;

const ProposalsPanel = styled(Panel)`
  min-height: 420px;
  display: flex;
  flex-direction: column;
`;

const ProposalList = styled.div`
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const ProposalCard = styled.article`
  border: 1px solid #e4e4e4;
  border-left: 8px solid #f4ca25;
  border-radius: 14px;
  background: #fff;
  padding: 1rem 1.1rem;
`;

const ProposalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
`;

const ProposalTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  color: #151515;
`;

const ProposalMeta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  font-size: 0.84rem;
  color: #6f6f6f;
`;

const CategoryChip = styled.span`
  border-radius: 999px;
  background: #ffe8d1;
  color: #95580f;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
`;

const VoteText = styled.span`
  color: #525252;
  font-size: 0.86rem;
  font-weight: 700;
`;

const ProposalDescription = styled.p`
  margin: 0.8rem 0 0;
  font-size: 0.9rem;
  color: #2f2f2f;
  line-height: 1.45;
`;

const PaginationRow = styled.div`
  margin-top: 1rem;
  border-top: 1px solid #ececec;
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;

const PaginationInfo = styled.span`
  color: #656565;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  background: ${(props) => (props.disabled ? '#f2f2f2' : '#ffffff')};
  color: ${(props) => (props.disabled ? '#a4a4a4' : '#1d1d1d')};
  padding: 0.45rem 0.85rem;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 0.88rem;
  font-weight: 600;
`;

const StatusBox = styled.div`
  border: 1px dashed #d7d7d7;
  border-radius: 12px;
  background: #fbfbfb;
  color: ${(props) => (props.$error ? '#c03f3f' : '#6f6f6f')};
  min-height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  text-align: center;
`;

const formatCardValue = (value) => {
  if (value >= 1000 && value % 1000 === 0) {
    return `${value / 1000}K`;
  }

  return value.toLocaleString();
};

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const getFillColor = (index) => {
  const colors = ['#f4ca25', '#e3c45f', '#decf95', '#ddd6b1', '#e3dfc8'];
  return colors[index % colors.length];
};

const buildDashboardUrl = (endpoint) => {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
  if (!backendBaseUrl) {
    throw new Error('Missing VITE_BACKEND_URL in frontend environment config.');
  }

  return `${backendBaseUrl}${endpoint}`;
};

async function fetchDashboardJson(endpoint) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    throw new Error('You must be logged in as admin to view dashboard data.');
  }

  const response = await fetch(buildDashboardUrl(endpoint), {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

function StatCard({ card }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
        {card.pendingCount > 0 && (
          <PendingBadge>{card.pendingCount} pending</PendingBadge>
        )}
      </CardHeader>
      <CardValueRow>
        <MainNumber>{formatCardValue(card.value)}</MainNumber>
        <SubText>{card.timeframe}</SubText>
      </CardValueRow>
    </Card>
  );
}

function DashboardProposalCard({ proposal }) {
  return (
    <ProposalCard>
      <ProposalHeader>
        <div>
          <ProposalTitle>{proposal.title}</ProposalTitle>
          <ProposalMeta>
            <span>{proposal.submittedBy}</span>
            <span>-</span>
            <span>{formatDate(proposal.submittedAt)}</span>
          </ProposalMeta>
        </div>

        <div>
          <CategoryChip>{proposal.category}</CategoryChip>
          <VoteText>{proposal.votes} votes</VoteText>
        </div>
      </ProposalHeader>

      <ProposalDescription>{proposal.description}</ProposalDescription>
    </ProposalCard>
  );
}

export default function DataDashboard() {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });

  const [page, setPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isProposalLoading, setIsProposalLoading] = useState(false);
  const [initialError, setInitialError] = useState('');
  const [proposalError, setProposalError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setIsInitialLoading(true);
      setInitialError('');

      try {
        const [metricsData, categoriesData, proposalsData] = await Promise.all([
          fetchDashboardJson('/dashboard/metrics'),
          fetchDashboardJson('/dashboard/categories'),
          fetchDashboardJson(`/dashboard/proposals?page=1&limit=${PAGE_SIZE}`),
        ]);

        setCards(metricsData.cards || []);
        setCategories(categoriesData.categories || []);
        setProposals(proposalsData.items || []);
        setPagination(
          proposalsData.pagination || {
            page: 1,
            limit: PAGE_SIZE,
            totalItems: 0,
            totalPages: 1,
          }
        );
        setPage(1);
      } catch (error) {
        setInitialError(error.message || 'Failed to load dashboard data.');
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    if (isInitialLoading || page === 1) {
      return;
    }

    const loadProposalsByPage = async () => {
      setIsProposalLoading(true);
      setProposalError('');

      try {
        const proposalsData = await fetchDashboardJson(
          `/dashboard/proposals?page=${page}&limit=${PAGE_SIZE}`
        );

        setProposals(proposalsData.items || []);
        setPagination(
          proposalsData.pagination || {
            page,
            limit: PAGE_SIZE,
            totalItems: 0,
            totalPages: 1,
          }
        );
      } catch (error) {
        setProposalError(error.message || 'Failed to load proposals.');
      } finally {
        setIsProposalLoading(false);
      }
    };

    loadProposalsByPage();
  }, [isInitialLoading, page]);

  const paginationLabel = useMemo(() => {
    if (!pagination.totalItems) {
      return 'No submissions yet';
    }
    return `Page ${pagination.page} of ${pagination.totalPages} | ${pagination.totalItems} total submissions`;
  }, [pagination.page, pagination.totalItems, pagination.totalPages]);

  return (
    <PageContainer>
      <Header>Dashboard Overview</Header>

      {isInitialLoading ? (
        <StatusBox>Loading dashboard data...</StatusBox>
      ) : initialError ? (
        <StatusBox $error>{initialError}</StatusBox>
      ) : (
        <>
          <StatsRow>
            {cards.map((card) => (
              <StatCard key={card.id} card={card} />
            ))}
          </StatsRow>

          <BottomGrid>
            <Panel>
              <SectionTitle>Category Distribution</SectionTitle>

              {!categories.length ? (
                <StatusBox>No category distribution data available.</StatusBox>
              ) : (
                <DistList>
                  {categories.map((category, index) => (
                    <DistItem key={category.id}>
                      <DistName>{category.name}</DistName>
                      <DistValue>{category.percentage}%</DistValue>
                      <Track>
                        <Fill
                          $percentage={category.percentage}
                          $color={getFillColor(index)}
                        />
                      </Track>
                    </DistItem>
                  ))}
                </DistList>
              )}
            </Panel>

            <ProposalsPanel>
              <SectionTitle>Resident Submissions</SectionTitle>

              <ProposalList>
                {isProposalLoading ? (
                  <StatusBox>Loading proposals...</StatusBox>
                ) : proposalError ? (
                  <StatusBox $error>{proposalError}</StatusBox>
                ) : !proposals.length ? (
                  <StatusBox>No submissions available.</StatusBox>
                ) : (
                  proposals.map((proposal) => (
                    <DashboardProposalCard key={proposal.id} proposal={proposal} />
                  ))
                )}
              </ProposalList>

              <PaginationRow>
                <PaginationInfo>{paginationLabel}</PaginationInfo>
                <ButtonGroup>
                  <PageButton
                    disabled={isProposalLoading || pagination.page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    type="button"
                  >
                    Previous
                  </PageButton>
                  <PageButton
                    disabled={
                      isProposalLoading ||
                      pagination.page >= pagination.totalPages ||
                      pagination.totalPages === 0
                    }
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, pagination.totalPages))
                    }
                    type="button"
                  >
                    Next
                  </PageButton>
                </ButtonGroup>
              </PaginationRow>
            </ProposalsPanel>
          </BottomGrid>
        </>
      )}
    </PageContainer>
  );
}
