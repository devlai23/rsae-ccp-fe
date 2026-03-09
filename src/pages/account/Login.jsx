import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Note: Ensure this path is correct for your specific template!
// If your hook is named differently, adjust this import.
import { UserContext } from '@/common/contexts/UserContext';
import styled from 'styled-components';

// --- STYLED COMPONENTS ---

const PageWrapper = styled.div`
  background-color: #fffdfa;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
`;

const HeaderText = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;

  span {
    color: #e2b853;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #6c6c6c;
  font-weight: 500;
  margin: 0;
`;

const LoginCard = styled.form`
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 30px;
  width: 100%;
  max-width: 550px;
  padding: 4rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 1.1rem;
  font-weight: 700;
  color: #5b5b5b;
`;

const ForgotPasswordLink = styled(Link)`
  font-size: 0.9rem;
  color: #4376ed;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// --- RESTORED MISSING STYLED COMPONENTS ---

const Input = styled.input`
  background-color: #fafafa;
  border: 1px solid #dfdfdf;
  border-radius: 15px;
  padding: 1.2rem 1.5rem;
  font-size: 1.1rem;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #e2b853;
  }
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #e2b853;
`;

const CheckboxLabel = styled.label`
  font-size: 1rem;
  color: #5b5b5b;
  font-weight: 500;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: #e01e48;
  background-color: #ffe3e6;
  border: 1px solid #ffdce0;
  padding: 1rem;
  border-radius: 15px;
  text-align: center;
  font-weight: 600;
`;

// --- COMPONENT LOGIC ---

export default function Login() {
  const navigate = useNavigate();

  // Adjusted to use useContext based on your previous files,
  // but if your template uses a custom hook, you can change this back to: const { login } = useUser();
  const { login, googleAuth } = useContext(UserContext);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // We are using the new unified formState
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    setError(''); // Clears the error if the user starts typing again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formState.email, formState.password);
      // Changed to route to /dashboard instead of / since this is the Admin login
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <HeaderText>
        <Title>
          <span>Admin</span> Portal Login
        </Title>
        <Subtitle>Secure Login Portal For Dashboard Admin</Subtitle>
      </HeaderText>

      {/* Connected to the correct handleSubmit function */}
      <LoginCard onSubmit={handleSubmit}>
        {/* Added error display */}
        {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}

        <FormGroup>
          <Label>Username / Email:</Label>
          <Input
            type='email'
            name='email' // Required for handleChange to work
            placeholder='@rsae-community.org'
            value={formState.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <LabelRow>
            <Label>Password:</Label>
            <ForgotPasswordLink to='/forgot-password'>
              Forgot Password?
            </ForgotPasswordLink>
          </LabelRow>
          <Input
            type='password'
            name='password' // Required for handleChange to work
            placeholder='••••••••••••'
            value={formState.password}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <CheckboxRow>
          <Checkbox type='checkbox' id='trustDevice' />
          <CheckboxLabel htmlFor='trustDevice'>
            Trust this device for 30 days
          </CheckboxLabel>
        </CheckboxRow>

        <button
          type='submit'
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#e6d398' : '#E2B853',
            color: 'black',
            padding: '1.2rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            border: 'none',
            borderRadius: '15px',
          }}
        >
          <span>🔒</span> {isLoading ? 'Logging In...' : 'Secure Login'}
        </button>
      </LoginCard>
    </PageWrapper>
  );
}
