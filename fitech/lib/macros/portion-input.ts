/** Validates partial decimal input (allows trailing `.`). */
export function isValidPortionInput(text: string): boolean {
  return text === '' || /^\d*\.?\d*$/.test(text);
}

export function parsePortionInput(text: string): number {
  if (text === '' || text === '.') return 0;
  const normalized = text.replace(',', '.');
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}

export function formatPortionInput(quantity: number | undefined): string {
  if (quantity == null || Number.isNaN(quantity)) return '';
  return String(quantity);
}
