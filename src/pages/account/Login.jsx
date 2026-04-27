import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GoogleButton from '@/common/components/atoms/GoogleButton';
import { useUser } from '@/common/contexts/UserContext';
import styled from 'styled-components';

const PageWrapper = styled.div`
  flex: 1;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

const LoginCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  width: 100%;
  max-width: 480px;
  min-height: 380px;
  padding: 56px 48px 48px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 32px;
`;

const HeaderText = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h1`
  width: 100%;
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  color: #111111;
  line-height: 1.35;
  letter-spacing: 0.02em;

  span {
    color: #e2b853;
  }
`;

const Subtitle = styled.p`
  width: 100%;
  font-size: 15px;
  color: #6c6c6c;
  font-weight: 500;
  margin: 0;
  line-height: 1.65;
  letter-spacing: 0.04em;
`;

const ErrorMessage = styled.div`
  width: 100%;
  color: #c41e3a;
  background-color: #fff0f3;
  border: 1px solid #ffdce0;
  padding: 12px 16px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
`;

const CardBottomRule = styled.div`
  height: 1px;
  width: 100%;
  background-color: #e8e8e8;
`;

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { googleAuth } = useUser();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await googleAuth();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <LoginCard>
        <HeaderText>
          <Title>
            <span>Admin</span> Portal Login
          </Title>
          <Subtitle>Secure Login Portal For Dashboard Admin</Subtitle>
        </HeaderText>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton
          showOrDivider={false}
          onClick={handleGoogleSignIn}
          isLoading={isLoading}
          text='Sign in with Google'
        />

        <CardBottomRule aria-hidden='true' />
      </LoginCard>
    </PageWrapper>
  );
}
