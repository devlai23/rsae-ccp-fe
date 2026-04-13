import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// 1. IMPORT YOUR COMPONENTS & ASSETS
import heroBg from '@/assets/hero-bg.jpg';
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

const ToastContainer = styled.div`
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 1100;
  pointer-events: none;
`;

const Toast = styled.div`
  width: min(360px, calc(100vw - 2.5rem));
  max-width: 360px;
  background-color: #ffffff;
  border: 1px solid #e2b853;
  border-left: 6px solid #e2b853;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.16);
  padding: 0.9rem 1rem;
  pointer-events: auto;
`;

const ToastTitle = styled.p`
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: #1f1f1f;
`;

const ToastBody = styled.p`
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.4;
  color: #4d4d4d;
`;

// --- MAIN COMPONENT RENDER ---

export default function Home() {
  const context = useContext(UserContext);
  const isAdmin = context?.user?.role === 'admin';
  const location = useLocation();
  const navigate = useNavigate();
  const [showSubmissionToast, setShowSubmissionToast] = useState(false);

  useEffect(() => {
    if (!location.state?.submissionSuccessToast) {
      return undefined;
    }

    setShowSubmissionToast(true);

    const dismissTimer = setTimeout(() => {
      setShowSubmissionToast(false);
    }, 3200);

    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      {
        replace: true,
        state: null,
      }
    );

    return () => clearTimeout(dismissTimer);
  }, [location.hash, location.pathname, location.search, location.state, navigate]);

  return (
    <div>
      {showSubmissionToast ? (
        <ToastContainer aria-live='polite'>
          <Toast role='status'>
            <ToastTitle>Proposal submitted</ToastTitle>
            <ToastBody>
              Thanks for sharing your idea. The team will review it shortly.
            </ToastBody>
          </Toast>
        </ToastContainer>
      ) : null}

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
    </div>
  );
}
