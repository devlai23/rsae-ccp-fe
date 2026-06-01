import { useContext, useEffect, useMemo, useState } from 'react';

import ProposalEntry from '@/common/components/cards/ProposalEntry';
import ProposalModal from '@/common/components/modals/ProposalModal';
import { buildBackendUrl } from '@/common/lib/apiUrl';
import {
  appendVoterIdToPath,
  getBrowserVoterId,
} from '@/common/lib/voterId';
import { UserContext } from '@/common/contexts/UserContext';
import { auth } from '@/firebase-config';
import styled from 'styled-components';

const PageContainer = styled.div`
  background-color: #f8f8f6;
  min-height: 100vh;
  padding: 3rem 4rem;

  @media (max-width: 1024px) {
    padding: 2rem 1.5rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.6rem;
  font-weight: 800;
`;

const SearchInput = styled.input`
  width: 320px;
  border: 1px solid #d8d8d8;
  border-radius: 14px;
  background-color: #fff;
  padding: 0.8rem 1rem;
  font-size: 0.96rem;

  &:focus {
    outline: none;
    border-color: #e2b853;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  border: 1px solid #dddddd;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  padding: 1.3rem;
  height: fit-content;
`;

const SectionLabel = styled.h4`
  margin: 1rem 0 0.6rem;
  color: #232323;
  font-size: 1rem;
`;

const Dropdown = styled.select`
  width: 100%;
  border: 1px solid #dfdfdf;
  border-radius: 12px;
  background-color: #fafafa;
  padding: 0.7rem 0.75rem;
  margin-bottom: 0.8rem;
`;

const TagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const TagChip = styled.button`
  border: 1px solid ${(props) => (props.$active ? '#e2b853' : '#d8d8d8')};
  border-radius: 999px;
  background: ${(props) => (props.$active ? '#f8ebc3' : '#fff')};
  color: #2d2d2d;
  padding: 0.25rem 0.7rem;
  font-size: 0.78rem;
  cursor: pointer;
`;

const ResetButton = styled.button`
  margin-top: 1rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
  padding: 0.6rem;
  font-weight: 600;
  cursor: pointer;
`;

const FeedArea = styled.section``;

const StateBox = styled.div`
  border: 1px dashed #d6d6d6;
  border-radius: 14px;
  background: #fbfbfb;
  color: ${(props) => (props.$error ? '#cb3a3a' : '#696969')};
  padding: 1rem;
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid #eeeeee;
`;

const PageButton = styled.button`
  background-color: #ffffff;
  border: 1px solid #dfdfdf;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #d1a90c;
    color: #d1a90c;
  }

  &:disabled {
    background-color: #f9f9f9;
    color: #c4c4c4;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-weight: 500;
  color: #777;
`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

