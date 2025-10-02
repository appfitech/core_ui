import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  CreateMatchPreferencesRequest,
  LocationDto,
  MatchPreferencesDto,
} from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { useUpdateMatchPreferences } from '../api/mutations/use-update-match-preferences';
import { useGetUserMatchPreferences } from '../api/queries/use-get-user-match-preferences';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

/** =========================
 *  ENUMS / CONSTANTS (BE)
 *  ========================= */
type Gender = 'MALE' | 'FEMALE' | 'BOTH';
type TimePref = 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'WEEKEND';
type Intensity = 'ANY' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
type CrushLookingFor = 'CASUAL' | 'SERIOUS' | 'BOTH';

const MIN_AGE = 18;
const MAX_AGE = 65;

/** Placeholder list; replace with your real source later */
const ALL_LOCATIONS: LocationDto[] = [
  { id: 75, fullName: 'Cusco - Cusco - San Blas' },
  { id: 70, fullName: 'Cusco - Urubamba - Machupicchu' },
  { id: 51, fullName: 'Lima - Magdalena' },
  { id: 52, fullName: 'Lima - Miraflores' },
];

/** =========================
 *  HELPERS
 *  ========================= */

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

/** =========================
 *  MAIN SCREEN
 *  ========================= */
export default function MatchPreferencesScreen() {
  const { theme } = useTheme();
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
      // Ensure arrays exist to avoid undefined access
      setMatchPreferences({
        ...matchPreferencesData,
        gymBroWorkoutTimes: matchPreferencesData.gymBroWorkoutTimes || [],
        gymBroLocations: matchPreferencesData.gymBroLocations || [],
        gymCrushLocations: matchPreferencesData.gymCrushLocations || [],
      });
    }
  }, [matchPreferencesData, isLoading]);

  const [locModalOpen, setLocModalOpen] = useState<
    null | 'GYMBRO' | 'GYMCRUSH'
  >(null);

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

  /** actions */
  const handleSave = async () => {
    try {
      if (
        matchPreferences?.showInGymBro &&
        (matchPreferences?.gymBroAgeRangeMin ?? MIN_AGE) >
          (matchPreferences?.gymBroAgeRangeMax ?? MAX_AGE)
      ) {
        return Alert.alert('Revisa GymBro', 'El rango de edad es inválido.');
      }
      if (
        matchPreferences?.showInGymCrush &&
        (matchPreferences?.gymCrushAgeRangeMin ?? MIN_AGE) >
          (matchPreferences?.gymCrushAgeRangeMax ?? MAX_AGE)
      ) {
        return Alert.alert('Revisa GymCrush', 'El rango de edad es inválido.');
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
      };

      updatePreferences(payload, {
        onSuccess: () => {
          refetch();
          Alert.alert('¡Listo!', 'Preferencias guardadas correctamente.');
        },
      });
    } catch (err: any) {
      Alert.alert('No se pudo guardar', err?.message ?? 'Error desconocido');
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
    <TextInput
      keyboardType="number-pad"
      value={value != null ? String(value) : ''}
      onChangeText={(t) => {
        const n = parseInt(t, 10);
        if (!Number.isNaN(n)) onChange(n);
      }}
      placeholder={placeholder}
      style={styles.ageInput}
    />
  );

  return (
    <PageContainer style={{ padding: 16, paddingBottom: 150 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View>
          <View>
            <AppText style={styles.title}>Preferencias de Match</AppText>
            <AppText style={styles.subtitle}>
              Configura cómo quieres aparecer en nuestros sistemas de conexión
            </AppText>
          </View>
        </View>

        {/* GymBro card */}
        <Card
          title="GymBro"
          subtitle="Encuentra compañeros de entrenamiento que compartan tus objetivos y horarios"
          theme={theme}
          backgroundColor={theme.warningBackground}
        >
          <SwitchRow
            theme={theme}
            label="Activar GymBro"
            value={!!matchPreferences?.showInGymBro}
            onValueChange={onToggleGymBro}
          />

          {!!matchPreferences?.showInGymBro && (
            <>
              <SectionTitle theme={theme} label="Horarios de entrenamiento" />
              <RowWrap>
                <ChipToggle
                  label="Mañana"
                  active={
                    matchPreferences?.gymBroWorkoutTimes?.includes('MORNING') ||
                    false
                  }
                  onPress={() => {
                    setMatchPreferences((prev) => {
                      const set = new Set(
                        (prev?.gymBroWorkoutTimes || []) as TimePref[],
                      );
                      set.has('MORNING')
                        ? set.delete('MORNING')
                        : set.add('MORNING');
                      return {
                        ...(prev || {}),
                        gymBroWorkoutTimes: Array.from(set),
                      };
                    });
                  }}
                  theme={theme}
                />
                <ChipToggle
                  label="Tarde"
                  active={
                    matchPreferences?.gymBroWorkoutTimes?.includes(
                      'AFTERNOON',
                    ) || false
                  }
                  onPress={() =>
                    setMatchPreferences((prev) => {
                      const set = new Set(
                        (prev?.gymBroWorkoutTimes || []) as TimePref[],
                      );
                      set.has('AFTERNOON')
                        ? set.delete('AFTERNOON')
                        : set.add('AFTERNOON');
                      return {
                        ...(prev || {}),
                        gymBroWorkoutTimes: Array.from(set),
                      };
                    })
                  }
                  theme={theme}
                />
                <ChipToggle
                  label="Noche"
                  active={
                    matchPreferences?.gymBroWorkoutTimes?.includes('NIGHT') ||
                    false
                  }
                  onPress={() =>
                    setMatchPreferences((prev) => {
                      const set = new Set(
                        (prev?.gymBroWorkoutTimes || []) as TimePref[],
                      );
                      set.has('NIGHT') ? set.delete('NIGHT') : set.add('NIGHT');
                      return {
                        ...(prev || {}),
                        gymBroWorkoutTimes: Array.from(set),
                      };
                    })
                  }
                  theme={theme}
                />
                <ChipToggle
                  label="Fin de semana"
                  active={
                    matchPreferences?.gymBroWorkoutTimes?.includes('WEEKEND') ||
                    false
                  }
                  onPress={() =>
                    setMatchPreferences((prev) => {
                      const set = new Set(
                        (prev?.gymBroWorkoutTimes || []) as TimePref[],
                      );
                      set.has('WEEKEND')
                        ? set.delete('WEEKEND')
                        : set.add('WEEKEND');
                      return {
                        ...(prev || {}),
                        gymBroWorkoutTimes: Array.from(set),
                      };
                    })
                  }
                  theme={theme}
                />
              </RowWrap>

              <SectionTitle theme={theme} label="Nivel de intensidad" />
              <RowWrap>
                {(
                  [
                    ['Cualquiera', 'ANY'],
                    ['Principiante', 'BEGINNER'],
                    ['Intermedio', 'INTERMEDIATE'],
                    ['Avanzado', 'ADVANCED'],
                  ] as const
                ).map(([label, val]) => (
                  <RadioChip
                    key={val}
                    label={label}
                    selected={matchPreferences?.gymBroIntensity === val}
                    onPress={() =>
                      setMatchPreferences((prev) => ({
                        ...(prev || {}),
                        gymBroIntensity: val as Intensity,
                      }))
                    }
                    theme={theme}
                  />
                ))}
              </RowWrap>

              <SectionTitle theme={theme} label="Ubicaciones de interés" />
              <Pressable
                onPress={() => setLocModalOpen('GYMBRO')}
                style={styles.locationPicker}
              >
                <AppText style={{ opacity: 0.7 }}>Agregar ubicación</AppText>
              </Pressable>
              <ChipsList
                items={
                  (matchPreferences?.gymBroLocations || []) as LocationDto[]
                }
                onRemove={(id) =>
                  setMatchPreferences((prev) => ({
                    ...(prev || {}),
                    gymBroLocations: (prev?.gymBroLocations || []).filter(
                      (x) => x?.id !== id,
                    ),
                  }))
                }
                theme={theme}
              />

              <SectionTitle theme={theme} label="Preferencias Generales" />
              <AppText style={styles.smallLabel}>Buscando</AppText>
              <RowWrap>
                {(
                  [
                    ['Hombres', 'MALE'],
                    ['Mujeres', 'FEMALE'],
                    ['Ambos', 'BOTH'],
                  ] as const
                ).map(([label, val]) => (
                  <RadioChip
                    key={val}
                    label={label}
                    selected={
                      matchPreferences?.gymBroLookingForGender ===
                      (val as Gender)
                    }
                    onPress={() =>
                      setMatchPreferences((prev) => ({
                        ...(prev || {}),
                        gymBroLookingForGender: val as Gender,
                      }))
                    }
                    theme={theme}
                  />
                ))}
              </RowWrap>

              <AppText style={styles.smallLabel}>Rango de edad</AppText>
              <Row>
                {ageInput(
                  matchPreferences?.gymBroAgeRangeMin,
                  (n) =>
                    setMatchPreferences((g) => ({
                      ...(g || {}),
                      gymBroAgeRangeMin: n,
                    })),
                  'Desde',
                )}
                <AppText style={{ marginHorizontal: 8 }}>—</AppText>
                {ageInput(
                  matchPreferences?.gymBroAgeRangeMax,
                  (n) =>
                    setMatchPreferences((g) => ({
                      ...(g || {}),
                      gymBroAgeRangeMax: n,
                    })),
                  'Hasta',
                )}
              </Row>
            </>
          )}
        </Card>

        {/* GymCrush card */}
        <Card
          title="GymCrush"
          subtitle="Conecta con personas que te interesen para algo más que entrenar"
          theme={theme}
          backgroundColor={theme.successBackground}
        >
          <SwitchRow
            theme={theme}
            label="Activar GymCrush"
            value={!!matchPreferences?.showInGymCrush}
            onValueChange={onToggleGymCrush}
          />

          {!!matchPreferences?.showInGymCrush && (
            <>
              <SectionTitle theme={theme} label="Tipo de conexión" />
              <RowWrap>
                {(
                  [
                    ['Casual', 'CASUAL'],
                    ['Serio', 'SERIOUS'],
                    ['Ambos', 'BOTH'],
                  ] as const
                ).map(([label, val]) => (
                  <RadioChip
                    key={val}
                    label={label}
                    selected={
                      matchPreferences?.gymCrushLookingFor ===
                      (val as CrushLookingFor)
                    }
                    onPress={() =>
                      setMatchPreferences((g) => ({
                        ...(g || {}),
                        gymCrushLookingFor: val as CrushLookingFor,
                      }))
                    }
                    theme={theme}
                  />
                ))}
              </RowWrap>

              <SectionTitle theme={theme} label="Ubicaciones de interés" />
              <Pressable
                onPress={() => setLocModalOpen('GYMCRUSH')}
                style={styles.locationPicker}
              >
                <AppText style={{ opacity: 0.7 }}>Agregar ubicación</AppText>
              </Pressable>
              <ChipsList
                items={
                  (matchPreferences?.gymCrushLocations || []) as LocationDto[]
                }
                onRemove={(id) =>
                  setMatchPreferences((g) => ({
                    ...(g || {}),
                    gymCrushLocations: (g?.gymCrushLocations || []).filter(
                      (x) => x?.id !== id,
                    ),
                  }))
                }
                theme={theme}
              />

              <SectionTitle theme={theme} label="Preferencias Generales" />
              <AppText style={styles.smallLabel}>Buscando</AppText>
              <RowWrap>
                {(
                  [
                    ['Hombres', 'MALE'],
                    ['Mujeres', 'FEMALE'],
                    ['Ambos', 'BOTH'],
                  ] as const
                ).map(([label, val]) => (
                  <RadioChip
                    key={val}
                    label={label}
                    selected={
                      matchPreferences?.gymCrushLookingForGender ===
                      (val as Gender)
                    }
                    onPress={() =>
                      setMatchPreferences((g) => ({
                        ...(g || {}),
                        gymCrushLookingForGender: val as Gender,
                      }))
                    }
                    theme={theme}
                  />
                ))}
              </RowWrap>

              <AppText style={styles.smallLabel}>Rango de edad</AppText>
              <Row>
                {ageInput(
                  matchPreferences?.gymCrushAgeRangeMin,
                  (n) =>
                    setMatchPreferences((g) => ({
                      ...(g || {}),
                      gymCrushAgeRangeMin: n,
                    })),
                  'Desde',
                )}
                <AppText style={{ marginHorizontal: 8 }}>—</AppText>
                {ageInput(
                  matchPreferences?.gymCrushAgeRangeMax,
                  (n) =>
                    setMatchPreferences((g) => ({
                      ...(g || {}),
                      gymCrushAgeRangeMax: n,
                    })),
                  'Hasta',
                )}
              </Row>
            </>
          )}
        </Card>

        {/* Privacy – only if any is enabled */}
        {anyEnabled && (
          <Card
            title="Configuración de Privacidad"
            subtitle="Controla qué información pueden ver otros usuarios"
            theme={theme}
          >
            <SwitchRow
              theme={theme}
              label="Mostrar edad (otros verán tu edad exacta)"
              value={!!matchPreferences?.showAge}
              onValueChange={(v) =>
                setMatchPreferences((prev) => ({ ...(prev || {}), showAge: v }))
              }
            />
          </Card>
        )}

        {/* Actions */}
        <Row style={{ marginTop: 8, gap: 12 }}>
          <PrimaryButton
            label="Guardar Preferencias"
            onPress={handleSave}
            theme={theme}
          />
          <SecondaryButton
            label="Restablecer"
            onPress={handleReset}
            theme={theme}
          />
        </Row>
      </ScrollView>

      {/* Location picker modal (simple multi-select) */}
      <Modal transparent visible={!!locModalOpen} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>Selecciona ubicaciones</AppText>
            <ScrollView style={{ maxHeight: 320 }}>
              {ALL_LOCATIONS.map((loc) => {
                const selected = (
                  locModalOpen === 'GYMBRO'
                    ? matchPreferences?.gymBroLocations || []
                    : matchPreferences?.gymCrushLocations || []
                ).some((x) => x?.id === loc.id);

                return (
                  <Pressable
                    key={loc.id}
                    onPress={() => {
                      if (locModalOpen === 'GYMBRO') {
                        setMatchPreferences((g) => {
                          const exists = (g?.gymBroLocations || []).some(
                            (x) => x?.id === loc.id,
                          );
                          return {
                            ...(g || {}),
                            gymBroLocations: exists
                              ? (g?.gymBroLocations || []).filter(
                                  (x) => x?.id !== loc.id,
                                )
                              : [...(g?.gymBroLocations || []), loc],
                          };
                        });
                      } else {
                        setMatchPreferences((g) => {
                          const exists = (g?.gymCrushLocations || []).some(
                            (x) => x?.id === loc.id,
                          );
                          return {
                            ...(g || {}),
                            gymCrushLocations: exists
                              ? (g?.gymCrushLocations || []).filter(
                                  (x) => x?.id !== loc.id,
                                )
                              : [...(g?.gymCrushLocations || []), loc],
                          };
                        });
                      }
                    }}
                    style={[
                      styles.locationRow,
                      selected && { backgroundColor: theme.backgroundInverted },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.locationRowText,
                        selected && { color: theme.dark100, fontWeight: '700' },
                      ]}
                    >
                      {loc.fullName ||
                        [loc.department, loc.province, loc.district]
                          .filter(Boolean)
                          .join(' - ')}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Row style={{ justifyContent: 'flex-end', marginTop: 12, gap: 10 }}>
              <SecondaryButton
                label="Cerrar"
                onPress={() => setLocModalOpen(null)}
                theme={theme}
              />
            </Row>
          </View>
        </View>
      </Modal>
    </PageContainer>
  );
}

/** =========================
 *  UI SUBCOMPONENTS
 *  ========================= */
function Card({
  title,
  subtitle,
  children,
  theme,
  backgroundColor,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  theme: FullTheme;
  backgroundColor?: string;
}) {
  const styles = getStyles(theme);

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <AppText style={styles.cardTitle}>{title}</AppText>
      {!!subtitle && <AppText style={styles.cardSubtitle}>{subtitle}</AppText>}
      <View style={{ height: 8 }} />
      {children}
    </View>
  );
}

function SwitchRow({
  label,
  value,
  onValueChange,
  theme,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  theme: FullTheme;
}) {
  const styles = getStyles(theme);
  return (
    <View style={styles.switchRow}>
      <AppText style={styles.switchLabel}>{label}</AppText>
      <Switch value={!!value} onValueChange={onValueChange} />
    </View>
  );
}

function SectionTitle({ label, theme }: { label: string; theme: FullTheme }) {
  const styles = getStyles(theme);
  return <AppText style={styles.sectionTitle}>{label}</AppText>;
}

function Row({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {children}
    </View>
  );
}

function RowWrap({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {children}
    </View>
  );
}

function ChipToggle({
  label,
  active,
  onPress,
  theme,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: FullTheme;
}) {
  const styles = getStyles(theme);
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && { backgroundColor: theme.backgroundInverted },
      ]}
    >
      <AppText
        style={[
          styles.chipText,
          active && { color: theme.dark100, fontWeight: '700' },
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

function RadioChip({
  label,
  selected,
  onPress,
  theme,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: FullTheme;
}) {
  return (
    <ChipToggle
      label={label}
      active={selected}
      onPress={onPress}
      theme={theme}
    />
  );
}

function ChipsList({
  items,
  onRemove,
  theme,
}: {
  items: LocationDto[];
  onRemove: (id: number) => void;
  theme: FullTheme;
}) {
  const styles = getStyles(theme);
  return (
    <RowWrap>
      {items.map((loc) => {
        if (!loc?.id) return null;
        const label =
          loc.fullName ||
          [loc.department, loc.province, loc.district]
            .filter(Boolean)
            .join(' - ');
        return (
          <Pressable
            key={loc.id}
            onPress={() => onRemove(loc.id!)}
            style={[styles.tag, { backgroundColor: theme.backgroundInverted }]}
          >
            <AppText style={{ color: theme.dark100, fontWeight: '700' }}>
              {label} ×
            </AppText>
          </Pressable>
        );
      })}
    </RowWrap>
  );
}

function PrimaryButton({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void;
  theme: FullTheme;
}) {
  const styles = getStyles(theme);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.backgroundInverted }]}
    >
      <AppText style={[styles.buttonText, { color: theme.dark100 }]}>
        {label}
      </AppText>
    </Pressable>
  );
}

function SecondaryButton({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void;
  theme: FullTheme;
}) {
  const styles = getStyles(theme);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: '#EFEFEF' }]}
    >
      <AppText style={[styles.buttonText, { color: theme.textPrimary }]}>
        {label}
      </AppText>
    </Pressable>
  );
}

