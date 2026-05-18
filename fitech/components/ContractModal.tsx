import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { TrainerService } from '@/types/trainer';

import { AppText } from './AppText';
import { Button } from './Button';

export function ContractModal({
  visible,
  onClose,
  onConfirm,
  service,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  service: TrainerService;
}) {
  const [accepted, setAccepted] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <AppText style={styles.title}>
              Términos y Condiciones del Servicio
            </AppText>
            <View style={styles.summaryCard}>
              <AppText style={styles.summaryLabel}>Resumen</AppText>
              <AppText style={styles.summaryText}>
                Servicio: {service?.name}
              </AppText>
              <AppText style={styles.summaryText}>
                Precio: S/ {service?.totalPrice?.toFixed(2)}
              </AppText>
              <AppText style={styles.summaryText}>
                Modalidad: {service?.isInPerson ? 'Presencial' : 'Virtual'}
              </AppText>
            </View>
            <AppText style={styles.termsLabel}>Términos generales</AppText>
            <AppText style={styles.termsText}>
              Al contratar acepta los términos de la plataforma: el servicio lo
              presta el entrenador según la modalidad elegida, el pago se
              procesa al aceptar, y el contrato se activa al completarse el
              pago. Cancelaciones con 24 h de anticipación. Sus datos se tratan
              según nuestra política de privacidad.
            </AppText>
            <TouchableOpacity
              onPress={() => setAccepted(!accepted)}
              style={styles.checkboxRow}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, accepted && styles.checkboxChecked]}
              >
                {accepted && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={theme.background}
                  />
                )}
              </View>
              <AppText style={styles.checkboxText}>
                He leído y acepto los términos
              </AppText>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.buttonRow}>
            <Button
              label="Cancelar"
              onPress={onClose}
              type="tertiary"
              style={styles.cancelButton}
            />
            <Button
              label="Contratar"
              onPress={onConfirm}
              disabled={!accepted}
              style={styles.confirmButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modal: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '90%',
      paddingBottom: 32,
    },
    scroll: { maxHeight: 400 },
    scrollContent: { padding: 20, paddingBottom: 16 },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 16,
    },
    summaryCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
      marginBottom: 16,
    },
    summaryLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    summaryText: {
      fontSize: 14,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    termsLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    termsText: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      gap: 12,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    checkboxText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    buttonRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingTop: 16,
      gap: 12,
    },
    cancelButton: { flex: 1 },
    confirmButton: { flex: 1 },
  });
