import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { DatePicker } from '@/components/DatePicker';
import { Dropdown } from '@/components/Dropdown';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { showInfoToast } from '@/components/Toast';
import { useTheme } from '@/contexts/ThemeContext';
import { useCreateClientResourceWithFile } from '@/lib/api/mutations/use-create-client-resource-with-file';
import {
  type TrainerClientItem,
  useTrainerGetClientsList,
} from '@/lib/api/queries/use-trainer-get-clients-list';
import { FullTheme } from '@/types/theme';
import { fromISODate, today } from '@/utils/dates';

type Step = 1 | 2;

const DIET_TEMPLATE_URL =
  'https://appfitech.com/v1/app/templates/plantilla_dieta.xlsx';

const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export default function NewTrainerDietScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);

  const [step, setStep] = useState<Step>(1);
  const [clientId, setClientId] = useState<string | number | null>(null);
  const [dietName, setDietName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickedFile, setPickedFile] = useState<{
    uri: string;
    name: string;
  } | null>(null);

  const { mutate: createDiet, isPending } = useCreateClientResourceWithFile();

  const { data: clientsData } = useTrainerGetClientsList({
    page: 0,
    size: 100,
    sortBy: 'clientName',
    sortDir: 'asc',
  });

  const clients = useMemo<TrainerClientItem[]>(
    () => clientsData?.content ?? [],
    [clientsData?.content],
  );
  const clientOptions = useMemo(
    () =>
      clients.map((c) => ({
        label: c.clientName ?? `Cliente ${c.clientId}`,
        value: String(c.clientId),
      })),
    [clients],
  );

  const selectedClient = clients.find(
    (c) => String(c.clientId) === String(clientId),
  );

  const canGoStep2 = clientId != null && clientId !== '';
  const goStep2 = () => {
    if (canGoStep2) setStep(2);
  };

  const handleDownloadPlantilla = async () => {
    try {
      await WebBrowser.openBrowserAsync(DIET_TEMPLATE_URL);
    } catch (e) {
      console.error('[FITECH] error opening diet template', e);
    }
  };

  const handlePickXlsx = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: XLSX_MIME,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setPickedFile({ uri: file.uri, name: file.name ?? 'plantilla.xlsx' });
    } catch (e) {
      console.error('[FITECH] document picker error', e);
    }
  };

  /** Normalize to YYYY-MM-DD for API. */
  const toApiDate = (input: string): string => {
    const s = input.trim();
    if (!s) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const ddmmyy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (ddmmyy) {
      const [, d, m, y] = ddmmyy;
      return `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`;
    }
    return s;
  };

  const canCreate =
    Boolean(dietName.trim()) &&
    Boolean(startDate.trim()) &&
    Boolean(endDate.trim()) &&
    Boolean(pickedFile) &&
    Boolean(clientId);

  const handleCreate = () => {
    if (!canCreate || !pickedFile || !clientId) return;
    const formData = new FormData();
    formData.append('file', {
      uri: pickedFile.uri,
      name: pickedFile.name,
      type: XLSX_MIME,
    } as any);
    formData.append('resourceName', dietName.trim());
    formData.append('resourceType', 'DIETA');
    formData.append('clientId', String(clientId));
    formData.append('startDate', toApiDate(startDate));
    formData.append('endDate', toApiDate(endDate));

    createDiet(formData, {
      onSuccess: () => {
        showInfoToast('Dieta creada', 'La dieta se creó correctamente.');
        router.back();
      },
      onError: () => {
        showInfoToast('Error', 'No se pudo crear la dieta. Intenta de nuevo.');
      },
    });
  };

  return (
    <PageContainer
      title="Crear Nueva Dieta"
      style={styles.pageStyle}
      contentPaddingBottom={120}
      hasBackButton
    >
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
          <AppText style={[styles.stepNum, step >= 1 && styles.stepNumActive]}>
            1
          </AppText>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
          <AppText style={[styles.stepNum, step >= 2 && styles.stepNumActive]}>
            2
          </AppText>
        </View>
      </View>
      <View style={styles.stepLabels}>
        <AppText
          style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}
        >
          Cliente
        </AppText>
        <AppText
          style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}
        >
          Detalles
        </AppText>
      </View>

      {step === 1 && (
        <View style={styles.stepContent}>
          <AppText style={styles.fieldLabel}>
            Selecciona el cliente para la dieta
          </AppText>
          <View style={styles.dropdownWrap}>
            <Dropdown
              options={clientOptions}
              value={clientId}
              onChange={(v) => setClientId(v)}
              placeholder="Buscar Cliente*"
              zIndex={1000}
              search
            />
          </View>
          <TouchableOpacity
            style={[styles.nextBtn, !canGoStep2 && styles.nextBtnDisabled]}
            onPress={goStep2}
            disabled={!canGoStep2}
            activeOpacity={0.8}
          >
            <AppText style={styles.nextBtnText}>Siguiente</AppText>
            <Ionicons name="arrow-forward" size={18} color={theme.background} />
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && selectedClient && (
        <ScrollView
          style={styles.stepContent}
          contentContainerStyle={styles.stepContentInner}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => setStep(1)}
            style={styles.backToStep1}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={20} color={theme.primary} />
            <AppText style={styles.backToStep1Text}>
              Atrás (cambiar cliente)
            </AppText>
          </TouchableOpacity>
          <AppText style={styles.fieldLabel}>Nombre de la Dieta*</AppText>
          <View style={styles.inputRow}>
            <Ionicons
              name="restaurant-outline"
              size={20}
              color={theme.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Ej: Dieta para ganar masa muscular"
              value={dietName}
              onChangeText={setDietName}
              style={styles.input}
            />
          </View>

          <AppText style={styles.fieldLabel}>Fecha de Inicio*</AppText>
          <DatePicker
            value={startDate || null}
            onChange={(v) => setStartDate(v ?? '')}
            placeholder="Seleccionar fecha"
            minDate={today()}
            maxDate={endDate ? fromISODate(endDate) : undefined}
          />

          <AppText style={styles.fieldLabel}>Fecha de Fin*</AppText>
          <DatePicker
            value={endDate || null}
            onChange={(v) => setEndDate(v ?? '')}
            placeholder="Seleccionar fecha"
            minDate={startDate ? fromISODate(startDate) : undefined}
          />

          <View style={styles.plantillaSection}>
            <AppText style={styles.plantillaTitle}>Plantilla de Dieta</AppText>
            <AppText style={styles.plantillaHint}>
              Descarga la plantilla, complétala y súbela para crear la dieta.
            </AppText>

            <AppText style={styles.plantillaStepTitle}>
              Paso 1: Descarga la plantilla
            </AppText>
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={handleDownloadPlantilla}
              activeOpacity={0.8}
            >
              <Ionicons
                name="download-outline"
                size={20}
                color={theme.background}
                style={styles.downloadBtnIcon}
              />
              <AppText style={styles.downloadBtnText}>
                Descargar Plantilla Excel
              </AppText>
            </TouchableOpacity>
            <AppText style={styles.downloadHint}>
              Descarga la plantilla, llénala con el plan alimentario del cliente
            </AppText>

            <AppText style={[styles.plantillaStepTitle, { marginTop: 16 }]}>
              Paso 2: Sube la plantilla completada
            </AppText>
            <AppText style={styles.uploadHint}>Solo archivos .xlsx</AppText>
            <TouchableOpacity
              style={styles.uploadArea}
              activeOpacity={0.8}
              onPress={handlePickXlsx}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={32}
                color={theme.textSecondary}
              />
              <AppText style={styles.uploadText}>
                {pickedFile?.name ??
                  'Toca para seleccionar archivo Excel (.xlsx)'}
              </AppText>
            </TouchableOpacity>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => router.back()}
                activeOpacity={0.8}
                disabled={isPending}
              >
                <AppText style={styles.cancelBtnText}>Cancelar</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createSubmitBtn,
                  !canCreate && styles.createSubmitBtnDisabled,
                ]}
                onPress={handleCreate}
                activeOpacity={0.8}
                disabled={!canCreate || isPending}
              >
                <AppText style={styles.createSubmitBtnText}>
                  {isPending ? 'Creando…' : 'Crear dieta'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {},
    stepIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      marginBottom: 4,
    },
    stepDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.backgroundInput,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepDotActive: {
      backgroundColor: theme.primary,
    },
    stepNum: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.textSecondary,
    },
    stepNumActive: {
      color: theme.background,
    },
    stepLine: {
      width: 40,
      height: 2,
      backgroundColor: theme.border,
      marginHorizontal: 4,
    },
    stepLabels: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 80,
      marginBottom: 24,
    },
    stepLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    stepLabelActive: {
      color: theme.primary,
    },
    stepContent: {
      flex: 1,
    },
    stepContentInner: {
      paddingBottom: 40,
      gap: 12,
    },
    backToStep1: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
    },
    backToStep1Text: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 6,
    },
    dropdownWrap: {
      marginBottom: 16,
      zIndex: 1000,
    },
    nextBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: theme.primary,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginTop: 8,
    },
    nextBtnDisabled: {
      opacity: 0.5,
    },
    nextBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.background,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 12,
      minHeight: 48,
      marginBottom: 12,
    },
    inputIcon: { marginRight: 10 },
    inputIconRight: { marginLeft: 10 },
    input: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 15,
      color: theme.textPrimary,
    },
    plantillaSection: {
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    plantillaTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.textPrimary,
      marginBottom: 6,
    },
    plantillaHint: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    plantillaStepTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    downloadBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.orange,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    downloadBtnIcon: { marginRight: 8 },
    downloadBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.background,
    },
    downloadHint: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 8,
    },
    uploadHint: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 6,
    },
    uploadArea: {
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.border,
      borderRadius: 12,
      paddingVertical: 24,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundInput,
      marginTop: 4,
    },
    uploadText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    actionsRow: {
      flexDirection: 'column',
      gap: 12,
      marginTop: 28,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    cancelBtn: {
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.backgroundInput,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    createSubmitBtn: {
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    createSubmitBtnDisabled: {
      opacity: 0.5,
    },
    createSubmitBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.background,
    },
  });
