import { Link, useLocation } from 'react-router-dom';

import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.35rem 4rem;
  background-color: #ffffff;
  border-bottom: 1px solid #dedede;

  @media (max-width: 1200px) {
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
    gap: 0.8rem 1.2rem;
  }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;

  @media (max-width: 1200px) {
    gap: 1.4rem;
  }
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;

  span {
    color: #c79a00;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.9rem;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => (props.$active ? '#101010' : '#2f2f2f')};
  font-weight: ${(props) => (props.$active ? 700 : 500)};
  font-size: 1.35rem;
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  color: #757575;
`;

const BellIcon = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
`;

const VerticalDivider = styled.span`
  width: 1px;
  height: 34px;
  background: #d9d9d9;
`;

const AdminText = styled.span`
  font-size: 1.2rem;
  color: #7b7b7b;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #f4ca25;
  color: #1b1b1b;
  font-weight: 800;
`;

export default function AdminHeader() {
  const { pathname } = useLocation();

  return (
    <HeaderContainer>
      <LeftSide>
        <LogoText>
          <span>RSAE</span> Admin
        </LogoText>

        <NavLinks>
          <StyledLink to='/' $active={pathname === '/'}>
            Home
          </StyledLink>
          <StyledLink
            to='/dashboard'
            $active={pathname.startsWith('/dashboard')}
          >
            Dashboard
          </StyledLink>
          <StyledLink to='/browse' $active={pathname.startsWith('/browse')}>
            Idea Requests
          </StyledLink>
          <StyledLink
            to='/audit-log'
            $active={pathname.startsWith('/audit-log')}
          >
            Audit Log
          </StyledLink>
        </NavLinks>
      </LeftSide>

      <RightSide>
        <BellIcon aria-label='Notifications'>&#128276;</BellIcon>
        <VerticalDivider aria-hidden='true' />
        <AdminText>Admin 1</AdminText>
        <Avatar>AD</Avatar>
      </RightSide>
    </HeaderContainer>
  );
}
