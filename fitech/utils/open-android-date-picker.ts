import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import type { AppTheme } from '@/types/theme';
import { fromISODate, today, toISODate } from '@/utils/dates';

export type OpenAndroidDatePickerOptions = {
  value: string | null;
  onChange: (isoDate: string | null) => void;
  minDate?: Date;
  maxDate?: Date;
  theme: AppTheme;
};

/** Initial wheel/calendar position — prefer maxDate (e.g. 18+) over today for DOB fields. */
export function resolveAndroidDatePickerValue(
  value: string | null,
  minDate?: Date,
  maxDate?: Date,
): Date {
  if (value) {
    return fromISODate(value);
  }
  if (maxDate) {
    return maxDate;
  }
  if (minDate) {
    return minDate;
  }
  return today();
}

export function openAndroidDatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  theme,
}: OpenAndroidDatePickerOptions): void {
  DateTimePickerAndroid.open({
    value: resolveAndroidDatePickerValue(value, minDate, maxDate),
    mode: 'date',
    display: 'default',
    minimumDate: minDate,
    maximumDate: maxDate,
    positiveButton: {
      label: 'Aceptar',
      textColor: theme.brand.primary,
    },
    negativeButton: {
      label: 'Cancelar',
      textColor: theme.text.secondary,
    },
    onChange: (event: DateTimePickerEvent, date?: Date) => {
      if (event.type === 'set' && date) {
        onChange(toISODate(date));
      }
    },
  });
}
