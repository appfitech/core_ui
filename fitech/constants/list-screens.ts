import { TRANSLATIONS } from '@/constants/strings';

const { common } = TRANSLATIONS;

/** Shared FlatList tuning for browse/search screens with cards. */
export const LIST_SCREEN_FLATLIST = {
  initialNumToRender: 8,
  maxToRenderPerBatch: 6,
  windowSize: 7,
  removeClippedSubviews: true,
  itemGap: 12,
} as const;

export const ACTIVE_INACTIVE_CHIPS = [
  { label: common.active, value: 'ACTIVE' as const },
  { label: common.inactive, value: 'INACTIVE' as const },
];

export const CONTRACT_STATUS_CHIPS = [
  { label: common.active, value: 'ACTIVE' as const },
  { label: TRANSLATIONS.listFilters.completed, value: 'INACTIVE' as const },
];
