import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { TrainerService } from '@/types/trainer';

import { useCreateContract } from '../../api/mutations/use-create-contract';
import { AppText } from '../../components/AppText';
import { Button } from '../../components/Button';
import PageContainer from '../../components/PageContainer';

const TERMS_SECTIONS: { title: string; body: string }[] = [
  {
    title: '1. Contratación del Servicio',
    body: 'Al contratar este servicio, acepta que el servicio será prestado por el entrenador seleccionado según la modalidad elegida. El precio total incluye todas las sesiones especificadas en el paquete. El pago se procesa al aceptar estos términos.',
  },
  {
    title: '2. Proceso de Pago y Contratación',
    body: 'Al hacer clic en "Contratar", se procesa el pago. Una vez completado, el contrato se activa y el entrenador recibe una notificación. El servicio queda disponible para ser programado.',
  },
  {
    title: '3. Responsabilidades del Cliente',
    body: 'Asistir puntualmente a las sesiones, informar sobre condiciones médicas relevantes, seguir las instrucciones del entrenador y comunicar inconvenientes con 24 h de anticipación.',
  },
  {
    title: '4. Responsabilidades del Entrenador',
    body: 'Brindar un servicio profesional, respetar horarios, mantener confidencialidad y proporcionar orientación personalizada.',
  },
  {
    title: '5. Cancelaciones y Reembolsos',
    body: 'Las cancelaciones deben notificarse con 24 h de anticipación. Los reembolsos se procesarán según la política de la plataforma.',
  },
  {
    title: '6. Privacidad y Datos',
    body: 'Sus datos se tratan conforme a nuestra política de privacidad. La información compartida durante las sesiones es confidencial.',
  },
];

export default function TrainerContractScreen() {
  const { service: serviceParam } = useLocalSearchParams<{
    id?: string;
    service: string;
  }>();
  const router = useRouter();
  const clientId = useUserStore((s) => s?.user?.user?.id);
  const { theme } = useTheme();
  const { showAlert } = useAlert();

  const service = useMemo(
    () => (serviceParam ? (JSON.parse(serviceParam) as TrainerService) : null),
    [serviceParam],
  );

  const [accepted, setAccepted] = useState(false);
  const { mutateAsync: createContract, isPending } = useCreateContract();

  const styles = getStyles(theme);

  const handleConfirm = async () => {
    if (!service || !clientId) return;

    try {
      await createContract({
        serviceId: service.id,
        clientId,
        termsAccepted: true,
        notes: `Contrato desde perfil del trainer ${service.trainerId}`,
      });
      showAlert({
        title: '¡Listo!',
        message: 'Su contrato ha sido generado satisfactoriamente',
      });
      router.replace('/home');
    } catch {
      showAlert({
        title: 'Error',
        message: 'No se pudo crear el contrato. Intente de nuevo.',
      });
    }
  };

  if (!service) {
    return (
      <PageContainer title="Contratar servicio" style={styles.pageStyle}>
        <AppText style={styles.errorText}>Servicio no disponible</AppText>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Contratar servicio"
      subheader={service.name}
      style={styles.pageStyle}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Resumen del servicio</AppText>
          <View style={styles.row}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={theme.textSecondary}
              style={styles.rowIcon}
            />
            <AppText style={styles.rowValue}>{service.name}</AppText>
          </View>
          <View style={styles.row}>
            <Ionicons
              name="cash-outline"
              size={18}
              color={theme.textSecondary}
              style={styles.rowIcon}
            />
            <AppText style={styles.rowValue}>
              S/ {service.totalPrice.toFixed(2)}
            </AppText>
          </View>
          <View style={styles.row}>
            <Ionicons
              name={service.isInPerson ? 'walk-outline' : 'videocam-outline'}
              size={18}
              color={theme.textSecondary}
              style={styles.rowIcon}
            />
            <AppText style={styles.rowValue}>
              {service.isInPerson ? 'Presencial' : 'Virtual'}
            </AppText>
          </View>
        </View>

        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Términos y condiciones</AppText>
          {TERMS_SECTIONS.map((section, index) => (
            <View
              key={index}
              style={[
                styles.termsSection,
                index > 0 && styles.termsSectionNotFirst,
              ]}
            >
              <AppText style={styles.termsSectionTitle}>
                {section.title}
              </AppText>
              <AppText style={styles.termsText}>{section.body}</AppText>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAccepted((a) => !a)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted && (
              <Ionicons name="checkmark" size={14} color={theme.background} />
            )}
          </View>
          <AppText style={styles.checkboxLabel}>
            He leído y acepto los términos y condiciones del servicio
          </AppText>
        </TouchableOpacity>

        <View style={styles.actions}>
          <Button
            label="Cancelar"
            onPress={() => router.back()}
            type="tertiary"
            style={styles.actionButton}
          />
          <Button
            label="Contratar"
            onPress={handleConfirm}
            disabled={!accepted || isPending}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {},
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 180 },
    errorText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 24,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20,
      marginTop: 16,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 14,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    rowIcon: {
      marginRight: 12,
    },
    rowValue: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    termsSection: {
      marginBottom: 0,
    },
    termsSectionNotFirst: {
      marginTop: 14,
    },
    termsSectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 6,
    },
    termsText: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 8,
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
    checkboxLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    actions: {
      marginTop: 24,
      rowGap: 12,
    },
    actionButton: {},
  });
