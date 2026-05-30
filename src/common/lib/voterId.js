const VOTER_ID_STORAGE_KEY = 'ccp_voter_id';
const VOTER_COOKIE_NAME = 'ccp_vid';

const isValidUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

const generateUuid = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const syncBrowserVoterCookie = (voterId) => {
  if (typeof document === 'undefined' || !voterId) {
    return;
  }

  const isHttps = window.location.protocol === 'https:';
  document.cookie = [
    `${VOTER_COOKIE_NAME}=${voterId}`,
    'Path=/',
    'Max-Age=31536000',
    'SameSite=Lax',
    isHttps ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
};

export const getBrowserVoterId = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const existingId = window.localStorage.getItem(VOTER_ID_STORAGE_KEY)?.trim();
  if (existingId && isValidUuid(existingId)) {
    syncBrowserVoterCookie(existingId);
    return existingId;
  }

  const nextId = generateUuid();
  window.localStorage.setItem(VOTER_ID_STORAGE_KEY, nextId);
  syncBrowserVoterCookie(nextId);
  return nextId;
};

export const withVoterIdHeader = (headers = {}) => {
  const voterId = getBrowserVoterId();

  if (!voterId) {
    return headers;
  }

  return {
    ...headers,
    'X-Voter-Id': voterId,
  };
};

export const appendVoterIdToPath = (path) => {
  const voterId = getBrowserVoterId();
  if (!voterId) {
    return path;
  }

  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}voterId=${encodeURIComponent(voterId)}`;
};
