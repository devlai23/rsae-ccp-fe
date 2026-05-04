import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import rsaeLogo from '@/assets/rsae-logo.jpg';
import { useUser } from '@/common/contexts/UserContext';
import styled from 'styled-components';

import LogoutModal from './LogoutModal';
import toast from 'react-hot-toast';

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
const RSAE_ORG_URL = 'https://rsaevanston.org/';

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 45px;
  width: auto;
  object-fit: contain;
`;

const RightSideContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
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

const AdminTools = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  color: #757575;
  border-left: 1px solid #d9d9d9;
  padding-left: 2.5rem;
`;

const ProfileContainer = styled.div`
  position: relative; /* This anchors the absolute dropdown menu to the avatar */
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;

  /* Gives the avatar a slight "pop" effect when hovered */
  &:hover > div {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;

const AdminText = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #e2b853;
  color: #1a1a1a;
  font-weight: 700;
  font-size: 0.9rem;
  transition: transform 0.2s ease;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 120%; /* Pushes the menu just below the avatar */
  right: 0;  /* Aligns it to the right edge of the avatar */
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08); /* Soft shadow for depth */
  padding: 0.5rem;
  min-width: 160px;
  z-index: 100; /* Ensures it floats above page content */
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.8rem 1.2rem;
  background: none;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: inherit;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9f9f9;
    color: #dc3545; /* Turns red to warn it's a destructive action! */
  }
`;

// --- COMPONENT RENDER ---

export default function AdminHeader() {
  const { pathname } = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controls the new menu
  const dropdownRef = useRef(null); // Helps us detect clicks outside the menu
  
  const navigate = useNavigate();
  const { user, logout } = useUser();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setIsModalOpen(false);

      toast.success('Log Out Successful');
      window.scrollTo({top: 0, behavior: 'smooth'});

      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);

      toast.error('Log out failed. Please try again.');
    }
  };

  return (
    <HeaderContainer>
      
      <LogoContainer href={RSAE_ORG_URL}>
        <LogoImage
          src={rsaeLogo}
          alt='Reparations Stakeholders Authority Evanston Logo'
        />
      </LogoContainer>

      <RightSideContainer>
        <NavLinks>
          <StyledLink to='/' $active={pathname === '/'}>
            Home
          </StyledLink>
          <StyledLink to='/browse' $active={pathname.startsWith('/browse')}>
            Browse Ideas
          </StyledLink>
          <StyledLink to='/dashboard' $active={pathname.startsWith('/dashboard')}>
            Dashboard
          </StyledLink>
          <StyledLink to='/audit-log' $active={pathname.startsWith('/audit-log')}>
            Audit Log
          </StyledLink>
        </NavLinks>

        <AdminTools>
          
          {user && (
            <ProfileContainer ref={dropdownRef}>
              
              <ProfileButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <AdminText>RSAE Admin</AdminText>
                <Avatar>AD</Avatar>
              </ProfileButton>

              {isDropdownOpen && (
                <DropdownMenu>
                  <DropdownItem onClick={handleLogoutClick}>
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              )}
              
            </ProfileContainer>
          )}

        </AdminTools>
      </RightSideContainer>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onLogout={handleLogoutConfirm}
      />
    </HeaderContainer>
  );
}