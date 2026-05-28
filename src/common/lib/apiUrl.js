const LOCAL_DEV_HOSTS = new Set(['localhost', '127.0.0.1']);

const normalizeLocalBackendBase = (rawBase) => {
  const trimmedBase = rawBase?.replace(/\/$/, '');
  if (!trimmedBase || typeof window === 'undefined') {
    return trimmedBase;
  }

  try {
    const backendUrl = new URL(trimmedBase);
    const currentUrl = new URL(window.location.origin);

    if (
      LOCAL_DEV_HOSTS.has(backendUrl.hostname) &&
      LOCAL_DEV_HOSTS.has(currentUrl.hostname)
    ) {
      backendUrl.hostname = currentUrl.hostname;
    }

    return backendUrl.toString().replace(/\/$/, '');
  } catch {
    return trimmedBase;
  }
};

export const buildBackendUrl = (path) => {
  const base = normalizeLocalBackendBase(import.meta.env.VITE_BACKEND_URL);
  if (!base) {
    throw new Error('Missing VITE_BACKEND_URL in frontend env.');
  }

  return `${base}${path}`;
};
