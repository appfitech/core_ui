import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ChipToggle } from '@/components/atoms/ChipToggle';
import { SwitchRow } from '@/components/atoms/SwitchRow';
import { Card } from '@/components/Card';
import { FooterActions } from '@/components/FooterActions';
import { ChipsList } from '@/components/molecules/ChipsList';
import { MultiLocationPicker } from '@/components/MultiLocationPicker';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { MATCH_WORKOUT_SCHEDULES } from '@/constants/match';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUpdateMatchPreferences } from '@/lib/api/mutations/use-update-match-preferences';
import { useGetUserMatchPreferences } from '@/lib/api/queries/use-get-user-match-preferences';
import {
  CreateMatchPreferencesRequest,
  LocationDto,
  MatchPreferencesDto,
} from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

type Gender = 'MALE' | 'FEMALE' | 'BOTH';
type TimePref = 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'WEEKEND';
type Intensity = 'ANY' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
type CrushLookingFor = 'CASUAL' | 'SERIOUS' | 'BOTH';

const MIN_AGE = 18;
const MAX_AGE = 65;

const DEFAULT_GYM_BRO = {
  gymBroLookingForGender: 'BOTH' as Gender,
  gymBroAgeRangeMin: MIN_AGE,
  gymBroAgeRangeMax: MAX_AGE,
  gymBroWorkoutTimes: [] as TimePref[],
};

const DEFAULT_GYM_CRUSH = {
  gymCrushLookingForGender: 'MALE' as Gender,
  gymCrushAgeRangeMin: MIN_AGE,
  gymCrushAgeRangeMax: MAX_AGE,
  gymCrushLookingFor: 'BOTH' as CrushLookingFor,
};

const GENDER_OPTIONS = [
  { label: 'Hombres', value: 'MALE' },
  { label: 'Mujeres', value: 'FEMALE' },
  { label: 'Ambos', value: 'BOTH' },
] as const;

const INTENSITY_OPTIONS = [
  { label: 'Cualquiera', value: 'ANY' },
  { label: 'Principiante', value: 'BEGINNER' },
  { label: 'Intermedio', value: 'INTERMEDIATE' },
  { label: 'Avanzado', value: 'ADVANCED' },
] as const;

const CONNECTION_OPTIONS = [
  { label: 'Casual', value: 'CASUAL' },
  { label: 'Serio', value: 'SERIOUS' },
  { label: 'Ambos', value: 'BOTH' },
] as const;