/** =========================
 *  STYLES
 *  ========================= */
const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...HEADING_STYLES(theme),

    card: {
      marginTop: 16,
      borderRadius: 12,
      backgroundColor: theme.infoBackground,
      padding: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E6E6E6',
    },
    cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
    cardSubtitle: { opacity: 0.8 },

    sectionTitle: {
      marginTop: 10,
      marginBottom: 8,
      fontWeight: '700',
    },

    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
    },
    switchLabel: { fontWeight: '600' },

    chip: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: '#F1F1F1',
    },
    chipText: { fontWeight: '600' },

    smallLabel: { marginTop: 12, marginBottom: 6, opacity: 0.8 },

    ageInput: {
      minWidth: 90,
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#D7D7D7',
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: '#FFF',
      textAlign: 'center',
      fontWeight: '700',
    },

    locationPicker: {
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#D7D7D7',
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: '#FFF',
      marginBottom: 8,
    },
    tag: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
    },

    button: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    buttonText: { fontWeight: '800' },

    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'center',
      padding: 16,
    },
    modalCard: {
      borderRadius: 16,
      backgroundColor: theme.dark100,
      padding: 16,
    },
    modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    locationRow: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 8,
      backgroundColor: '#F5F5F5',
    },
    locationRowText: { fontWeight: '600' },
  });
