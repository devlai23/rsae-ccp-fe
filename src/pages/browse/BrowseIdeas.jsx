import { useContext, useEffect, useMemo, useState } from 'react';

import ProposalEntry from '@/common/components/cards/ProposalEntry';
import ProposalModal from '@/common/components/modals/ProposalModal';
import { UserContext } from '@/common/contexts/UserContext';
import { auth } from '@/firebase-config';
import styled from 'styled-components';

const DASHBOARD_DEV_BYPASS =
  import.meta.env.VITE_DASHBOARD_DEV_BYPASS === 'true';

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

const buildApiUrl = (path) => {
  const base = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
  if (!base) {
    throw new Error('Missing VITE_BACKEND_URL in frontend env.');
  }
  return `${base}${path}`;
};

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

  const response = await fetch(buildApiUrl(path), {
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Request failed (${response.status})`);
  }

  return response.json();
}

const buildQueryString = ({ search, category, status, sort, tag }) => {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set('search', search.trim());
  }
  if (category !== 'all') {
    params.set('category', category);
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

export default function BrowseIdeas() {
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === 'admin' || DASHBOARD_DEV_BYPASS;

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

  const queryString = useMemo(
    () => buildQueryString({ search, category, status, sort, tag: activeTag }),
    [search, category, status, sort, activeTag]
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
        setProposals(data.items || []);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load proposals');
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
          placeholder='Search title, description, or submitter...'
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
            <option value='housing'>Housing</option>
            <option value='health'>Health & Wellness</option>
            <option value='economic'>Economic Development</option>
            <option value='arts'>Arts & Culture</option>
            <option value='education'>Education</option>
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

          {!isLoading && !error && proposals.length === 0 ? (
            <StateBox>No proposals match your current filters.</StateBox>
          ) : null}

          {!isLoading && !error
            ? proposals
                .filter((proposal) => proposal.status === 'approved')
                .map((proposal) => (
                  <ProposalEntry
                    key={proposal.id}
                    title={proposal.title}
                    category={proposal.category}
                    description={proposal.description}
                    date={formatDate(proposal.submittedAt)}
                    votes={proposal.votes}
                    onCommentClick={() => openProposalDetails(proposal.id)}
                  />
                ))
            : null}
        </FeedArea>
      </LayoutGrid>

      {isModalOpen ? (
        <ProposalModal
          proposalData={selectedProposal}
          isLoading={modalLoading}
          error={modalError}
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
