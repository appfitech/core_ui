import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BackHandler,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import {
  ensureSpanishCalendarLocale,
  getCalendarTheme,
} from '@/utils/calendar';
import { formatToDDMMYYYY, fromISODate, today, toISODate } from '@/utils/dates';

import type { DatePickerOpenOptions } from './types';

type Props = DatePickerOpenOptions & {
  onClose: () => void;
};

export function DatePickerOverlay({
  value,
  onChange,
  minDate,
  maxDate,
  label = '',
  onClose,
}: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const styles = getStyles(theme);

  const initialIso = useMemo(() => {
    if (value) return value;
    return toISODate(today());
  }, [value]);

  const [currentMonth, setCurrentMonth] = useState(initialIso);

  useEffect(() => {
    ensureSpanishCalendarLocale();
    setCurrentMonth(initialIso);
  }, [initialIso]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleDismiss();
      return true;
    });
    return () => sub.remove();
  }, [handleDismiss]);

  const handleDayPress = useCallback(
    (day: DateData) => {
      onChange(day.dateString);
      onClose();
    },
    [onChange, onClose],
  );

  const selectedIso = value || initialIso;

  return (
    <View
      style={[styles.host, { width: windowWidth, height: windowHeight }]}
      accessibilityViewIsModal
    >
      <Pressable style={styles.backdrop} onPress={handleDismiss} />
      <View
        style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <View style={styles.sheetHeader}>
          <AppText variant="bodySemibold" style={styles.sheetTitle}>
            {label || 'Selecciona una fecha'}
          </AppText>
          <Pressable
            onPress={handleDismiss}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Cerrar"
          >
            <Ionicons name="close" size={24} color={theme.icon.secondary} />
          </Pressable>
        </View>

        <AppText variant="caption" style={styles.hint}>
          Toca un día para guardar
        </AppText>

        <Calendar
          key={currentMonth}
          current={currentMonth}
          onDayPress={handleDayPress}
          onMonthChange={(month: DateData) => setCurrentMonth(month.dateString)}
          minDate={minDate ? toISODate(minDate) : undefined}
          maxDate={maxDate ? toISODate(maxDate) : undefined}
          firstDay={1}
          enableSwipeMonths
          theme={getCalendarTheme(theme)}
          markedDates={{
            [selectedIso]: {
              selected: true,
              selectedColor: theme.brand.primary,
            },
          }}
          style={styles.calendar}
        />
      </View>
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    host: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10001,
      elevation: 10001,
      justifyContent: 'flex-end',
      backgroundColor: theme.background.overlay,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      backgroundColor: theme.background.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 12,
      paddingHorizontal: 16,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    sheetTitle: {
      color: theme.text.primary,
      flex: 1,
    },
    hint: {
      color: theme.text.secondary,
      marginBottom: 8,
    },
    calendar: {
      borderRadius: 12,
      overflow: 'hidden',
    },
  });
};
