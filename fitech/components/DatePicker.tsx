import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Tag } from '@/components/Tag';
import { formStyles, textStyles } from '@/constants/styles';
import { useDatePickerOverlay } from '@/contexts/DatePickerOverlayContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { formatToDDMMYYYY } from '@/utils/dates';
import { openAndroidDatePicker } from '@/utils/open-android-date-picker';

type Props = {
  value: string | null;
  onChange: (isoDate: string | null) => void;
  placeholder?: string;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  label?: string;
  required?: boolean;
};

export function DatePicker({
  value,
  onChange,
  placeholder = '',
  minDate = undefined,
  maxDate = undefined,
  label = '',
  required = true,
}: Props) {
  const { theme } = useTheme();
  const { openDatePicker } = useDatePickerOverlay();
  const styles = getStyles(theme);

  const displayText = useMemo(
    () => (value ? formatToDDMMYYYY(value) : placeholder),
    [value, placeholder],
  );

  const handlePress = useCallback(() => {
    if (Platform.OS === 'android') {
      openAndroidDatePicker({ value, onChange, minDate, maxDate, theme });
      return;
    }

    openDatePicker({
      value,
      onChange,
      placeholder,
      minDate,
      maxDate,
      label,
    });
  }, [
    value,
    onChange,
    placeholder,
    minDate,
    maxDate,
    label,
    theme,
    openDatePicker,
  ]);

  return (
    <View>
      {label ? (
        <View style={styles.labelContainer}>
          <AppText style={styles.label}>{label}</AppText>
          {!required && (
            <Tag
              backgroundColor={theme.status.warning.bg}
              textColor={theme.status.warning.text}
              style={styles.optionalTag}
              label="Opcional"
            />
          )}
        </View>
      ) : null}
      <Pressable style={styles.inputRow} onPress={handlePress}>
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
    labelContainer: form.labelContainer,
    label: form.label,
    optionalTag: form.optionalTag,
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
