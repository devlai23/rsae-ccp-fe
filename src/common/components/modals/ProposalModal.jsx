import { useContext, useEffect, useState } from 'react';

import { UserContext } from '@/common/contexts/UserContext';
import { auth } from '@/firebase-config';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 24px;
  width: 92%;
  max-width: 900px;
  max-height: 86vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1.3rem;
  border: none;
  background: none;
  font-size: 1.4rem;
  color: #8f8f8f;
  cursor: pointer;
`;

const Title = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1.75rem;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-bottom: 1.2rem;
  color: #666;
  font-size: 0.9rem;
`;

const InfoBadge = styled.span`
  border: 1px solid #e4e4e4;
  border-radius: 999px;
  background: #f9f9f9;
  padding: 0.2rem 0.6rem;
`;

const DetailBox = styled.div`
  border: 1px solid #e4e4e4;
  border-radius: 14px;
  background: #fafafa;
  padding: 1rem;
  margin-top: 0.8rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const Text = styled.p`
  margin: 0.55rem 0 0;
  line-height: 1.6;
  color: #2e2e2e;
`;

const TagsWrap = styled.div`
  margin-top: 0.6rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const TagChip = styled.span`
  border: 1px solid #d9d9d9;
  border-radius: 999px;
  background: #fff;
  padding: 0.2rem 0.6rem;
  font-size: 0.78rem;
  color: #555;
`;

const StateText = styled.div`
  margin-top: 1rem;
  border: 1px dashed #d5d5d5;
  border-radius: 12px;
  background: #fbfbfb;
  color: ${(props) => (props.$error ? '#cb3939' : '#696969')};
  padding: 0.95rem;
`;

const CommentsTitle = styled.h3`
  margin: 1.4rem 0 0.8rem;
  font-size: 1.1rem;
`;

const CommentsPanel = styled.div`
  border: 1px solid #e4e4e4;
  border-radius: 14px;
  background: #ffffff;
  padding: 1rem;
`;

const CommentsList = styled.div`
  max-height: 220px;
  overflow-y: auto;
  padding-right: 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const CommentRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const CommentHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: #6a6a6a;
  font-size: 0.85rem;
  font-weight: 600;
`;

const CommentBody = styled.p`
  margin: 0;
  color: #2e2e2e;
  line-height: 1.45;
`;

const CommentComposer = styled.form`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const CommentTextArea = styled.textarea`
  width: 96%;
  min-height: 92px;
  border: 1px solid #dfdfdf;
  border-radius: 14px;
  background: #fafafa;
  padding: 0.9rem 1rem;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #e2b853;
    background: #fff;
  }
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CommentSubmitButton = styled.button`
  border: none;
  border-radius: 12px;
  background: #f4ca25;
  color: #1a1a1a;
  padding: 0.55rem 0.9rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const buildApiUrl = (path) => {
  const base = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
  if (!base) {
    throw new Error('Missing VITE_BACKEND_URL in frontend env.');
  }
  return `${base}${path}`;
};

async function fetchApi(path, init = {}) {
  const token = await auth.currentUser?.getIdToken?.();
  const headers = { ...(init.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildApiUrl(path), {
    ...init,
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Request failed (${response.status})`);
  }

  return response.json();
}

export default function ProposalModal({
  proposalData,
  isLoading,
  error,
  onClose,
}) {
  const { user } = useContext(UserContext);
  const proposalId = proposalData?.id ?? null;

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState('');
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setDraft('');
  }, [proposalId]);

  useEffect(() => {
    if (!proposalId || isLoading || error) {
      setComments([]);
      setCommentsError('');
      setCommentsLoading(false);
      return;
    }

    let cancelled = false;

    const loadComments = async () => {
      setCommentsLoading(true);
      setCommentsError('');
      try {
        const data = await fetchApi(`/proposals/${proposalId}/comments`);
        if (!cancelled) {
          setComments(data.comments || []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setComments([]);
          setCommentsError(
            loadError.message || 'Failed to load comments'
          );
        }
      } finally {
        if (!cancelled) {
          setCommentsLoading(false);
        }
      }
    };

    loadComments();
    return () => {
      cancelled = true;
    };
  }, [proposalId, isLoading, error]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !proposalId || posting) {
      return;
    }

    const authorFromUser =
      user?.username ||
      user?.email?.split('@')[0] ||
      user?.displayName ||
      undefined;

    setPosting(true);
    try {
      const payload = { body: trimmed };
      if (authorFromUser) {
        payload.author = authorFromUser;
      }

      const created = await fetchApi(`/proposals/${proposalId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setComments((current) => [...current, created]);
      setDraft('');
      setCommentsError('');
    } catch (postError) {
      setCommentsError(postError.message || 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(event) => event.stopPropagation()}>
        <CloseButton onClick={onClose}>x</CloseButton>

        {isLoading ? <StateText>Loading proposal details...</StateText> : null}

        {!isLoading && error ? <StateText $error>{error}</StateText> : null}

        {!isLoading && !error && proposalData ? (
          <>
            <Title>{proposalData.title}</Title>
            <Meta>
              <InfoBadge>Category: {proposalData.category}</InfoBadge>
              <InfoBadge>Status: {proposalData.status}</InfoBadge>
              <InfoBadge>Votes: {proposalData.votes}</InfoBadge>
              <InfoBadge>Submitted By: {proposalData.submittedBy}</InfoBadge>
              <InfoBadge>
                Submitted: {formatDate(proposalData.submittedAt)}
              </InfoBadge>
            </Meta>

            <DetailBox>
              <SectionTitle>Description</SectionTitle>
              <Text>{proposalData.description}</Text>
            </DetailBox>

            <DetailBox>
              <SectionTitle>Tags</SectionTitle>
              {proposalData.tags?.length ? (
                <TagsWrap>
                  {proposalData.tags.map((tag) => (
                    <TagChip key={tag}>{tag}</TagChip>
                  ))}
                </TagsWrap>
              ) : (
                <Text>No tags provided.</Text>
              )}
            </DetailBox>

            <CommentsTitle>Comments</CommentsTitle>
            <CommentsPanel>
              {commentsLoading ? (
                <Text>Loading comments...</Text>
              ) : null}
              {!commentsLoading && commentsError ? (
                <StateText $error>{commentsError}</StateText>
              ) : null}
              {!commentsLoading && !comments.length && !commentsError ? (
                <Text>No comments yet. Be the first to share your thoughts.</Text>
              ) : null}
              {!commentsLoading && comments.length ? (
                <CommentsList>
                  {comments.map((comment) => (
                    <CommentRow key={comment.id}>
                      <CommentHeaderRow>
                        <span>{comment.author}</span>
                        <span>{formatDate(comment.createdAt)}</span>
                      </CommentHeaderRow>
                      <CommentBody>{comment.body}</CommentBody>
                    </CommentRow>
                  ))}
                </CommentsList>
              ) : null}

              <CommentComposer onSubmit={handleSubmitComment}>
                <CommentTextArea
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                  }}
                  placeholder='Leave your thoughts...'
                  aria-label='Write a comment'
                  disabled={posting}
                />
                <SubmitRow>
                  <CommentSubmitButton
                    type='submit'
                    disabled={!draft.trim() || posting || commentsLoading}
                  >
                    Post Comment
                  </CommentSubmitButton>
                </SubmitRow>
              </CommentComposer>
            </CommentsPanel>
          </>
        ) : null}
      </ModalContent>
    </Overlay>
  );
}
