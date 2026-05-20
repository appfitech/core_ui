/** Request bodies for `/user/*` auth endpoints (paths omit `/v1/app` — see `lib/api/api.ts`). */

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
