import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { formStyles, textStyles } from '@/constants/styles';
import { useDatePickerOverlay } from '@/contexts/DatePickerOverlayContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { formatToDDMMYYYY } from '@/utils/dates';

type Props = {
  value: string | null;
  onChange: (isoDate: string | null) => void;
  placeholder?: string;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  label?: string;
};

export function DatePicker({
  value,
  onChange,
  placeholder = '',
  minDate = undefined,
  maxDate = undefined,
  label = '',
}: Props) {
  const { theme } = useTheme();
  const { openDatePicker } = useDatePickerOverlay();
  const styles = getStyles(theme);

  const displayText = useMemo(
    () => (value ? formatToDDMMYYYY(value) : placeholder),
    [value, placeholder],
  );

  return (
    <View>
      {label ? <AppText style={styles.label}>{label}</AppText> : null}
      <Pressable
        style={styles.inputRow}
        onPress={() =>
          openDatePicker({
            value,
            onChange,
            placeholder,
            minDate,
            maxDate,
            label,
          })
        }
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={theme.icon.secondary}
          style={styles.leadingIcon}
        />
        <AppText
          style={[styles.valueText, !value && styles.placeholderText]}
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <Ionicons name="chevron-down" size={20} color={theme.icon.secondary} />
      </Pressable>
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const form = formStyles(theme);
  const text = textStyles(theme);

  return StyleSheet.create({
    label: form.label,
    inputRow: {
      ...form.inputWrapper,
      minHeight: 52,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    leadingIcon: {
      marginRight: 10,
    },
    valueText: {
      flex: 1,
      ...text.link,
      fontFamily: 'Inter_400Regular',
      color: theme.text.primary,
      lineHeight: 22,
    },
    placeholderText: {
      color: theme.icon.muted,
    },
  });
};
