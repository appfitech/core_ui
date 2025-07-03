export function truncateWords(text: string, limit: number): string {
  if (!text) return '';

  const cleaned = text
    .replace(/\n/g, ' ') // Replace newlines with space
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();

  const words = cleaned.split(' ');

  if (words.length <= limit) return cleaned;

  return words.slice(0, limit).join(' ') + '…';
}
