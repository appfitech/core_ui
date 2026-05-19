/** Default Android channel id — must match app channel + expo-notifications plugin defaultChannel. */
export const DEFAULT_ANDROID_NOTIFICATION_CHANNEL_ID = 'default';

export type ExpoPushMessage = {
  to: string;
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  sound?: 'default' | null;
  priority?: 'default' | 'normal' | 'high';
  /** Required on Android for notifications to appear in the tray. */
  channelId?: string;
};

type ExpoPushTicket =
  | { status: 'ok'; id?: string }
  | { status: 'error'; message: string; details?: { error?: string } };

type ExpoPushResponse = {
  data?: ExpoPushTicket[];
  errors?: { code: string; message: string }[];
};

export async function sendExpoPushMessage(
  message: ExpoPushMessage,
): Promise<ExpoPushTicket & { status: 'ok' }> {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
    },
    body: JSON.stringify(message),
  });

  const payload = (await response.json()) as ExpoPushResponse;

  if (!response.ok) {
    const apiError = payload.errors?.[0]?.message ?? response.statusText;
    throw new Error(apiError || 'Expo push API request failed');
  }

  const ticket = payload.data?.[0];

  if (!ticket) {
    throw new Error('Expo push API returned no ticket');
  }

  if (ticket.status === 'error') {
    const detail = ticket.details?.error;
    throw new Error(
      detail ? `${ticket.message} (${detail})` : ticket.message,
    );
  }

  return ticket;
}
