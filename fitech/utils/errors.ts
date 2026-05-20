const DEFAULT_ERROR_MESSAGE = 'Ocurrió un error. Inténtalo nuevamente.';

export const extractErrorMessage = (
  err: unknown,
  fallback: string = DEFAULT_ERROR_MESSAGE,
): string => {
  const anyErr = err as {
    message?: string;
    data?: { message?: string; error?: string };
    response?: { data?: { message?: string; error?: string } };
  };

  if (typeof err === 'string') {
    return err;
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

  if (anyErr?.data?.error) {
    return String(anyErr.data.error);
  }

  if (anyErr?.message && anyErr.message !== 'Unknown API error') {
    return String(anyErr.message);
  }

  return fallback;
};

type VerifyEmailErrorCopy = {
  invalidToken: string;
  fallback: string;
};

/** User-facing copy for verify-email API failures (400 invalid/expired token, etc.). */
export function resolveVerifyEmailError(
  err: unknown,
  copy: VerifyEmailErrorCopy,
): string {
  const raw = extractErrorMessage(err, copy.fallback);
  const normalized = raw.toLowerCase();

  if (
    normalized.includes('inválido') ||
    normalized.includes('invalid') ||
    normalized.includes('expirado') ||
    normalized.includes('expired') ||
    normalized.includes('ya verif') ||
    normalized.includes('already verif')
  ) {
    return copy.invalidToken;
  }

  return raw;
}

type ResetPasswordErrorCopy = {
  invalidToken: string;
  fallback: string;
};

/** User-facing copy for reset-password API failures (invalid/expired token, etc.). */
export function resolveResetPasswordError(
  err: unknown,
  copy: ResetPasswordErrorCopy,
): string {
  const raw = extractErrorMessage(err, copy.fallback);
  const normalized = raw.toLowerCase();

  if (
    normalized.includes('inválido') ||
    normalized.includes('invalid') ||
    normalized.includes('expirado') ||
    normalized.includes('expired') ||
    normalized.includes('token')
  ) {
    return copy.invalidToken;
  }

  return raw;
}
