type JwtPayload = {
  exp?: number;
  sub?: string;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const segment = token.split('.')[1];
    if (!segment) return null;

    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );

    if (typeof globalThis.atob !== 'function') {
      return null;
    }

    return JSON.parse(globalThis.atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

/** True when JWT `exp` is in the past (optional clock skew). */
export function isJwtExpired(token: string, skewSeconds = 0): boolean {
  const payload = decodeJwtPayload(token);
  if (payload?.exp == null) return false;

  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp - skewSeconds;
}

/** Extract JWT from common API response shapes. */
export function extractAccessToken(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined;

  const data = payload as Record<string, unknown>;

  if (typeof data.token === 'string' && data.token.length > 0) {
    return data.token;
  }

  if (typeof data.accessToken === 'string' && data.accessToken.length > 0) {
    return data.accessToken;
  }

  const nestedKeys = ['result', 'data'] as const;
  for (const key of nestedKeys) {
    const nested = data[key];
    if (nested && typeof nested === 'object') {
      const fromNested = extractAccessToken(nested);
      if (fromNested) return fromNested;
    }
  }

  return undefined;
}
