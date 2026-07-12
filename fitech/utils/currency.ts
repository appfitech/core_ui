const PEN = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
});

export const formatPEN = (value: number | undefined | null) =>
  PEN.format(value ?? 0);
