import moment, { ISO_8601, parseZone } from 'moment';

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

export function getDOBMaxDate(): Date {
  const year = moment().year() - 18;

  return moment({ year, month: 11, date: 31 }).toDate();
}

export function getDOBMaxISO(): string {
  return moment(getDOBMaxDate()).format('YYYY-MM-DD');
}
