import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { formStyles } from '@/constants/typography';
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

  return (
    <>
      <View>
        {label && <AppText style={styles.label}>{label}</AppText>}
        <Pressable style={styles.inputRow} onPress={open}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={theme.icon}
            style={styles.leadingIcon}
          />
          <AppText
            style={[styles.valueText, !value && styles.placeholderText]}
            numberOfLines={1}
          >
            {displayText}
          </AppText>
          <Ionicons name="chevron-down" size={20} color={theme.icon} />
        </Pressable>
      </View>

      {Platform.OS === 'ios' ? (
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
                display="spinner"
                locale="es-PE"
                themeVariant="dark"
                accentColor={theme.primary}
                textColor={theme.textPrimary}
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
      ) : (
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
          display="default"
          locale="es-PE"
          positiveButton={{
            label: 'Confirmar',
            textColor: theme.primary,
          }}
          negativeButton={{
            label: 'Cancelar',
            textColor: theme.textSecondary,
          }}
        />
      )}
    </>
  );
}

const getStyles = (theme: FullTheme) => {
  const form = formStyles(theme);

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
      fontSize: 15,
      fontFamily: 'Inter_400Regular',
      color: theme.textPrimary,
      lineHeight: 22,
    },
    placeholderText: {
      color: theme.dark700,
    },
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(5, 6, 8, 0.75)',
    },
    sheet: {
      backgroundColor: theme.card,
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
