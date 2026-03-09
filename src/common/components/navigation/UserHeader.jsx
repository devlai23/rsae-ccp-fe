import React from 'react';
import { Link } from 'react-router-dom';

import rsaeLogo from '@/assets/rsae-logo.jpg';
import styled from 'styled-components';

// --- STYLED COMPONENTS ---

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
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
  text-decoration: none;
  color: #1a1a1a;
  font-weight: 500;

  &:hover {
    color: #e2b853;
  }
`;

// --- COMPONENT RENDER ---

export default function UserHeader() {
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
        <StyledLink to='/login'>Admin Log In</StyledLink>

        <Link to='/submit' style={{ textDecoration: 'none' }}>
          <button style={{ backgroundColor: '#E2B853', color: 'black' }}>
            Submit Proposal
          </button>
        </Link>
      </NavLinks>
    </HeaderContainer>
  );
}
