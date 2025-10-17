import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { useTheme } from '@/contexts/ThemeContext';
import { useOpenable } from '@/hooks/use-openable';
import { FullTheme } from '@/types/theme';
import { formatToDDMMYYYY, fromISODate, today, toISODate } from '@/utils/dates';

import { AppText } from './AppText';

type Props = {
  value: string | null;
  onChange: (isoDate: string | null) => void;
  placeholder?: string;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
};

export function DatePicker({
  value,
  onChange,
  placeholder = '',
  minDate = undefined,
  maxDate = undefined,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { isOpen, open, close } = useOpenable();

  const initialDate = useMemo(() => {
    if (value) {
      return fromISODate(value);
    }

    return today();
  }, [value]);

  const displayText = useMemo(
    () => (value ? formatToDDMMYYYY(value) : placeholder),
    [value, placeholder],
  );

  return (
    <>
      <TouchableOpacity
        style={styles.inputRow}
        onPress={open}
        activeOpacity={0.8}
      >
        <Ionicons
          name="calendar-outline"
          size={18}
          color={theme.dark800}
          style={{ marginRight: 8 }}
        />
        <AppText
          style={{
            color: value ? theme.textPrimary : theme.dark700,
            fontSize: 17,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <Ionicons name="chevron-down" size={18} color={theme.icon} />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isOpen}
        mode="date"
        date={initialDate}
        maximumDate={maxDate}
        minimumDate={minDate}
        onConfirm={(picked) => {
          close();
          onChange(toISODate(picked));
        }}
        onCancel={close}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        locale="es-PE"
      />
    </>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundInput,
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 52,
    },
  });
