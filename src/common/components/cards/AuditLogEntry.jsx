import React from 'react';

import styled from 'styled-components';

const EntryContainer = styled.div`
  background-color: #f8f8f6;
  border-radius: 20px;
  padding: 1.5rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px); /* Adds a tiny slide effect on hover */
  }
`;

const UserActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Avatar = styled.div`
  background-color: #e0e0e0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const UserName = styled.span`
  font-weight: 700;
  color: #1a1a1a;
  font-size: 1.1rem;
`;

const ActionText = styled.span`
  color: #d1a90c; /* RSAE Gold for the action text */
  font-weight: 700;
  font-size: 1.1rem;
`;

const Timestamp = styled.div`
  color: #7f7f7f;
  font-size: 0.95rem;
  font-weight: 500;
`;

export default function AuditLogEntry({ user, action, timestamp }) {
  return (
    <EntryContainer>
      <UserActionGroup>
        <Avatar>👤</Avatar>
        <div>
          <UserName>{user} </UserName>
          <ActionText>{action}</ActionText>
        </div>
      </UserActionGroup>
      <Timestamp>{timestamp}</Timestamp>
    </EntryContainer>
  );
}
