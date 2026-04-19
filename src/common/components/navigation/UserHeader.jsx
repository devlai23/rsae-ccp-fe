import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import rsaeLogo from '@/assets/rsae-logo.jpg';
import ProposalSubmitButton from '@/common/components/buttons/ProposalSubmitButton';
import { useUser } from '@/common/contexts/UserContext';
import styled from 'styled-components';

import LogoutModal from './LogoutModal';

// --- STYLED COMPONENTS ---

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  height: 100px;
  padding: 0 4rem;
  
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;

  @media (max-width: 1200px) {
    padding: 0 1.5rem;
  }
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 45px; /* Adjust this number if the logo looks too big or too small */
  width: auto;
  object-fit: contain;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 2.5rem;
`;

const StyledLink = styled(Link)`
  text-decoration:  none;
  color: #1a1a1a;
  font-weight: 500;

  &:hover {
    color: #e2b853;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #1a1a1a;
  font-weight: 500;
  font-size: inherit;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #dc3545;
  }
`;

const SubmitProposalLink = styled(Link)`
  text-decoration: none;
  flex-shrink: 0;
`;

// --- COMPONENT RENDER ---

export default function UserHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setIsModalOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <HeaderContainer>
      <LogoContainer to='/'>
        <LogoImage
          src={rsaeLogo}
          alt='Reparations Stakeholders Authority Evanston Logo'
        />
      </LogoContainer>

      <NavLinks>
        <StyledLink to='/'>Home</StyledLink>
        <StyledLink to='/browse'>Browse Ideas</StyledLink>
        {user ? (
          <LogoutButton onClick={handleLogoutClick}>Log Out</LogoutButton>
        ) : (
          <StyledLink to='/login'>Admin Log In</StyledLink>
        )}

        <SubmitProposalLink to='/submit'>
          <ProposalSubmitButton type='button'>
            Submit Proposal
          </ProposalSubmitButton>
        </SubmitProposalLink>
      </NavLinks>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onLogout={handleLogoutConfirm}
      />
    </HeaderContainer>
  );
}
