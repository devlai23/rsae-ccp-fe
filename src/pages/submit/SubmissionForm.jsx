import React, { useState } from 'react';

import ProposalSubmitButton from '@/common/components/buttons/ProposalSubmitButton';
import styled from 'styled-components';

const buildApiUrl = (path) => {
  const base = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
  if (!base) {
    throw new Error('Missing VITE_BACKEND_URL in frontend env.');
  }
  return `${base}${path}`;
};

// --- STYLED COMPONENTS ---

const PageWrapper = styled.div`
  background-color: #fffdfa;
  min-height: 100vh;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  text-align: center;
`;

const FormContainer = styled.form`
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 30px;
  width: 100%;
  max-width: 900px;
  padding: 4rem 5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 700;
  color: #000000;
`;

const inputStyles = `
  background-color: #fafafa;
  border: 1px solid #dfdfdf;
  border-radius: 15px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #E2B853; /* RSAE Gold focus ring */
  }
`;

const StyledSelect = styled.select`
  ${inputStyles}
`;
const StyledTextArea = styled.textarea`
  ${inputStyles}
  min-height: 130px;
  resize: vertical;
`;
const StyledInput = styled.input`
  ${inputStyles}
`;

const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 3rem 0 2rem 0;
`;

const SectionHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const PrivateBadge = styled.span`
  background-color: #f0f6ff;
  color: #4376ed;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;

  /* Makes them stack on small screens */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DividerLine = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 2.5rem 0;
`;

const ToggleGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: ${(props) => (props.$active ? '#E2B853' : '#ffffff')};
  color: ${(props) => (props.$active ? '#000000' : '#333333')};
  border: 1px solid ${(props) => (props.$active ? '#E2B853' : '#dfdfdf')};
  border-radius: 15px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$active ? '#d1a742' : '#fafafa')};
  }
`;

const PrivacyNotice = styled.div`
  background-color: #fff6d1;
  border: 1px solid #ffda4b;
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 3rem;
  color: #555;
  line-height: 1.5;
`;

// --- COMPONENT RENDER ---

