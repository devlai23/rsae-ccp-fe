import { useEffect, useState } from 'react';

const PROPOSAL_VOTE_STORAGE_KEY = 'disc-explore-proposal-votes';

const VALID_VOTE_DIRECTIONS = new Set(['up', 'down']);

const sanitizeVoteSelections = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce(
    (accumulator, [proposalId, direction]) => {
      if (VALID_VOTE_DIRECTIONS.has(direction)) {
        accumulator[String(proposalId)] = direction;
      }

      return accumulator;
    },
    {}
  );
};

const readStoredVoteSelections = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const storedValue = window.localStorage.getItem(PROPOSAL_VOTE_STORAGE_KEY);
    if (!storedValue) {
      return {};
    }

    return sanitizeVoteSelections(JSON.parse(storedValue));
  } catch {
    return {};
  }
};

const writeStoredVoteSelections = (value) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      PROPOSAL_VOTE_STORAGE_KEY,
      JSON.stringify(value)
    );
  } catch {
    // Ignore storage write failures so voting still works for the session.
  }
};

const toSafeNumber = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const normalizeProposalVoteCounts = (proposal) => {
  const legacyVotes = toSafeNumber(proposal?.votes);

  const upvotes =
    proposal?.upvotes == null
      ? Math.max(legacyVotes, 0)
      : Math.max(toSafeNumber(proposal.upvotes), 0);

  const downvotes =
    proposal?.downvotes == null
      ? Math.max(legacyVotes * -1, 0)
      : Math.max(toSafeNumber(proposal.downvotes), 0);

  return {
    upvotes,
    downvotes,
    votes: upvotes - downvotes,
  };
};

export const hydrateProposalVoteData = (proposal, voteSelections = {}) => {
  if (!proposal) {
    return null;
  }

  const { upvotes, downvotes } = normalizeProposalVoteCounts(proposal);
  const currentVote = voteSelections[String(proposal.id)] || null;

  const hydratedUpvotes = upvotes + (currentVote === 'up' ? 1 : 0);
  const hydratedDownvotes = downvotes + (currentVote === 'down' ? 1 : 0);

  return {
    ...proposal,
    currentVote,
    upvotes: hydratedUpvotes,
    downvotes: hydratedDownvotes,
    votes: hydratedUpvotes - hydratedDownvotes,
  };
};

export const toggleProposalVote = (voteSelections, proposalId, direction) => {
  const normalizedProposalId = String(proposalId);
  const currentVote = voteSelections[normalizedProposalId] || null;
  const nextVote = currentVote === direction ? null : direction;

  const nextSelections = { ...voteSelections };

  if (!nextVote) {
    delete nextSelections[normalizedProposalId];
    return nextSelections;
  }

  nextSelections[normalizedProposalId] = nextVote;
  return nextSelections;
};

export default function useProposalVoteMemory() {
  const [voteSelections, setVoteSelections] = useState(
    readStoredVoteSelections
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncStoredVotes = (event) => {
      if (event.key && event.key !== PROPOSAL_VOTE_STORAGE_KEY) {
        return;
      }

      setVoteSelections(readStoredVoteSelections());
    };

    window.addEventListener('storage', syncStoredVotes);

    return () => {
      window.removeEventListener('storage', syncStoredVotes);
    };
  }, []);

  const setProposalVote = (proposalId, direction) => {
    setVoteSelections((currentSelections) => {
      const nextSelections = toggleProposalVote(
        currentSelections,
        proposalId,
        direction
      );

      writeStoredVoteSelections(nextSelections);
      return nextSelections;
    });
  };

  return {
    voteSelections,
    setProposalVote,
  };
}
