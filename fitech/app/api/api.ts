const API_BASE_URL = "https://appfitech.com/v1/app";

import { useUserStore } from "../stores/user";

async function handleResponse(res: Response) {
  if (!res.ok) {
    let errorBody = {};
    try {
      errorBody = await res.json();
    } catch {
      // fallback if response is not JSON
      errorBody = { message: await res.text() };
    }

    console.error("[API ERROR]", {
      status: res.status,
      url: res.url,
      ...errorBody
    });

    const error = new Error(errorBody?.message || "Unknown API error");
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
}

export const api = {
  get: async (path: string) => {
    const token = useUserStore.getState().user?.token;

    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    return handleResponse(res);
  },

  post: async (path: string, body: any) => {
    const token = useUserStore.getState().user?.token;

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(body)
    });

    return handleResponse(res);
  },

  put: async (path: string, body: any) => {
    const token = useUserStore.getState().user?.token;

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(body)
    });

    return handleResponse(res);
  }
};

// export const requestHandler = async <T>(
//   route: string,
//   requestConfiguration?: Omit<RequestInit, "body"> & {
//     body?: Record<string, any> | BodyInit;
//     skipJsonParse?: boolean;
//   }
// ): Promise<T> => {
//   const config = { ...requestConfiguration };
//   const { skipJsonParse, ...restConfig } = config;

//   if (
//     restConfig.body &&
//     typeof restConfig.body === "object" &&
//     !(restConfig.body instanceof FormData) &&
//     !(restConfig.body instanceof Blob) &&
//     !(restConfig.body instanceof ArrayBuffer)
//   ) {
//     restConfig.body = JSON.stringify(restConfig.body);

//     restConfig.headers = {
//       "Content-Type": "application/json",
//       ...(restConfig.headers ?? {})
//     };
//   }

//   let response = await fetch(route, restConfig as RequestInit);

//   if (!response.ok) {
//     const errorData = await response.json();

//     throwCustomError(
//       errorData.message ??
//         errorData?.error?.detail ??
//         errorData?.detail ??
//         "An error occurred",
//       response.status
//     );
//     return;
//   }

//   if (skipJsonParse) {
//     return response.text() as T;
//   }

//   response = await response.json();

//   return response as T;
// };
