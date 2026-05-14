import React, { useContext, useEffect, useRef, useState } from 'react';
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
  position: relative;
  background-color: #ffffff;
  border: 1px solid #e2b853;
  border-left: 6px solid #e2b853;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.16);
  padding: 0.9rem 2.4rem 0.9rem 1rem;
  pointer-events: auto;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '-0.5rem')});
  transition:
    opacity 220ms ease,
    transform 220ms ease;
  will-change: opacity, transform;
`;

const ToastCloseButton = styled.button`
  position: absolute;
  top: 0.55rem;
  right: 0.55rem;
  width: 1.7rem;
  height: 1.7rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #6f6f6f;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #1f1f1f;
  }

  &:focus-visible {
    outline: 2px solid #e2b853;
    outline-offset: 2px;
  }
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
  const [showSubmissionToast, setShowSubmissionToast] = useState(() =>
    Boolean(location.state?.submissionSuccessToast)
  );
  const [isSubmissionToastVisible, setIsSubmissionToastVisible] = useState(() =>
    Boolean(location.state?.submissionSuccessToast)
  );
  const autoDismissTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const dismissSubmissionToast = () => {
    window.clearTimeout(autoDismissTimerRef.current);
    window.clearTimeout(hideTimerRef.current);

    setIsSubmissionToastVisible(false);

    hideTimerRef.current = window.setTimeout(() => {
      setShowSubmissionToast(false);
    }, 220);
  };

  useEffect(() => {
    if (!location.state?.submissionSuccessToast) {
      return undefined;
    }

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
  }, [location.hash, location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    if (!showSubmissionToast) {
      return undefined;
    }

    autoDismissTimerRef.current = window.setTimeout(() => {
      dismissSubmissionToast();
    }, 3200);

    return () => {
      window.clearTimeout(autoDismissTimerRef.current);
    };
  }, [showSubmissionToast]);

  useEffect(
    () => () => {
      window.clearTimeout(autoDismissTimerRef.current);
      window.clearTimeout(hideTimerRef.current);
    },
    []
  );

  return (
    <div>
      {showSubmissionToast ? (
        <ToastContainer aria-live='polite'>
          <Toast role='status' $visible={isSubmissionToastVisible}>
            <ToastCloseButton
              type='button'
              onClick={dismissSubmissionToast}
              aria-label='Dismiss proposal submitted notification'
              title='Dismiss'
            >
              x
            </ToastCloseButton>
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
