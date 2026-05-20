import { LINKING } from '@/constants/linking';

const TOKEN_PARAM_NAMES = ['token', 'resetToken', 'reset_token'] as const;

/** Extract token from router search params or alternate BE query names. */
export function resolveDeepLinkToken(
  param: string | string[] | undefined,
): string | undefined {
  if (param == null) return undefined;
  const value = Array.isArray(param) ? param[0] : param;
  const trimmed = value?.trim();
  return trimmed || undefined;
}

/** Read token from route params (`token`, `resetToken`, `reset_token`). */
export function resolveTokenFromParams(
  params: Record<string, string | string[] | undefined>,
): string | undefined {
  for (const name of TOKEN_PARAM_NAMES) {
    const token = resolveDeepLinkToken(params[name]);
    if (token) return token;
  }
  return undefined;
}

function rewriteTokenQuery(search: string): string {
  if (!search) return '';
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search,
  );
  const token = TOKEN_PARAM_NAMES.map((name) => params.get(name)).find(Boolean);
  if (!token) return search.startsWith('?') ? search : `?${search}`;
  const next = new URLSearchParams();
  next.set('token', token);
  return `?${next.toString()}`;
}

/**
 * Rewrites external URLs (Universal Links, custom scheme) into Expo Router paths.
 * Used by `app/+native-intent.tsx` on native cold start / external opens.
 */
export function normalizeDeepLinkPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return path;

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    const q = trimmed.indexOf('?');
    if (q === -1) return trimmed;
    return trimmed.slice(0, q) + rewriteTokenQuery(trimmed.slice(q));
  }

  let url: URL;
  try {
    url = trimmed.includes('://')
      ? new URL(trimmed)
      : new URL(
          trimmed.startsWith('/') ? trimmed : `/${trimmed}`,
          `https://${LINKING.host}`,
        );
  } catch {
    return path;
  }

  if (url.protocol === `${LINKING.scheme}:`) {
    const host = url.hostname;
    if (host === 'reset-password' || host === 'verify-email') {
      const routePath = `/${host}${url.pathname !== '/' ? url.pathname : ''}`;
      return routePath + rewriteTokenQuery(url.search);
    }
  }

  const host = url.hostname.replace(/^www\./, '');
  if (host === LINKING.host) {
    let pathname = url.pathname;
    if (pathname.startsWith('/user/reset-password')) {
      pathname = '/reset-password';
    } else if (pathname.startsWith('/user/verify-email')) {
      pathname = '/verify-email';
    }
    if (
      pathname === LINKING.paths.resetPassword ||
      pathname.startsWith(`${LINKING.paths.resetPassword}/`) ||
      pathname === LINKING.paths.verifyEmail ||
      pathname.startsWith(`${LINKING.paths.verifyEmail}/`)
    ) {
      return pathname + rewriteTokenQuery(url.search);
    }
  }

  return path;
}
