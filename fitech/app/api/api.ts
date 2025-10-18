import { useUserStore } from '@/stores/user';

const API_BASE_URL = 'https://appfitech.com/v1/app';

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
    const error = new Error(parsed?.message || 'Unknown API error');
    (error as any).status = res.status;
    throw error;
  }
  return parsed;
}

let refreshingPromise: Promise<string | null> | null = null;

async function refreshTokenOnce(): Promise<string | null> {
  if (!refreshingPromise) {
    const token = useUserStore.getState().getToken();

    if (!token) {
      return null;
    }

    refreshingPromise = api
      .post('/user/refresh-token', { token }, false, {
        auth: false,
        retryOn401: false,
      })
      .then(async (data) => {
        const newToken: string | undefined =
          data?.token ?? data?.result?.token ?? data?.data?.token;

        if (!newToken) {
          return null;
        }

        await useUserStore.getState().setToken(newToken);
        return newToken;
      })
      .catch(async () => {
        await useUserStore.getState().logout();
        return null;
      })
      .finally(() => {
        refreshingPromise = null;
      });
  }
  return refreshingPromise;
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

  if ((res.status === 401 || res.status === 403) && auth && retryOn401) {
    const newToken = await refreshTokenOnce();

    if (newToken) {
      const retryHeaders = {
        ...updatedHeaders,
        Authorization: `Bearer ${newToken}`,
      };
      res = await doFetch(retryHeaders);
    }
  }

  if (res.status === 401 || res.status === 403) {
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
