import type { Href } from 'expo-router';

import { ROUTES } from '@/constants/routes';

/** Set when a notification targets a route before session hydration completes. */
let pendingPushHref: string | null = null;

export function setPendingPushHref(href: string | null): void {
  pendingPushHref = href;
}

export function hasPendingPushHref(): boolean {
  return pendingPushHref != null;
}

export function takePendingPushHref(): string | null {
  const href = pendingPushHref;
  pendingPushHref = null;
  return href;
}

const ROOT_ALIASES: Record<string, Href> = {
  '/': ROUTES.home,
  '/index': ROUTES.home,
};

/**
 * Reads a deep-link path from Expo push `data` (exp.host API or local notification).
 */
export function getHrefFromPushData(data: unknown): Href | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const payload = data as Record<string, unknown>;
  const raw = payload.navigateTo ?? payload.navigate_to;

  if (typeof raw !== 'string' || raw.length === 0) {
    return null;
  }

  const path = raw.trim();

  if (!path.startsWith('/')) {
    if (__DEV__) {
      console.warn('[Push] navigateTo must start with / — got:', path);
    }
    return null;
  }

  if (path in ROOT_ALIASES) {
    if (__DEV__ && path === '/') {
      console.warn(
        '[Push] navigateTo "/" opens welcome then home. Prefer explicit paths like /diets, /routines, /gymbro.',
      );
    }
    return ROOT_ALIASES[path];
  }

  return parseAppRedirectUrl(path);
}

/** True when href targets home with premium welcome query params. */
export function isPremiumWelcomeHref(href: Href | string | null): boolean {
  if (href == null) return false;

  if (typeof href === 'string') {
    const queryIndex = href.indexOf('?');
    if (queryIndex === -1) return false;
    const params = new URLSearchParams(href.slice(queryIndex + 1));
    return params.get('type') === 'premium' || params.get('from') === 'premium';
  }

  const params = (href as { params?: Record<string, string> }).params;
  return params?.type === 'premium' || params?.from === 'premium';
}

/** Parses `/path?foo=bar` into an Expo Router href with explicit params. */
export function parseAppRedirectUrl(raw: string): Href {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/')) {
    return trimmed as Href;
  }

  const queryIndex = trimmed.indexOf('?');
  if (queryIndex === -1) {
    return trimmed as Href;
  }

  const pathname = trimmed.slice(0, queryIndex);
  const params: Record<string, string> = {};

  new URLSearchParams(trimmed.slice(queryIndex + 1)).forEach((value, key) => {
    params[key] = value;
  });

  return { pathname, params } as Href;
}
