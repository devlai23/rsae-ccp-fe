import React from 'react';

import AuditLogEntry from '@/common/components/cards/AuditLogEntry';
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

// --- DUMMY DATA ---

const dummyLogs = [
  {
    id: 1,
    user: 'Admin User 1',
    action: 'Logged Out',
    timestamp: 'Today at 12:34 PM',
  },
  {
    id: 2,
    user: 'Admin User 1',
    action: 'Approved Proposal #842',
    timestamp: 'Today at 11:15 AM',
  },
  {
    id: 3,
    user: 'Admin User 2',
    action: 'Logged In',
    timestamp: 'Yesterday at 4:30 PM',
  },
  {
    id: 4,
    user: 'Admin User 1',
    action: 'Deleted Comment',
    timestamp: 'Yesterday at 2:00 PM',
  },
  {
    id: 5,
    user: 'System',
    action: 'Weekly Backup Completed',
    timestamp: 'Sunday at 12:00 AM',
  },
];

// --- MAIN PAGE RENDER ---

export default function AuditLog() {
  return (
    <PageContainer>
      <HeaderRow>
        <Title>Admin Audit Log</Title>
        <FilterGroup>
          <StyledSelect defaultValue=''>
            <option value='' disabled>
              Filter By Category
            </option>
            <option value='login'>Logins/Logouts</option>
            <option value='proposal'>Proposals</option>
            <option value='comment'>Comments</option>
          </StyledSelect>

          <StyledSelect defaultValue=''>
            <option value='' disabled>
              Filter By Date
            </option>
            <option value='today'>Today</option>
            <option value='week'>This Week</option>
            <option value='month'>This Month</option>
          </StyledSelect>
        </FilterGroup>
      </HeaderRow>

      <LogContainer>
        {dummyLogs.map((log) => (
          <AuditLogEntry
            key={log.id}
            user={log.user}
            action={log.action}
            timestamp={log.timestamp}
          />
        ))}
      </LogContainer>
    </PageContainer>
  );
}
