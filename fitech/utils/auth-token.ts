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
