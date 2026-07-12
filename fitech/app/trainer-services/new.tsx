import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { SwitchRow } from '@/components/atoms/SwitchRow';
import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { ListEmptyState } from '@/components/list/ListEmptyState';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { showInfoToast } from '@/components/Toast';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCreateTrainerService } from '@/lib/api/mutations/use-create-trainer-service';
import {
  useTrainerGetServices,
  useTrainerGetServiceTypes,
} from '@/lib/api/queries/use-trainer-get-services';
import { useUserStore } from '@/stores/user';
import { ServiceTypeDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

type TrainerServiceItem = {
  name?: string;
  serviceTypeId?: number;
};

function normalizeName(value: string | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

export default function NewTrainerServiceScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { showAlert } = useAlert();
  const styles = getStyles(theme);
  const trainerId = useUserStore((s) => s?.user?.user?.id);

  const [serviceTypeId, setServiceTypeId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [isInPerson, setIsInPerson] = useState(true);

  const { data: serviceTypes } = useTrainerGetServiceTypes();
  const { data: trainerServices } = useTrainerGetServices();
  const { mutate: createService, isPending } = useCreateTrainerService();

  const typeOptions = useMemo(() => {
    const allTypes = ((serviceTypes as ServiceTypeDto[]) ?? []).filter(
      (t) => t.isActive !== false && t.id != null,
    );
    const existing = (trainerServices as TrainerServiceItem[]) ?? [];

    const existingTypeIds = new Set(
      existing
        .map((s) => s.serviceTypeId)
        .filter((id): id is number => id != null),
    );
    const existingTypeNames = new Set(
      existing.map((s) => normalizeName(s.name)).filter(Boolean),
    );

    return allTypes
      .filter((t) => {
        if (t.id != null && existingTypeIds.has(t.id)) return false;
        if (existingTypeNames.has(normalizeName(t.name))) return false;
        return true;
      })
      .map((t) => ({
        label: t.name ?? `Tipo ${t.id}`,
        value: String(t.id),
      }));
  }, [serviceTypes, trainerServices]);

  const hasAvailableTypes = typeOptions.length > 0;

  const parsedPrice = Number(totalPrice.replace(',', '.'));

  const canCreate =
    hasAvailableTypes &&
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

  const handleCreate = useCallback(() => {
    if (!canCreate || trainerId == null || serviceTypeId == null) return;

    createService(
      {
        trainerId,
        serviceTypeId: Number(serviceTypeId),
        description: description.trim() || undefined,
        totalPrice: parsedPrice,
        isInPerson,
        country: 'PE',
      },
      {
        onSuccess: () => {
          showInfoToast(
            'Servicio creado',
            'Tu servicio se publicó correctamente.',
          );
          router.back();
        },
        onError: () => {
          showAlert({
            title: 'Error',
            message: 'No se pudo crear el servicio. Intenta de nuevo.',
            buttons: [{ text: 'Entendido' }],
          });
        },
      },
    );
  }, [
    canCreate,
    createService,
    description,
    isInPerson,
    parsedPrice,
    router,
    serviceTypeId,
    showAlert,
    trainerId,
  ]);

  return (
    <PageContainer title="Nuevo Servicio" hasBackButton>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText style={styles.intro}>
          Configura el tipo de servicio y precio para que tus clientes puedan
          contratarte.
        </AppText>

        {!hasAvailableTypes ? (
          <ListEmptyState
            title="No hay tipos de servicio disponibles"
            hint="Ya creaste todos los servicios que puedes ofrecer."
          />
        ) : (
          <>
            <Dropdown
              label="Tipo de servicio"
              options={typeOptions}
              value={serviceTypeId}
              onChange={setServiceTypeId}
              placeholder="Selecciona un tipo"
              search
            />

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
              label="Crear servicio"
              onPress={handleCreate}
              disabled={!canCreate}
              loading={isPending}
              loadingLabel="Creando..."
              style={styles.submitBtn}
            />
          </>
        )}
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
    intro: {
      ...text.small,
      color: theme.text.secondary,
      marginBottom: 4,
    },
    submitBtn: {
      marginTop: 8,
    },
  });
};
