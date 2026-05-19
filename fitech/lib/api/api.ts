import { refreshAccessToken } from '@/services/auth-session';
import { useUserStore } from '@/stores/user';
import { extractAccessToken } from '@/utils/auth-token';

const API_BASE_URL = 'https://appfitech.com/v1/app';

export type ApiError = Error & {
  status?: number;
  data?: Record<string, unknown>;
};

async function handleResponse(res: Response) {
  const raw = await res.text();
  let parsed: any = {};
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    parsed = { message: raw };
  }
  if (!res.ok) {
    console.error('[API ERROR]', {
      status: res.status,
      url: res.url,
      ...parsed,
    });
    const message =
      parsed?.message ??
      parsed?.error ??
      parsed?.detail ??
      `Error ${res.status}`;
    const error = new Error(String(message));
    (error as ApiError).status = res.status;
    (error as ApiError).data = parsed;
    throw error;
  }
  return parsed;
}

async function refreshTokenOnce(): Promise<string | null> {
  const result = await refreshAccessToken();

  if (result === 'logged_out') {
    return null;
  }

  return useUserStore.getState().getToken();
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  isFormData?: boolean;
  auth?: boolean;
  retryOn401?: boolean;
  headers?: Record<string, string>;
};

async function request(path: string, opts: RequestOptions = {}) {
  const {
    method = 'GET',
    body,
    isFormData = false,
    auth = true,
    retryOn401 = true,
    headers = {},
  } = opts;

  const url = `${API_BASE_URL}${path}`;
  const token = useUserStore.getState().getToken();

  const updatedHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (!isFormData && !updatedHeaders['Content-Type']) {
    updatedHeaders['Content-Type'] = 'application/json';
  }

  if (auth && token) {
    updatedHeaders.Authorization = `Bearer ${token}`;
  }

  const payload = isFormData
    ? body
    : body != null
      ? JSON.stringify(body)
      : undefined;

  const doFetch = (overrideHeaders?: Record<string, string>) =>
    fetch(url, {
      method,
      headers: overrideHeaders ? overrideHeaders : updatedHeaders,
      body: payload,
    });

  let res = await doFetch();

  if (res.status === 401 && auth && retryOn401) {
    const newToken = await refreshTokenOnce();

    if (newToken) {
      const retryHeaders = {
        ...updatedHeaders,
        Authorization: `Bearer ${newToken}`,
      };
      res = await doFetch(retryHeaders);
    }
  }

  // Only clear session when the token is actually rejected (401), not for permission errors (403).
  if (res.status === 401 && auth) {
    await useUserStore.getState().logout();
  }

  return handleResponse(res);
}

export const api = {
  get: (
    path: string,
    opts?: Omit<RequestOptions, 'method' | 'body' | 'isFormData'>,
  ) => request(path, { ...opts, method: 'GET' }),
  post: (
    path: string,
    body: any,
    isFormData = false,
    opts?: Omit<RequestOptions, 'method'>,
  ) => request(path, { ...opts, method: 'POST', body, isFormData }),
  put: (
    path: string,
    body?: any,
    opts?: Omit<RequestOptions, 'method' | 'isFormData'>,
  ) => request(path, { ...opts, method: 'PUT', body }),
  delete: (
    path: string,
    body?: any,
    opts?: Omit<RequestOptions, 'method' | 'isFormData'>,
  ) => request(path, { ...opts, method: 'DELETE', body }),
};

export { extractAccessToken };