async function fetchApi(path) {
  const token = await auth.currentUser?.getIdToken?.();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildBackendUrl(appendVoterIdToPath(path)), {
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Request failed (${response.status})`);
  }

  return response.json();
}

async function postVote(path, token) {
  const baseHeaders = { 'Content-Type': 'application/json' };
  if (token) {
    baseHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildBackendUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers: baseHeaders,
    body: JSON.stringify({
      voterId: getBrowserVoterId(),
    }),
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

const normalizeCategory = (value) => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return '';
  }

  const normalized = trimmed.toLowerCase().replace(/&/g, 'and');

  if (normalized.includes('hous')) {
    return 'Housing';
  }

  if (normalized.includes('health') || normalized.includes('wellness')) {
    return 'Health and Wellness';
  }

  if (normalized.includes('econ')) {
    return 'Economic Development';
  }

  if (normalized.includes('art') || normalized.includes('cult')) {
    return 'Art and Culture';
  }

  if (normalized.includes('educ')) {
    return 'Education';
  }

  return trimmed;
};

const matchesSelectedCategory = (proposal, selectedCategory) => {
  if (selectedCategory === 'all') {
    return true;
  }

  const canonicalCategory = normalizeCategory(selectedCategory);
  const candidateValues = [proposal.category, ...(proposal.tags || [])];

  return candidateValues.some(
    (value) => normalizeCategory(value) === canonicalCategory
  );
};

const buildQueryString = ({ search, status, sort, tag }) => {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set('search', search.trim());
  }
  if (status !== 'all') {
    params.set('status', status);
  }
  if (sort !== 'newest') {
    params.set('sort', sort);
  }
  if (tag !== 'all') {
    params.set('tag', tag);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
};

const ITEMS_PER_PAGE = 10;

export default function BrowseIdeas() {
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [activeTag, setActiveTag] = useState('all');

  const [, setTags] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [votingProposalId, setVotingProposalId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const queryString = useMemo(
    () => buildQueryString({ search, status, sort, tag: activeTag }),
    [search, status, sort, activeTag]
  );

  const visibleProposals = useMemo(() => {
    const statusVisible = isAdmin
      ? proposals
      : proposals.filter((proposal) => proposal.status === 'approved');

    return statusVisible
      .filter((proposal) => matchesSelectedCategory(proposal, category))
      .map((proposal) => ({
        ...proposal,
        category: normalizeCategory(proposal.category) || proposal.category,
      }));
  }, [proposals, isAdmin, category]);

  const totalPages = Math.ceil(visibleProposals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = visibleProposals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await fetchApi('/proposals/tags');
        setTags(data.tags || []);
      } catch {
        setTags([]);
      }
    };

    loadTags();
  }, []);

  useEffect(() => {
    const loadProposals = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await fetchApi(`/proposals${queryString}`);
        const items = data.items || [];
        setProposals(items);
        setCurrentPage(1);
        // #region agent log
        const statusCounts = items.reduce((acc, proposalItem) => {
          const key = proposalItem.status ?? 'unknown';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const approvedOnlyCount = items.filter(
          (proposalItem) => proposalItem.status === 'approved'
        ).length;
        const clientVisibleCount = isAdmin ? items.length : approvedOnlyCount;
        fetch('http://127.0.0.1:7597/ingest/2b765efe-bf6e-4410-862c-372765e6b5a4', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': 'f0e25d',
          },
          body: JSON.stringify({
            sessionId: 'f0e25d',
            runId: 'post-fix',
            hypothesisId: 'H1',
            location: 'BrowseIdeas.jsx:loadProposals',
            message: 'proposals fetch success',
            data: {
              totalItems: items.length,
              statusCounts,
              approvedOnlyCount,
              clientVisibleCount,
              adminSeesAllStatuses: isAdmin,
              isAdmin,
              queryString,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
      } catch (loadError) {
        setError(loadError.message || 'Failed to load proposals');
        // #region agent log
        fetch('http://127.0.0.1:7597/ingest/2b765efe-bf6e-4410-862c-372765e6b5a4', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': 'f0e25d',
          },
          body: JSON.stringify({
            sessionId: 'f0e25d',
            runId: 'post-fix',
            hypothesisId: 'H2',
            location: 'BrowseIdeas.jsx:loadProposals',
            message: 'proposals fetch error',
            data: {
              errorMessage: loadError?.message ?? String(loadError),
              queryString,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
      } finally {
        setIsLoading(false);
      }
    };

    loadProposals();
  }, [queryString]);

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setSort('newest');
    setActiveTag('all');
    setCurrentPage(1);
  };

  const handleVote = async (proposalId, event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (votingProposalId !== null) {
      return;
    }

    setVotingProposalId(proposalId);
    try {
      const token = await auth.currentUser?.getIdToken?.();
      const { response, data } = await postVote(
        `/proposals/${proposalId}/vote`,
        token
      );

      if (response.ok) {
        const nextVotes =
          typeof data.votes === 'number' ? data.votes : undefined;
        const nextHasVoted = Boolean(data.hasVoted);
        setProposals((prev) =>
          prev.map((p) =>
            p.id === proposalId
              ? {
                  ...p,
                  ...(nextVotes !== undefined ? { votes: nextVotes } : {}),
                  hasVoted: nextHasVoted,
                }
              : p
          )
        );
        setSelectedProposal((prev) =>
          prev && prev.id === proposalId
            ? {
                ...prev,
                ...(nextVotes !== undefined ? { votes: nextVotes } : {}),
                hasVoted: nextHasVoted,
              }
            : prev
        );
      } else if (response.status === 400) {
        alert(data.error || 'Cannot support this idea yet.');
      } else if (response.status === 429) {
        alert(data.error || 'Too many requests. Try again later.');
      } else {
        alert(data.error || 'Could not record your support.');
      }
    } catch (error) {
      alert(error?.message || 'Could not record your support.');
    } finally {
      setVotingProposalId(null);
    }
  };

  const openProposalDetails = async (proposalId) => {
    setIsModalOpen(true);
    setModalLoading(true);
    setModalError('');
    setSelectedProposal(null);

    try {
      const proposal = await fetchApi(`/proposals/${proposalId}`);
      setSelectedProposal(proposal);
    } catch (detailError) {
      setModalError(detailError.message || 'Failed to load proposal details');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>{isAdmin ? 'Idea Requests' : 'Browse Ideas'}</Title>
        <SearchInput
          type='text'
          placeholder='Search title or description...'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </PageHeader>

      <LayoutGrid>
        <Sidebar>
          <SectionLabel>Category</SectionLabel>
          <Dropdown
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value='all'>All categories</option>
            <option value='Housing'>Housing</option>
            <option value='Health and Wellness'>Health & Wellness</option>
            <option value='Economic Development'>Economic Development</option>
            <option value='Art and Culture'>Arts & Culture</option>
            <option value='Education'>Education</option>
          </Dropdown>

          <SectionLabel>Sort by</SectionLabel>
          <Dropdown
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value='newest'>Newest first</option>
            <option value='oldest'>Oldest first</option>
          </Dropdown>

          {isAdmin ? (
            <>
              <SectionLabel>Status</SectionLabel>
              <Dropdown
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value='all'>All statuses</option>
                <option value='pending'>Pending</option>
                <option value='approved'>Approved</option>
                <option value='rejected'>Rejected</option>
              </Dropdown>
            </>
          ) : null}

          {/* <SectionLabel>Tags</SectionLabel>
          <TagWrap>
            <TagChip
              type='button'
              $active={activeTag === 'all'}
              onClick={() => setActiveTag('all')}
            >
              All
            </TagChip>
            {tags.map((tag) => (
              <TagChip
                key={tag}
                type='button'
                $active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </TagChip>
            ))}
          </TagWrap> */}

          <ResetButton type='button' onClick={resetFilters}>
            Clear Filters
          </ResetButton>
        </Sidebar>

        <FeedArea>
          {isLoading ? <StateBox>Loading proposals...</StateBox> : null}
          {!isLoading && error ? <StateBox $error>{error}</StateBox> : null}

          {!isLoading && !error && visibleProposals.length === 0 ? (
            <StateBox>No proposals match your current filters.</StateBox>
          ) : null}

          {!isLoading && !error
            ? currentItems.map((proposal) => (
                <ProposalEntry
                  key={proposal.id}
                  title={proposal.title}
                  category={proposal.category}
                  description={proposal.description}
                  date={formatDate(proposal.submittedAt)}
                  votes={proposal.votes}
                  hasVoted={Boolean(proposal.hasVoted)}
                  voteAllowed={proposal.status === 'approved'}
                  isVoting={votingProposalId === proposal.id}
                  onVote={(e) => handleVote(proposal.id, e)}
                  onCommentClick={() => openProposalDetails(proposal.id)}
                />
              ))
            : null}

          {!isLoading && !error && totalPages > 1 ? (
            <PaginationControls>
              <PageButton
                type='button'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </PageButton>

              <PageInfo>
                Page {currentPage} of {totalPages}
              </PageInfo>

              <PageButton
                type='button'
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </PageButton>
            </PaginationControls>
          ) : null}
        </FeedArea>
      </LayoutGrid>

      {isModalOpen ? (
        <ProposalModal
          proposalData={selectedProposal}
          isLoading={modalLoading}
          error={modalError}
          onSupportClick={
            selectedProposal
              ? () => handleVote(selectedProposal.id, null)
              : undefined
          }
          supportVoting={votingProposalId === selectedProposal?.id}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProposal(null);
            setModalError('');
            setModalLoading(false);
          }}
        />
      ) : null}
    </PageContainer>
  );
}
