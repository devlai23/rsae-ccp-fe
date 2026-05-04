import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import footerLogo from '@/assets/footer_logo.png';
import loginIcon from '@/assets/login_icon.png';
import { useUser } from '@/common/contexts/UserContext';
import styled from 'styled-components';

import LogoutModal from '@/common/components/navigation/LogoutModal';
import toast from 'react-hot-toast';

const FooterSection = styled.footer`
  background-color: #f2f2f2;
  border-top: 1px solid #e2e2e2;
  padding: 32px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
`;

const FooterLogo = styled.img`
  height: 52px;
  width: auto;
  object-fit: contain;
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const FooterBrandText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  color: #111111;
  text-transform: uppercase;
  max-width: 300px;
`;

const FooterInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, auto));
  gap: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FooterInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FooterLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #111111;
  text-transform: uppercase;
`;

const FooterValue = styled.span`
  font-size: 14px;
  color: #4e4e4e;
  line-height: 1.4;
`;

const FooterLoginLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-size: 18px;
  font-weight: 700;
  color: #151515;

  span {
    color: #e2b853;
  }
`;

const FooterLogoutButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: 700;
  color: #151515;
  cursor: pointer;

  span {
    color: #e2b853;
  }
`;

const LoginIcon = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

export default function SiteFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

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
      
      toast.success('Log Out Successful');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);

      toast.error('Log out fauled. Please try again.');
    }
  };

  return (
    <FooterSection>
      <FooterBrand>
        <FooterLogo
          src={footerLogo}
          alt='Reparations Stakeholders Authority of Evanston'
        />
        <FooterBrandText>
          Reparations Stakeholders
          <br />
          Authority of Evanston
        </FooterBrandText>
      </FooterBrand>

      <FooterInfoGrid>
        <FooterInfoBlock>
          <FooterLabel>Address</FooterLabel>
          <FooterValue>
            1717 Benson Avenue
            <br />
            Evanston, IL 60201
          </FooterValue>
        </FooterInfoBlock>

        <FooterInfoBlock>
          <FooterLabel>Tel:</FooterLabel>
          <FooterValue>224.592.0917</FooterValue>
        </FooterInfoBlock>

        <FooterInfoBlock>
          <FooterLabel>Email</FooterLabel>
          <FooterValue>info@rsaevanston.org</FooterValue>
        </FooterInfoBlock>
      </FooterInfoGrid>

      {user ? (
        <FooterLogoutButton type='button' onClick={handleLogoutClick}>
          <span>RSAE</span> Admin Logout
          <LoginIcon src={loginIcon} alt='' aria-hidden='true' />
        </FooterLogoutButton>
      ) : (
        <FooterLoginLink to='/login'>
          <span>RSAE</span> Admin Login
          <LoginIcon src={loginIcon} alt='' aria-hidden='true' />
        </FooterLoginLink>
      )}

      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onLogout={handleLogoutConfirm}
      />
    </FooterSection>
  );
}