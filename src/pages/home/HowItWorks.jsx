import React from 'react';

import styled from 'styled-components';

// --- STYLED COMPONENTS ---

const SectionContainer = styled.section`
  padding: 5rem 4rem;
  background-color: #fcfcfc; /* A very light grey to separate it from the yellow bar */
`;

const HeaderGroup = styled.div`
  margin-bottom: 3rem;
  max-width: 600px;
`;

const Subtitle = styled.p`
  color: #e2b853; /* RSAE Gold */
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: #1a1a1a;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #555555;
  line-height: 1.6;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const StepCard = styled.div`
  background-color: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #e2b853; /* Gold accent line at the top of each card */
`;

const StepNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  color: #f0f0f0; /* Very light grey so it acts as a background element */
  line-height: 1;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #1a1a1a;
`;

const StepText = styled.p`
  font-size: 1rem;
  color: #666666;
  line-height: 1.5;
`;

// --- COMPONENT LOGIC ---

export default function HowItWorks() {
  const stepsData = [
    {
      num: '01',
      title: 'Submit',
      text: 'Share your idea for the neighbourhood through a basic form',
    },
    {
      num: '02',
      title: 'Review',
      text: 'Share your idea for the neighbourhood through a basic form',
    },
    {
      num: '03',
      title: 'Browse',
      text: 'Share your idea for the neighbourhood through a basic form',
    },
    {
      num: '04',
      title: 'Update',
      text: 'Share your idea for the neighbourhood through a basic form',
    },
  ];

  return (
    <SectionContainer>
      <HeaderGroup>
        <Subtitle>How It Works —</Subtitle>
        <Title>Four Simple Steps</Title>
        <Description>
          A clear and simple process to make sure your ideas, and the ones your
          community supports, are implemented transparently.
        </Description>
      </HeaderGroup>

      <StepsGrid>
        {stepsData.map((step, index) => (
          <StepCard key={index}>
            <StepNumber>{step.num}</StepNumber>
            <StepTitle>{step.title}</StepTitle>
            <StepText>{step.text}</StepText>
          </StepCard>
        ))}
      </StepsGrid>
    </SectionContainer>
  );
}
