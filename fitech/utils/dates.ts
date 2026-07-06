import moment, { ISO_8601, locale, parseZone } from 'moment';

locale('es');

export { moment };

export type DateInput = Date | string | number;

export function today(): Date {
  return moment().startOf('day').toDate();
}

export function formatToDDMMYYYY(d: DateInput): string {
  return moment(d).format('DD/MM/YYYY');
}

export function toISODate(d: DateInput): string {
  return moment(d).format('YYYY-MM-DD');
}

export function fromISODate(iso: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const m = moment(iso, 'YYYY-MM-DD', true);

    if (!m.isValid()) {
      throw new Error('Invalid ISO date (YYYY-MM-DD)');
    }

    return m.toDate();
  }

  const m = parseZone(iso, ISO_8601, true);

  if (!m.isValid()) {
    throw new Error('Invalid ISO datetime string');
  }

  return m.toDate();
}

/** Parse API datetimes as UTC when no offset is present, then convert to local. */
export function parseServerDateTime(iso?: string | null): Date | null {
  if (!iso?.trim()) return null;

  const trimmed = iso.trim();
  const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(trimmed);
  const parsed = hasTimezone
    ? moment.parseZone(trimmed, ISO_8601, true)
    : moment.utc(trimmed, ISO_8601, true);

  if (!parsed.isValid()) return null;

  return parsed.local().toDate();
}

export function formatTimeLocal(iso?: string | null): string {
  const date = parseServerDateTime(iso);
  if (!date) return '';

  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatConversationTimeLocal(
  iso?: string | null,
  yesterdayLabel = 'Ayer',
): string {
  const date = parseServerDateTime(iso);
  if (!date) return '';

  const now = new Date();

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const time = formatTimeLocal(iso);

  if (isSameDay) return time;
  if (isYesterday) return yesterdayLabel;

  const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
  return weekday.length > 0
    ? weekday.charAt(0).toUpperCase() + weekday.slice(1)
    : weekday;
}

export function getDOBMaxDate(): Date {
  const year = moment().year() - 18;

  return moment({ year, month: 11, date: 31 }).toDate();
}

export function getDOBMaxISO(): string {
  return moment(getDOBMaxDate()).format('YYYY-MM-DD');
}