export default function MatchPreferencesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showAlert } = useAlert();
  const styles = getStyles(theme);

  const {
    data: matchPreferencesData,
    isLoading,
    refetch,
  } = useGetUserMatchPreferences();
  const { mutate: updatePreferences } = useUpdateMatchPreferences();

  const [matchPreferences, setMatchPreferences] =
    useState<MatchPreferencesDto | null>(null);

  useEffect(() => {
    if (!isLoading && matchPreferencesData) {
      setMatchPreferences({
        ...matchPreferencesData,
        gymBroWorkoutTimes: matchPreferencesData.gymBroWorkoutTimes || [],
        gymBroLocations: matchPreferencesData.gymBroLocations || [],
        gymCrushLocations: matchPreferencesData.gymCrushLocations || [],
      });
    }
  }, [matchPreferencesData, isLoading]);

  const anyEnabled =
    !!matchPreferences?.showInGymBro || !!matchPreferences?.showInGymCrush;

  const onToggleGymBro = (val: boolean) => {
    setMatchPreferences((prev) => ({
      ...(prev || {}),
      showInGymBro: val,
      ...(!val ? DEFAULT_GYM_BRO : {}),
      ...(val ? {} : { gymBroLocations: [] as LocationDto[] }),
    }));
  };

  const onToggleGymCrush = (val: boolean) => {
    setMatchPreferences((prev) => ({
      ...(prev || {}),
      showInGymCrush: val,
      ...(!val ? DEFAULT_GYM_CRUSH : {}),
      ...(val ? {} : { gymCrushLocations: [] as LocationDto[] }),
    }));
  };

  const handleSave = async () => {
    try {
      if (
        matchPreferences?.showInGymBro &&
        (matchPreferences?.gymBroAgeRangeMin ?? MIN_AGE) >
          (matchPreferences?.gymBroAgeRangeMax ?? MAX_AGE)
      ) {
        showAlert({
          title: 'Revisa GymBro',
          message: 'El rango de edad es inválido.',
        });
        return;
      }
      if (
        matchPreferences?.showInGymCrush &&
        (matchPreferences?.gymCrushAgeRangeMin ?? MIN_AGE) >
          (matchPreferences?.gymCrushAgeRangeMax ?? MAX_AGE)
      ) {
        showAlert({
          title: 'Revisa GymCrush',
          message: 'El rango de edad es inválido.',
        });
        return;
      }

      const payload: CreateMatchPreferencesRequest = {
        showInGymBro: !!matchPreferences?.showInGymBro,
        showInGymCrush: !!matchPreferences?.showInGymCrush,
        gymBroLookingForGender: matchPreferences?.gymBroLookingForGender,
        gymBroAgeRangeMin: matchPreferences?.gymBroAgeRangeMin,
        gymBroAgeRangeMax: matchPreferences?.gymBroAgeRangeMax,
        gymBroIntensity: matchPreferences?.gymBroIntensity,
        gymBroWorkoutTimes: matchPreferences?.gymBroWorkoutTimes || [],
        gymBroLocationIds: (matchPreferences?.gymBroLocations || [])
          .map((l) => l?.id)
          .filter((x): x is number => typeof x === 'number'),
        gymCrushLookingForGender: matchPreferences?.gymCrushLookingForGender,
        gymCrushAgeRangeMin: matchPreferences?.gymCrushAgeRangeMin,
        gymCrushAgeRangeMax: matchPreferences?.gymCrushAgeRangeMax,
        gymCrushLookingFor: matchPreferences?.gymCrushLookingFor,
        gymCrushLocationIds: (matchPreferences?.gymCrushLocations || [])
          .map((l) => l?.id)
          .filter((x): x is number => typeof x === 'number'),
        showAge: !!matchPreferences?.showAge,
        showLocation: !!matchPreferences?.showLocation,
        showRealName: !!matchPreferences?.showRealName,
        gymBroShowBioInProfile: matchPreferences?.gymBroShowBioInProfile,
        gymCrushShowBioInProfile: matchPreferences?.gymCrushShowBioInProfile,
      };

      updatePreferences(payload, {
        onSuccess: () => {
          refetch();
          showAlert({
            title: '¡Listo!',
            message: 'Preferencias guardadas correctamente.',
          });
        },
      });
    } catch (err: unknown) {
      showAlert({
        title: 'No se pudo guardar',
        message: err instanceof Error ? err.message : 'Error desconocido',
      });
    }
  };

  const handleReset = () => {
    setMatchPreferences((prev) => ({
      ...(prev || {}),
      showInGymBro: false,
      showInGymCrush: false,
      showAge: false,
      ...DEFAULT_GYM_BRO,
      ...DEFAULT_GYM_CRUSH,
      gymBroLocations: [],
      gymCrushLocations: [],
    }));
  };

  const ageInput = (
    value: number | undefined,
    onChange: (n: number) => void,
    placeholder: string,
  ) => (
    <View style={styles.ageField}>
      <TextInput
        keyboardType="number-pad"
        value={value != null ? String(value) : ''}
        onChangeText={(t) => {
          const n = parseInt(t, 10);
          if (!Number.isNaN(n)) onChange(n);
        }}
        placeholder={placeholder}
      />
    </View>
  );

  return (
    <PageContainer
      title="Preferencias de Match"
      subheader="Configura cómo quieres aparecer en nuestros sistemas de conexión"
      style={styles.page}
      includeTabBarPadding={false}
      footer={
        <FooterActions
          primaryLabel="Guardar"
          onPrimary={handleSave}
          onCancel={() => router.back()}
        />
      }
    >
      <Card style={styles.card}>
        <SwitchRow
          label="GymBro"
          value={!!matchPreferences?.showInGymBro}
          onChange={onToggleGymBro}
          labelStyle={styles.cardTitle}
        />
        <AppText style={styles.cardHint}>
          Encuentra compañeros de entrenamiento que compartan tus objetivos y
          horarios.
        </AppText>

        {!!matchPreferences?.showInGymBro && (
          <View style={styles.section}>
            <SectionLabel label="Horarios de entrenamiento" styles={styles} />
            <ChipsList
              options={[...MATCH_WORKOUT_SCHEDULES]}
              selectedValues={matchPreferences?.gymBroWorkoutTimes || []}
              onChange={(times) =>
                setMatchPreferences((prev) => ({
                  ...(prev || {}),
                  gymBroWorkoutTimes: times as TimePref[],
                }))
              }
            />

            <SectionLabel label="Nivel de intensidad" styles={styles} />
            <ChipRow>
              {INTENSITY_OPTIONS.map((opt) => (
                <ChipToggle
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selected={matchPreferences?.gymBroIntensity === opt.value}
                  onPress={(val) =>
                    setMatchPreferences((prev) => ({
                      ...(prev || {}),
                      gymBroIntensity: val as Intensity,
                    }))
                  }
                />
              ))}
            </ChipRow>

            <SectionLabel label="Ubicaciones de interés" styles={styles} />
            <MultiLocationPicker
              selected={
                (matchPreferences?.gymBroLocations || []) as LocationDto[]
              }
              onChange={(locations) =>
                setMatchPreferences((prev) => ({
                  ...(prev || {}),
                  gymBroLocations: locations,
                }))
              }
            />

            <SectionLabel label="Preferencias generales" styles={styles} />
            <FieldLabel label="Buscando" styles={styles} />
            <ChipRow>
              {GENDER_OPTIONS.map((opt) => (
                <ChipToggle
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selected={
                    matchPreferences?.gymBroLookingForGender === opt.value
                  }
                  onPress={(val) =>
                    setMatchPreferences((prev) => ({
                      ...(prev || {}),
                      gymBroLookingForGender: val as Gender,
                    }))
                  }
                />
              ))}
            </ChipRow>

            <FieldLabel label="Rango de edad" styles={styles} />
            <View style={styles.ageRow}>
              {ageInput(
                matchPreferences?.gymBroAgeRangeMin,
                (n) =>
                  setMatchPreferences((g) => ({
                    ...(g || {}),
                    gymBroAgeRangeMin: n,
                  })),
                'Desde',
              )}
              <AppText style={styles.ageDash}>—</AppText>
              {ageInput(
                matchPreferences?.gymBroAgeRangeMax,
                (n) =>
                  setMatchPreferences((g) => ({
                    ...(g || {}),
                    gymBroAgeRangeMax: n,
                  })),
                'Hasta',
              )}
            </View>

            <SwitchRow
              label="Mostrar bio"
              value={!!matchPreferences?.gymBroShowBioInProfile}
              onChange={(v) =>
                setMatchPreferences((prev) => ({
                  ...(prev || {}),
                  gymBroShowBioInProfile: v,
                }))
              }
            />
          </View>
        )}
      </Card>

      <Card style={styles.card}>
        <SwitchRow
          label="GymCrush"
          value={!!matchPreferences?.showInGymCrush}
          onChange={onToggleGymCrush}
          labelStyle={styles.cardTitle}
        />
        <AppText style={styles.cardHint}>
          Conecta con personas que te interesen para algo más que entrenar.
        </AppText>

        {!!matchPreferences?.showInGymCrush && (
          <View style={styles.section}>
            <SectionLabel label="Tipo de conexión" styles={styles} />
            <ChipRow>
              {CONNECTION_OPTIONS.map((opt) => (
                <ChipToggle
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selected={matchPreferences?.gymCrushLookingFor === opt.value}
                  onPress={(val) =>
                    setMatchPreferences((g) => ({
                      ...(g || {}),
                      gymCrushLookingFor: val as CrushLookingFor,
                    }))
                  }
                />
              ))}
            </ChipRow>

            <SectionLabel label="Ubicaciones de interés" styles={styles} />
            <MultiLocationPicker
              selected={
                (matchPreferences?.gymCrushLocations || []) as LocationDto[]
              }
              onChange={(locations) =>
                setMatchPreferences((g) => ({
                  ...(g || {}),
                  gymCrushLocations: locations,
                }))
              }
            />

            <SectionLabel label="Preferencias generales" styles={styles} />
            <FieldLabel label="Buscando" styles={styles} />
            <ChipRow>
              {GENDER_OPTIONS.map((opt) => (
                <ChipToggle
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selected={
                    matchPreferences?.gymCrushLookingForGender === opt.value
                  }
                  onPress={(val) =>
                    setMatchPreferences((g) => ({
                      ...(g || {}),
                      gymCrushLookingForGender: val as Gender,
                    }))
                  }
                />
              ))}
            </ChipRow>

            <FieldLabel label="Rango de edad" styles={styles} />
            <View style={styles.ageRow}>
              {ageInput(
                matchPreferences?.gymCrushAgeRangeMin,
                (n) =>
                  setMatchPreferences((g) => ({
                    ...(g || {}),
                    gymCrushAgeRangeMin: n,
                  })),
                'Desde',
              )}
              <AppText style={styles.ageDash}>—</AppText>
              {ageInput(
                matchPreferences?.gymCrushAgeRangeMax,
                (n) =>
                  setMatchPreferences((g) => ({
                    ...(g || {}),
                    gymCrushAgeRangeMax: n,
                  })),
                'Hasta',
              )}
            </View>

            <SwitchRow
              label="Mostrar bio"
              value={!!matchPreferences?.gymCrushShowBioInProfile}
              onChange={(v) =>
                setMatchPreferences((prev) => ({
                  ...(prev || {}),
                  gymCrushShowBioInProfile: v,
                }))
              }
            />
          </View>
        )}
      </Card>

      {anyEnabled && (
        <Card style={styles.card}>
          <AppText style={styles.cardTitle}>Privacidad</AppText>
          <AppText style={styles.cardHint}>
            Controla qué información pueden ver otros usuarios.
          </AppText>
          <SwitchRow
            label="Mostrar edad (otros verán tu edad exacta)"
            value={!!matchPreferences?.showAge}
            onChange={(v) =>
              setMatchPreferences((prev) => ({ ...(prev || {}), showAge: v }))
            }
          />
        </Card>
      )}

      <Pressable onPress={handleReset}>
        <AppText style={styles.resetLink}>Restablecer valores</AppText>
      </Pressable>
    </PageContainer>
  );
}

