import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. IMPORT YOUR COMPONENTS & ASSETS
import footerLogo from '@/assets/footer_logo.png';
import heroBg from '@/assets/hero-bg.jpg';
import loginIcon from '@/assets/login_icon.png';
import { UserContext } from '@/common/contexts/UserContext';
import styled from 'styled-components';

import HowItWorks from './HowItWorks';

// Importing the new file we just made!

// --- HERO STYLED COMPONENTS ---

const HeroContainer = styled.section`
  background:
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBg});
  background-size: cover;
  background-position: center;
  padding: 6rem 4rem;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const TopSubtitle = styled.p`
  color: #e2b853;
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const MainTitle = styled.h1`
  color: #ffffff;
  font-size: 3.5rem;
  font-weight: 800;
  max-width: 800px;
  line-height: 1.2;
  margin: 0 0 1.5rem 0;

  span {
    color: #e2b853;
    font-style: italic;
  }
`;

const Description = styled.p`
  color: #ffffff;
  font-size: 1.1rem;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 2.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const PrimaryButton = styled(Link)`
  background-color: #e2b853;
  color: #000000;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  border: 2px solid #e2b853;

  &:hover {
    background-color: #d1a742;
  }
`;

const SecondaryButton = styled(Link)`
  background-color: transparent;
  color: #ffffff;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  border: 2px solid #ffffff;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

// --- STATS BAR STYLED COMPONENTS ---

const StatsBar = styled.section`
  background-color: #e2b853;
  color: #000000;
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
`;

const StatMainInfo = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 300px;
`;

const StatTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
`;

const StatSubtitle = styled.p`
  margin: 0;
  font-size: 1rem;
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Divider = styled.div`
  width: 1px;
  height: 50px;
  background-color: #000000;
  opacity: 0.2;
`;

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

// --- MAIN COMPONENT RENDER ---

export default function Home() {
  const context = useContext(UserContext);
  const isAdmin = context?.user?.role === 'admin';
  const navigate = useNavigate();

  const handleFooterLogout = async () => {
    try {
      await context?.logout?.();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <HeroContainer>
        <TopSubtitle>For our local community, Evanston</TopSubtitle>

        <MainTitle>
          A Transparent Process from Idea <br />
          <span>to Implementation</span>
        </MainTitle>

        <Description>
          A transparent platform for Evanston residents to submit ideas, browse
          and vote on community proposals, and see the most supported ideas
          brought to life.
        </Description>

        {!isAdmin && (
          <ButtonGroup>
            <PrimaryButton to='/submit'>Submit An Idea</PrimaryButton>
            <SecondaryButton to='/browse'>Browse Ideas</SecondaryButton>
          </ButtonGroup>
        )}
      </HeroContainer>

      {/* STATS BAR SECTION */}
      <StatsBar>
        <StatMainInfo>
          <StatTitle>Idea Collection in Progress...</StatTitle>
          <StatSubtitle>Collaborating for a better Evanston.</StatSubtitle>
        </StatMainInfo>

        <StatBlock>
          <StatNumber>842</StatNumber>
          <StatLabel>Submissions</StatLabel>
        </StatBlock>

        <Divider />

        <StatBlock>
          <StatNumber>10K</StatNumber>
          <StatLabel>Interactions</StatLabel>
        </StatBlock>

        <Divider />

        <StatBlock>
          <StatNumber>HOUSING</StatNumber>
          <StatLabel>Current Trending Category</StatLabel>
        </StatBlock>
      </StatsBar>

      {/* HOW IT WORKS SECTION */}
      <HowItWorks />

      <FooterSection>
        <FooterBrand>
          <FooterLogo
            src={footerLogo}
            alt='Reparations Stakeholder Authority of Evanston'
          />
          <FooterBrandText>
            Reparations Stakeholder
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

        {context?.user ? (
          <FooterLogoutButton type='button' onClick={handleFooterLogout}>
            <span>RSAE</span> Admin Logout
            <LoginIcon src={loginIcon} alt='' aria-hidden='true' />
          </FooterLogoutButton>
        ) : (
          <FooterLoginLink to='/login'>
            <span>RSAE</span> Admin Login
            <LoginIcon src={loginIcon} alt='' aria-hidden='true' />
          </FooterLoginLink>
        )}
      </FooterSection>
    </div>
  );
}