export default function SubmissionForm() {
  // state for relation toggles
  const [formData, setFormData] = useState({
    category: '',
    proposalTitle: '',
    description: '',
    fullName: '',
    email: '',
    relationToEvanston: 'No Relation',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  //const[isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.category.trim()) {
      newErrors.category = 'Please choose a category.';
    }

    if (!formData.proposalTitle.trim()) {
      newErrors.proposalTitle = 'Please enter a short title for your idea.';
    } else if (formData.proposalTitle.trim().length < 5) {
      newErrors.proposalTitle = 'Title must be at least 5 characters.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Idea description cannot be blank.';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.relationToEvanston.trim()) {
      newErrors.relationToEvanston = 'Please select your relation to Evanston.';
    }

    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess('');
      return;
    }

    try {
      const payload = {
        title: formData.proposalTitle.trim(),
        category: formData.category,
        description: formData.description,
        submittedBy: formData.fullName,
      };

      const proposalsUrl = buildApiUrl('/proposals');
      const response = await fetch(proposalsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // #region agent log
      fetch('http://127.0.0.1:7597/ingest/2b765efe-bf6e-4410-862c-372765e6b5a4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': 'f0e25d',
        },
        body: JSON.stringify({
          sessionId: 'f0e25d',
          runId: 'post-fix',
          hypothesisId: 'H3',
          location: 'SubmissionForm.jsx:handleSubmit',
          message: 'proposal POST response',
          data: {
            ok: response.ok,
            status: response.status,
            postPath: '/proposals',
            usesViteBackendUrl: true,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit proposal');
      }

      const result = await response.json();
      console.log('Successfully saved to backend:', result);

      setSuccess('Proposal submitted successfully!');
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      // #region agent log
      fetch('http://127.0.0.1:7597/ingest/2b765efe-bf6e-4410-862c-372765e6b5a4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': 'f0e25d',
        },
        body: JSON.stringify({
          sessionId: 'f0e25d',
          runId: 'post-fix',
          hypothesisId: 'H3',
          location: 'SubmissionForm.jsx:handleSubmit',
          message: 'proposal POST catch',
          data: { errorMessage: error?.message ?? String(error) },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setErrors({
        submit: error.message || 'An error occurred while submitting.',
      });
      setSuccess('');
    }
  }

  return (
    <PageWrapper>
      <PageTitle>Community Proposal Submission Form</PageTitle>

      <FormContainer onSubmit={handleSubmit}>
        {/* CATEGORY */}
        <FormGroup>
          <Label>Select the category that fits the best:</Label>
          <StyledSelect
            name='category'
            value={formData.category}
            onChange={handleChange}
          >
            <option value='' disabled>
              Choose a category...
            </option>
            <option value='housing'>Housing</option>
            <option value='health'>Health & Wellness</option>
            <option value='economic'>Economic Development</option>
            <option value='arts'>Arts & Culture</option>
            <option value='education'>Education</option>
          </StyledSelect>
          {errors.category && <p>{errors.category}</p>}
        </FormGroup>

        <FormGroup>
          <Label>Proposal title</Label>
          <StyledInput
            type='text'
            name='proposalTitle'
            value={formData.proposalTitle}
            onChange={handleChange}
            maxLength={255}
            placeholder='Short headline for your idea (this is what others will see)'
          />
          {errors.proposalTitle && <p>{errors.proposalTitle}</p>}
        </FormGroup>

        {/* DESCRIPTION */}
        <FormGroup>
          <Label>Describe your idea in detail:</Label>
          <StyledTextArea
            type='text'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Keep your ideas clear and actionable for the best community support.'
          />
          {errors.description && <p>{errors.description}</p>}
        </FormGroup>

        {/* PERSONAL INFO SECTION */}
        <SectionDivider>
          <SectionHeader>Your Information</SectionHeader>
          <PrivateBadge>🔒 Private / Internal Use Only</PrivateBadge>
        </SectionDivider>

        <InputRow>
          <FormGroup style={{ flex: 1, marginBottom: 0 }}>
            <Label style={{ fontSize: '1rem', color: '#666' }}>Full Name</Label>
            <StyledInput
              type='text'
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
              placeholder='Jane Doe'
            />
            {errors.fullName && <p>{errors.fullName}</p>}
          </FormGroup>
          <FormGroup style={{ flex: 1, marginBottom: 0 }}>
            <Label style={{ fontSize: '1rem', color: '#666' }}>
              Email Address
            </Label>
            <StyledInput
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='jane@example.com'
            />
            {errors.email && <p>{errors.email}</p>}
          </FormGroup>
        </InputRow>

        <DividerLine />

        {/* RELATION TOGGLES */}
        <FormGroup>
          <Label style={{ textAlign: 'center' }}>Relation to Evanston</Label>
          <ToggleGroup>
            <ToggleButton
              type='button'
              $active={formData.relationToEvanston === 'No Relation'}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  relationToEvanston: 'No Relation',
                }))
              }
            >
              No Relation
            </ToggleButton>
            <ToggleButton
              type='button'
              $active={formData.relationToEvanston === 'Former Resident'}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  relationToEvanston: 'Former Resident',
                }))
              }
            >
              Former Resident
            </ToggleButton>
            <ToggleButton
              type='button'
              $active={formData.relationToEvanston === 'Current Resident'}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  relationToEvanston: 'Current Resident',
                }))
              }
            >
              Current Resident
            </ToggleButton>
          </ToggleGroup>
          {errors.relationToEvanston && <p>{errors.relationToEvanston}</p>}
        </FormGroup>

        {/* PRIVACY NOTICE */}
        <PrivacyNotice>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <strong>Privacy Notice:</strong> Your contact details are never
            shared publicly. They are only used only for verification by the
            admin team. Ideas are reviewed for transparency and community
            standards before being posted.
          </div>
        </PrivacyNotice>

        {/* SUBMIT BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProposalSubmitButton type='submit'>
            Submit Proposal
          </ProposalSubmitButton>
        </div>
        {success && <p>{success}</p>}
      </FormContainer>
    </PageWrapper>
  );
}