function SectionLabel({
  label,
  styles,
}: {
  label: string;
  styles: ReturnType<typeof getStyles>;
}) {
  return <AppText style={styles.sectionLabel}>{label}</AppText>;
}

function FieldLabel({
  label,
  styles,
}: {
  label: string;
  styles: ReturnType<typeof getStyles>;
}) {
  return <AppText style={styles.fieldLabel}>{label}</AppText>;
}

function ChipRow({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return <View style={styles.chipRow}>{children}</View>;
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    page: {
      rowGap: 12,
      paddingBottom: 16,
    },
    card: {
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderRadius: 12,
      padding: 14,
      rowGap: 10,
    },
    cardTitle: {
      ...text.smallSemibold,
      color: theme.text.primary,
    },
    cardHint: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 18,
    },
    section: {
      rowGap: 10,
      marginTop: 4,
    },
    sectionLabel: {
      ...text.label,
      color: theme.text.tertiary,
      marginTop: 4,
      marginBottom: 4,
    },
    fieldLabel: {
      ...text.label,
      marginTop: 2,
      marginBottom: 0,
      color: theme.text.tertiary,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    ageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
      width: '100%',
    },
    ageField: {
      flex: 1,
      minWidth: 0,
    },
    ageDash: {
      ...text.small,
      color: theme.text.tertiary,
      flexShrink: 0,
    },
    resetLink: {
      ...text.smallSemibold,
      color: theme.text.tertiary,
      textAlign: 'center',
      paddingVertical: 8,
    },
  });
};
