import { useEffect, useState } from 'react';

import { auth } from '@/firebase-config';
import styled from 'styled-components';

const DASHBOARD_DEV_BYPASS =
  import.meta.env.VITE_DASHBOARD_DEV_BYPASS === 'true';

const PageContainer = styled.div`
  background-color: #f8f8f6;
  min-height: calc(100vh - 100px);
  padding: 3rem 4rem;

  @media (max-width: 1024px) {
    padding: 2rem 1.5rem;
  }
`;

const Title = styled.h1`
  margin: 0 0 2rem;
  color: #141414;
  font-size: 3.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.1rem;
  }
`;

const StatsRow = styled.section`
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  min-height: 160px;
  border: 1px solid #dddddd;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  padding: 1.7rem;
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
  font-size: 1.1rem;
  font-weight: 700;
  color: #111111;
`;

const PendingBadge = styled.span`
  border: 1px solid #ffd8dd;
  border-radius: 999px;
  background-color: #ffe8eb;
  color: #e33657;
  padding: 0.25rem 0.8rem;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
`;

const MainNumber = styled.span`
  color: #c79a00;
  font-size: 2.2rem;
  line-height: 1;
  font-weight: 800;
`;

const SubText = styled.span`
  color: #676767;
  font-size: 1rem;
`;

const BottomGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(500px, 2.1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  border: 1px solid #dddddd;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  padding: 2rem 1.6rem;
`;

const DistPanelTitle = styled.h3`
  margin: 0;
  color: #141414;
  font-size: 2rem;
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
  color: #637594;
  font-size: 1rem;
`;

const DistValue = styled.span`
  color: #222222;
  font-size: 1.05rem;
  font-weight: 700;
`;

const Track = styled.div`
  grid-column: 1 / -1;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background-color: #f0f0f2;
  overflow: hidden;
`;

const Fill = styled.div`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background-color: ${(props) => props.$color};
`;

const ProposalsPanel = styled(Panel)`
  min-height: 370px;
  display: flex;
  flex-direction: column;
`;

const ProposalsHeading = styled.h3`
  margin: 0;
  color: #141414;
  font-size: 1.25rem;
  font-weight: 700;
`;

const TableWrap = styled.div`
  margin-top: 1rem;
  max-height: 300px;
  overflow: auto;
  border: 1px solid #ececec;
  border-radius: 12px;
`;

const ProposalsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.83rem;

  th,
  td {
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid #f1f1f1;
    padding: 0.55rem;
  }

  th {
    background-color: #fafafa;
    color: #444;
    font-weight: 700;
    position: sticky;
    top: 0;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const StateText = styled.div`
  margin-top: 1rem;
  color: ${(props) => (props.$error ? '#c83f3f' : '#777')};
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  margin-top: 1rem;
  border: 1px dashed #d6d6d6;
  border-radius: 12px;
  background-color: #fbfbfb;
  padding: 1.2rem;
  color: #666;
  font-size: 0.92rem;
  line-height: 1.5;
`;

const colors = ['#f4ca25', '#e3c45f', '#dbc98e', '#ded7b5', '#ded7b5'];

const buildDashboardUrl = (endpoint) => {
  const base = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
  if (!base) {
    throw new Error('Missing VITE_BACKEND_URL in frontend env.');
  }
  return `${base}${endpoint}`;
};

async function fetchDashboardJson(endpoint) {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token && !DASHBOARD_DEV_BYPASS) {
    throw new Error('Admin login required.');
  }

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildDashboardUrl(endpoint), {
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error || `Request failed (${response.status})`);
  }

  return response.json();
}

const formatDate = (value) => {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function DataDashboard() {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metricsError, setMetricsError] = useState('');
  const [categoriesError, setCategoriesError] = useState('');
  const [proposalsError, setProposalsError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMetricsError('');
      setCategoriesError('');
      setProposalsError('');

      const [metricsResult, categoriesResult, proposalsResult] =
        await Promise.allSettled([
          fetchDashboardJson('/dashboard/metrics'),
          fetchDashboardJson('/dashboard/categories'),
          fetchDashboardJson('/proposals'),
        ]);

      if (metricsResult.status === 'fulfilled') {
        setCards(metricsResult.value.cards || []);
      } else {
        setMetricsError(
          metricsResult.reason?.message || 'Failed to load metrics.'
        );
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value.categories || []);
      } else {
        setCategoriesError(
          categoriesResult.reason?.message ||
            'Failed to load category distribution.'
        );
      }

      if (proposalsResult.status === 'fulfilled') {
        setProposals(proposalsResult.value.items || []);
      } else {
        setProposalsError(
          proposalsResult.reason?.message ||
            'Failed to load proposals from database.'
        );
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/proposals/${id}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update proposal status');
      }
      setProposals((currentProposals) =>
        currentProposals.map((proposal) =>
          proposal.id === id ? { ...proposal, status } : proposal
        )
      );
    } catch (error) {
      alert('Failed to update proposal status: ' + (error.message || error));
    }
  };

  return (
    <PageContainer>
      <Title>Dashboard Overview</Title>

      {loading ? <StateText>Loading dashboard data...</StateText> : null}

      <StatsRow>
        {!cards.length ? (
          <Card>
            <StateText $error={!!metricsError}>
              {metricsError || 'No submission metrics available yet.'}
            </StateText>
          </Card>
        ) : (
          cards.map((card) => (
            <Card key={card.id}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                {card.pendingCount > 0 ? (
                  <PendingBadge>
                    &middot; {card.pendingCount} pending
                  </PendingBadge>
                ) : null}
              </CardHeader>

              <ValueRow>
                <MainNumber>
                  {Number(card.value || 0).toLocaleString()}
                </MainNumber>
                <SubText>{card.timeframe}</SubText>
              </ValueRow>
            </Card>
          ))
        )}
      </StatsRow>

      <BottomGrid>
        <Panel>
          <DistPanelTitle>Category Distribution</DistPanelTitle>

          {categoriesError ? (
            <StateText $error>{categoriesError}</StateText>
          ) : !categories.length ? (
            <EmptyState>
              No category data yet. Percentages will appear after proposals are
              submitted.
            </EmptyState>
          ) : (
            <DistList>
              {categories.map((category, index) => (
                <DistItem key={category.id}>
                  <DistName>{category.name}</DistName>
                  <DistValue>{category.percentage}%</DistValue>
                  <Track>
                    <Fill
                      $percentage={category.percentage}
                      $color={colors[index % colors.length]}
                    />
                  </Track>
                </DistItem>
              ))}
            </DistList>
          )}
        </Panel>

        <ProposalsPanel>
          <ProposalsHeading>All Proposal Information</ProposalsHeading>

          {proposalsError ? (
            <StateText $error>{proposalsError}</StateText>
          ) : proposals.length === 0 ? (
            <EmptyState>
              No proposals have been submitted yet. Once residents submit
              proposals, all proposal details will appear here automatically.
            </EmptyState>
          ) : (
            <TableWrap>
              <ProposalsTable>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Votes</th>
                    <th>Submitted By</th>
                    <th>Submitted At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((proposal) => (
                    <tr key={proposal.id}>
                      <td>{proposal.id}</td>
                      <td>{proposal.title}</td>
                      <td>{proposal.category}</td>
                      <td>{proposal.description}</td>
                      <td>{proposal.votes}</td>
                      <td>{proposal.submittedBy}</td>
                      <td>{formatDate(proposal.submittedAt)}</td>
                      <td>
                        {proposal.status === 'pending' ? (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              gap: '0.35rem',
                            }}
                          >
                            <button
                              style={{
                                background: '#c7e7c7',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.3rem 0.7rem',
                                cursor: 'pointer',
                              }}
                              onClick={() =>
                                handleDecision(proposal.id, 'approved')
                              }
                            >
                              Accept
                            </button>
                            <button
                              style={{
                                background: '#ffd8dd',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.3rem 0.7rem',
                                cursor: 'pointer',
                              }}
                              onClick={() =>
                                handleDecision(proposal.id, 'rejected')
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          proposal.status
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ProposalsTable>
            </TableWrap>
          )}
        </ProposalsPanel>
      </BottomGrid>
    </PageContainer>
  );
}
