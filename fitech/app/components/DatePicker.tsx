// src/components/DOBPicker.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText'; // your styled text component

type Props = {
  value: string | null; // 'YYYY-MM-DD'
  onChange: (isoDate: string | null) => void;
  placeholder?: string;
};

const toISODate = (d: Date) => {
  // calendar date, no timezone shift
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export function DatePicker({
  value,
  onChange,
  placeholder = 'Fecha de nacimiento',
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [visible, setVisible] = useState(false);

  const today = useMemo(() => new Date(), []);
  const minDate = useMemo(() => new Date(1900, 0, 1), []);
  const initialDate = useMemo(() => {
    if (value) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, (m ?? 1) - 1, d ?? 1);
    }
    return new Date();
  }, [value]);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    [],
  );

  const displayText = value ? formatter.format(initialDate) : placeholder;

  return (
    <>
      <TouchableOpacity
        style={styles.inputRow}
        onPress={() => setVisible(true)}
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
        isVisible={visible}
        mode="date"
        date={initialDate}
        maximumDate={today}
        minimumDate={minDate}
        onConfirm={(picked) => {
          setVisible(false);
          onChange(toISODate(picked));
        }}
        onCancel={() => setVisible(false)}
        // Nice iOS look; Android uses native 'default'
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
      backgroundColor: theme.backgroundInput, // same as your inputs
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 52,
    },
  });
