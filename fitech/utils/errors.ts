export const extractErrorMessage = (err: unknown): string => {
  const anyErr: any = err;

  if (typeof anyErr === 'string') {
    return anyErr;
  }

  if (anyErr?.response?.data?.message) {
    return String(anyErr.response.data.message);
  }

  if (anyErr?.response?.data?.error) {
    return String(anyErr.response.data.error);
  }

  if (anyErr?.data?.message) {
    return String(anyErr.data.message);
  }

  if (anyErr?.message) {
    return String(anyErr.message);
  }

  return 'Ocurrió un error al iniciar sesión. Inténtalo nuevamente.';
};
