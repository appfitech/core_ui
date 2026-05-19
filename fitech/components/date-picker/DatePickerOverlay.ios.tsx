import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { fromISODate, today, toISODate } from '@/utils/dates';

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

  const initialDate = useMemo(() => {
    if (value) return fromISODate(value);
    return today();
  }, [value]);

  const [draftDate, setDraftDate] = useState(initialDate);

  useEffect(() => {
    setDraftDate(initialDate);
  }, [initialDate]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    onChange(toISODate(draftDate));
    onClose();
  }, [draftDate, onChange, onClose]);

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

        <DateTimePicker
          value={draftDate}
          mode="date"
          display="spinner"
          locale="es-PE"
          themeVariant="dark"
          accentColor={theme.brand.primary}
          textColor={theme.text.primary}
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={(_event: unknown, date?: Date) => {
            if (date) setDraftDate(date);
          }}
          style={styles.picker}
        />

        <Button
          label="Listo"
          type="primary"
          onPress={handleConfirm}
          animated={false}
          style={styles.done}
          buttonStyle={styles.doneButton}
        />
      </View>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
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
    picker: {
      alignSelf: 'center',
      width: '100%',
    },
    done: {
      marginTop: 12,
      width: '100%',
    },
    doneButton: {
      width: '100%',
    },
  });
