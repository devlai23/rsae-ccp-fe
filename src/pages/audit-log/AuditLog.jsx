import React, { useEffect, useMemo, useState } from 'react';

import AuditLogEntry from '@/common/components/cards/AuditLogEntry';
import { auth } from '@/firebase-config';
import styled from 'styled-components';

// --- STYLED COMPONENTS ---

const PageContainer = styled.div`
  background-color: #f8f8f6;
  min-height: calc(100vh - 100px);
  padding: 3rem 4rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  color: #1a1a1a;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StyledSelect = styled.select`
  background-color: #fafafa;
  border: 1px solid #dfdfdf;
  border-radius: 15px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #7f7f7f;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #d1a90c;
  }
`;

const LogContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 30px;
  padding: 3rem 4rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03);
`;

const StateText = styled.div`
  margin-top: 1.2rem;
  border: 1px dashed #d6d6d6;
  border-radius: 16px;
  background-color: #fbfbfb;
  padding: 1.2rem 1.5rem;
  color: ${(props) => (props.$error ? '#c83f3f' : '#777')};
`;

const buildApiUrl = (path) => {
  const base = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
  if (!base) {
    throw new Error('Missing VITE_BACKEND_URL in frontend env.');
  }
  return `${base}${path}`;
};

const toIsoDate = (value) => value.toISOString().slice(0, 10);

const computeDateRange = (preset) => {
  if (!preset) return { from: '', to: '' };
  const now = new Date();

  if (preset === 'today') {
    return { from: toIsoDate(now), to: toIsoDate(now) };
  }

  if (preset === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return { from: toIsoDate(start), to: toIsoDate(now) };
  }

  if (preset === 'month') {
    const start = new Date(now);
    start.setMonth(now.getMonth() - 1);
    return { from: toIsoDate(start), to: toIsoDate(now) };
  }

  return { from: '', to: '' };
};

const formatTimestamp = (value) =>
  new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const humanizeAction = (log) => {
  const id = log.entityId ? ` #${log.entityId}` : '';
  switch (log.actionType) {
    case 'auth.login':
      return 'Logged In';
    case 'auth.logout':
      return 'Logged Out';
    case 'proposal.approve':
      return `Approved Proposal${id}`;
    case 'proposal.reject':
      return `Rejected Proposal${id}`;
    case 'comment.delete':
      return `Deleted Comment${id}`;
    default:
      return log.actionType;
  }
};

// --- MAIN PAGE RENDER ---

export default function AuditLog() {
  const [category, setCategory] = useState('');
  const [datePreset, setDatePreset] = useState('');
  const [{ from, to }, setRange] = useState({ from: '', to: '' });

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setRange(computeDateRange(datePreset));
  }, [datePreset]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    return params.toString() ? `?${params.toString()}` : '';
  }, [category, from, to]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = await auth.currentUser?.getIdToken?.();
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(buildApiUrl(`/audit-logs${queryString}`), {
          credentials: 'include',
          headers,
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error || `Request failed (${response.status})`);
        }

        const data = await response.json();
        setItems(data.items || []);
      } catch (loadError) {
        setItems([]);
        setError(loadError.message || 'Failed to load audit logs');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [queryString]);

  return (
    <PageContainer>
      <HeaderRow>
        <Title>Admin Audit Log</Title>
        <FilterGroup>
          <StyledSelect
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value='' disabled>
              Filter By Category
            </option>
            <option value=''>All</option>
            <option value='auth'>Logins/Logouts</option>
            <option value='proposal'>Proposals</option>
            <option value='comment'>Comments</option>
          </StyledSelect>

          <StyledSelect
            value={datePreset}
            onChange={(event) => setDatePreset(event.target.value)}
          >
            <option value='' disabled>
              Filter By Date
            </option>
            <option value=''>All</option>
            <option value='today'>Today</option>
            <option value='week'>This Week</option>
            <option value='month'>This Month</option>
          </StyledSelect>
        </FilterGroup>
      </HeaderRow>

      <LogContainer>
        {isLoading ? <StateText>Loading audit logs...</StateText> : null}
        {!isLoading && error ? <StateText $error>{error}</StateText> : null}

        {!isLoading && !error && !items.length ? (
          <StateText>No audit log entries match your filters.</StateText>
        ) : null}

        {!isLoading && !error
          ? items.map((log) => (
              <AuditLogEntry
                key={log.id}
                user={log.actorEmail || log.actorUid || 'System'}
                action={humanizeAction(log)}
                timestamp={formatTimestamp(log.createdAt)}
              />
            ))
          : null}
      </LogContainer>
    </PageContainer>
  );
}
