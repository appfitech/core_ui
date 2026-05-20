/** Shared FlatList tuning for browse/search screens with cards. */
export const LIST_SCREEN_FLATLIST = {
  initialNumToRender: 8,
  maxToRenderPerBatch: 6,
  windowSize: 7,
  removeClippedSubviews: true,
  itemGap: 12,
} as const;

export const ACTIVE_INACTIVE_CHIPS = [
  { label: 'Activos', value: 'ACTIVE' as const },
  { label: 'Inactivos', value: 'INACTIVE' as const },
];
