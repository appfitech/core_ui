import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { DatePickerOverlay } from '@/components/date-picker/DatePickerOverlay';
import type { DatePickerOpenOptions } from '@/components/date-picker/types';

type DatePickerOverlayContextValue = {
  openDatePicker: (options: DatePickerOpenOptions) => void;
};

const DatePickerOverlayContext = createContext<DatePickerOverlayContextValue>({
  openDatePicker: () => {},
});

export function useDatePickerOverlay() {
  return useContext(DatePickerOverlayContext);
}

export function DatePickerOverlayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sheet, setSheet] = useState<DatePickerOpenOptions | null>(null);

  const close = useCallback(() => {
    setSheet(null);
  }, []);

  const openDatePicker = useCallback((options: DatePickerOpenOptions) => {
    setSheet(options);
  }, []);

  const value = useMemo(
    () => ({ openDatePicker }),
    [openDatePicker],
  );

  return (
    <DatePickerOverlayContext.Provider value={value}>
      {children}
      {sheet ? <DatePickerOverlay {...sheet} onClose={close} /> : null}
    </DatePickerOverlayContext.Provider>
  );
}
