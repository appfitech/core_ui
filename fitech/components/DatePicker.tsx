import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { formStyles, textStyles } from '@/constants/styles';
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
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme);

  const { isOpen, open, close } = useOpenable();

  const initialDate = useMemo(() => {
    if (value) {
      return fromISODate(value);
    }

    return today();
  }, [value]);

  const [draftDate, setDraftDate] = useState(initialDate);

  useEffect(() => {
    if (isOpen) {
      setDraftDate(initialDate);
    }
  }, [initialDate, isOpen]);

  const displayText = useMemo(
    () => (value ? formatToDDMMYYYY(value) : placeholder),
    [value, placeholder],
  );

  const handleConfirm = () => {
    onChange(toISODate(draftDate));
    close();
  };

  const androidApiLevel =
    Platform.OS === 'android' ? Number(Platform.Version) : 0;
  const pickerDisplay =
    Platform.OS === 'ios'
      ? 'spinner'
      : androidApiLevel >= 31
        ? 'inline'
        : 'calendar';

  return (
    <>
      <View>
        {label && <AppText style={styles.label}>{label}</AppText>}
        <Pressable style={styles.inputRow} onPress={open}>
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
          <Ionicons
            name="chevron-down"
            size={20}
            color={theme.icon.secondary}
          />
        </Pressable>
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={close}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={close} />
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            <DateTimePicker
              value={draftDate}
              mode="date"
              display={pickerDisplay}
              locale="es-PE"
              themeVariant="dark"
              accentColor={theme.brand.primary}
              textColor={theme.text.primary}
              minimumDate={minDate}
              maximumDate={maxDate}
              onChange={(_, date) => {
                if (date) setDraftDate(date);
              }}
              style={styles.picker}
            />

            <View style={styles.actions}>
              <Button
                label="Cancelar"
                type="tertiary"
                onPress={close}
                animated={false}
                style={styles.action}
                buttonStyle={styles.actionButton}
              />
              <Button
                label="Confirmar"
                type="primary"
                onPress={handleConfirm}
                animated={false}
                style={styles.action}
                buttonStyle={styles.actionButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(5, 6, 8, 0.75)',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      backgroundColor: theme.background.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 8,
      paddingHorizontal: 16,
    },
    picker: {
      alignSelf: 'center',
      width: '100%',
    },
    actions: {
      flexDirection: 'row',
      columnGap: 10,
      marginTop: 8,
    },
    action: {
      flex: 1,
    },
    actionButton: {
      width: '100%',
    },
  });
};
