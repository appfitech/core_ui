export type Option = {
  label: string;
  value: string;
  /** Non-selectable row (e.g. section headers in grouped lists). */
  disabled?: boolean;
};

export type MatchScreenTab = 'discover' | 'matches' | 'requests';

export type MatchScreenType = 'gymbro' | 'gymcrush';
