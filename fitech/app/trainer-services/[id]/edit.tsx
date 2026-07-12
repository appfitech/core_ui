import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { SwitchRow } from '@/components/atoms/SwitchRow';
import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { showInfoToast } from '@/components/Toast';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUpdateTrainerService } from '@/lib/api/mutations/use-trainer-service-mutations';
import { useTrainerGetServiceTypes } from '@/lib/api/queries/use-trainer-get-services';
import { useUserStore } from '@/stores/user';
import { ServiceTypeDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

type TrainerService = {
  id: number;
  trainerId: number;
  name: string;
  description?: string;
  totalPrice: number;
  isInPerson: boolean;
  serviceTypeId?: number;
};

function normalizeName(value: string | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

export default function EditTrainerServiceScreen() {
  const { service: serviceParam } = useLocalSearchParams<{ service?: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const { showAlert } = useAlert();
  const styles = getStyles(theme);
  const trainerId = useUserStore((s) => s?.user?.user?.id);

  const service = useMemo<TrainerService | null>(() => {
    if (!serviceParam) return null;
    try {
      return JSON.parse(serviceParam) as TrainerService;
    } catch {
      return null;
    }
  }, [serviceParam]);

  const [description, setDescription] = useState(service?.description ?? '');
  const [totalPrice, setTotalPrice] = useState(
    service?.totalPrice != null ? String(service.totalPrice) : '',
  );
  const [isInPerson, setIsInPerson] = useState(service?.isInPerson ?? true);

  const { data: serviceTypes } = useTrainerGetServiceTypes();
  const { mutate: updateService, isPending } = useUpdateTrainerService();

  const serviceTypeId = useMemo(() => {
    if (service?.serviceTypeId != null) return service.serviceTypeId;
    const types = (serviceTypes as ServiceTypeDto[]) ?? [];
    return types.find(
      (t) => normalizeName(t.name) === normalizeName(service?.name),
    )?.id;
  }, [service?.name, service?.serviceTypeId, serviceTypes]);

  const parsedPrice = Number(totalPrice.replace(',', '.'));

  const canSave =
    service != null &&
    trainerId != null &&
    serviceTypeId != null &&
    Number.isFinite(parsedPrice) &&
    parsedPrice > 0;

  const handleDescriptionChange = useCallback((value: string) => {
    setDescription(value);
  }, []);

  const handleTotalPriceChange = useCallback((value: string) => {
    setTotalPrice(value);
  }, []);

  const handleIsInPersonChange = useCallback((value: boolean) => {
    setIsInPerson(value);
  }, []);

  const handleSave = useCallback(() => {
    if (!canSave || service == null || trainerId == null || serviceTypeId == null) {
      return;
    }

    updateService(
      {
        serviceId: service.id,
        trainerId,
        serviceTypeId,
        description: description.trim() || undefined,
        totalPrice: parsedPrice,
        isInPerson,
        country: 'PE',
      },
      {
        onSuccess: () => {
          showInfoToast('Servicio actualizado', 'Los cambios se guardaron.');
          router.back();
        },
        onError: () => {
          showAlert({
            title: 'Error',
            message: 'No se pudo actualizar el servicio. Intenta de nuevo.',
            buttons: [{ text: 'Entendido' }],
          });
        },
      },
    );
  }, [
    canSave,
    description,
    isInPerson,
    parsedPrice,
    router,
    service,
    serviceTypeId,
    showAlert,
    trainerId,
    updateService,
  ]);

  if (!service) {
    return (
      <PageContainer title="Editar servicio" hasBackButton>
        <AppText style={styles.errorText}>
          No se pudo cargar el servicio. Vuelve e inténtalo de nuevo.
        </AppText>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Editar servicio" hasBackButton>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.typeField}>
          <AppText style={styles.typeLabel}>Tipo de servicio</AppText>
          <AppText style={styles.typeValue}>{service.name}</AppText>
        </View>

        <TextInput
          label="Descripción"
          placeholder="Describe qué incluye tu servicio"
          value={description}
          onChangeText={handleDescriptionChange}
          multiline
          numberOfLines={4}
          required={false}
        />

        <TextInput
          label="Precio total"
          placeholder="0.00"
          value={totalPrice}
          onChangeText={handleTotalPriceChange}
          keyboardType="decimal-pad"
        />

        <SwitchRow
          label="Servicio presencial"
          value={isInPerson}
          onChange={handleIsInPersonChange}
        />

        <Button
          label="Guardar cambios"
          onPress={handleSave}
          disabled={!canSave}
          loading={isPending}
          loadingLabel="Guardando..."
          style={styles.submitBtn}
        />
      </ScrollView>
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    content: {
      paddingBottom: 32,
      gap: 16,
    },
    typeField: {
      gap: 6,
    },
    typeLabel: {
      ...text.captionSemibold,
      color: theme.text.secondary,
    },
    typeValue: {
      ...text.bodySemibold,
      color: theme.text.primary,
    },
    submitBtn: {
      marginTop: 8,
    },
    errorText: {
      ...text.body,
      color: theme.text.secondary,
    },
  });
};
