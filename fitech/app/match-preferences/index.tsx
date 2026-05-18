import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ALL_LOCATIONS, formatLocationName } from '@/constants/locations';
import { MATCH_WORKOUT_SCHEDULES } from '@/constants/match';
import { textStyles } from '@/constants/typography';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  CreateMatchPreferencesRequest,
  LocationDto,
  MatchPreferencesDto,
} from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { useUpdateMatchPreferences } from '@/lib/api/mutations/use-update-match-preferences';
import { useGetUserMatchPreferences } from '@/lib/api/queries/use-get-user-match-preferences';
import { AppText } from '@/components/AppText';
import { SwitchRow } from '@/components/atoms/SwitchRow';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';

/** =========================
 *  ENUMS / CONSTANTS (BE)
 *  ========================= */
type Gender = 'MALE' | 'FEMALE' | 'BOTH';
type TimePref = 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'WEEKEND';
type Intensity = 'ANY' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
type CrushLookingFor = 'CASUAL' | 'SERIOUS' | 'BOTH';

const MIN_AGE = 18;
const MAX_AGE = 65;

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

export default function MatchPreferencesScreen() {
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
    } catch (err: any) {
      showAlert({
        title: 'No se pudo guardar',
        message: err?.message ?? 'Error desconocido',
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
    <PageContainer
      title="Preferencias de Match"
      subheader="Configura cómo quieres aparecer en nuestros sistemas de conexión"
      style={styles.pageStyle}
    >
      {/* GymBro card */}
      <Card style={styles.cardDark}>
        <SwitchRow
          label="GYMBRO"
          value={!!matchPreferences?.showInGymBro}
          onChange={onToggleGymBro}
          labelStyle={styles.titleLeft}
        />
        <AppText style={styles.subtitleLeft}>
          Encuentra compañeros de entrenamiento que compartan tus objetivos y
          horarios
        </AppText>

        {!!matchPreferences?.showInGymBro && (
          <>
            <SectionTitle theme={theme} label="Horarios de entrenamiento" />
            <RowWrap>
              {MATCH_WORKOUT_SCHEDULES.map(({ label, value }, index) => (
                <ChipToggle
                  key={`${value}-${index}`}
                  label={label}
                  active={
                    matchPreferences?.gymBroWorkoutTimes?.includes(value) ||
                    false
                  }
                  onPress={() => {
                    setMatchPreferences((prev) => {
                      const set = new Set(
                        (prev?.gymBroWorkoutTimes || []) as TimePref[],
                      );

                      set.has(value) ? set.delete(value) : set.add(value);

                      return {
                        ...(prev || {}),
                        gymBroWorkoutTimes: Array.from(set),
                      };
                    });
                  }}
                  theme={theme}
                />
              ))}
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
              <AppText style={styles.addLocationText}>
                Agregar ubicación
              </AppText>
            </Pressable>
            <ChipsList
              items={(matchPreferences?.gymBroLocations || []) as LocationDto[]}
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
                    matchPreferences?.gymBroLookingForGender === (val as Gender)
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
              <AppText style={styles.ageSeparator}>—</AppText>
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
          </>
        )}
      </Card>

      {/* GymCrush card */}
      <Card style={styles.cardDark}>
        <SwitchRow
          label="GYMCRUSH"
          value={!!matchPreferences?.showInGymCrush}
          onChange={onToggleGymCrush}
          labelStyle={styles.titleLeft}
        />
        <AppText style={styles.subtitleLeft}>
          Conecta con personas que te interesen para algo más que entrenar
        </AppText>

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
              <AppText style={styles.addLocationText}>
                Agregar ubicación
              </AppText>
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
              <AppText style={styles.ageSeparator}>—</AppText>
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
          </>
        )}
      </Card>

      {/* Privacy – only if any is enabled */}
      {anyEnabled && (
        <Card style={styles.privacyCard}>
          <View style={styles.privacyInner}>
            <AppText style={styles.titleLeft}>
              {'Configuración de Privacidad'}
            </AppText>
            <AppText style={styles.subtitleLeft}>
              Controla qué información pueden ver otros usuarios
            </AppText>
          </View>
          <SwitchRow
            label="Mostrar edad (otros verán tu edad exacta)"
            value={!!matchPreferences?.showAge}
            onChange={(v) =>
              setMatchPreferences((prev) => ({ ...(prev || {}), showAge: v }))
            }
          />
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Button
          label="Guardar Preferencias"
          onPress={handleSave}
          style={styles.buttonFull}
        />
        <Button
          label="Restablecer"
          onPress={handleReset}
          type="tertiary"
          style={styles.buttonFull}
        />
      </View>

      {/* Location picker modal (simple multi-select) */}
      <Modal transparent visible={!!locModalOpen} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>Selecciona ubicaciones</AppText>
            <ScrollView style={styles.modalScroll}>
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
                      selected && styles.locationRowSelected,
                    ]}
                  >
                    <AppText
                      style={[
                        styles.locationRowText,
                        selected && styles.locationRowTextSelected,
                      ]}
                    >
                      {formatLocationName(loc)}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Row style={styles.modalFooterRow}>
              <Button
                label="Cerrar"
                onPress={() => setLocModalOpen(null)}
                type={'tertiary'}
                buttonStyle={styles.modalCloseButton}
              />
            </Row>
          </View>
        </View>
      </Modal>
    </PageContainer>
  );
}

// /** =========================
//  *  UI SUBCOMPONENTS
//  *  ========================= */

function SectionTitle({ label, theme }: { label: string; theme: FullTheme }) {
  const styles = getStyles(theme);
  return <AppText style={styles.sectionTitle}>{label}</AppText>;
}

function Row({ children, style }: { children: React.ReactNode; style?: any }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return <View style={[styles.rowBase, style]}>{children}</View>;
}

function RowWrap({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return <View style={styles.rowWrap}>{children}</View>;
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
      style={[styles.chip, active && styles.chipActive]}
    >
      <AppText style={[styles.chipText, active && styles.chipTextActive]}>
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
        return (
          <Pressable
            key={loc.id}
            onPress={() => onRemove(loc.id!)}
            style={[styles.tag, styles.tagSelected]}
          >
            <AppText style={styles.tagText}>
              {formatLocationName(loc)} ×
            </AppText>
          </Pressable>
        );
      })}
    </RowWrap>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...textStyles(theme),
    pageStyle: {
      paddingHorizontal: 16,
      rowGap: 20,
    },
    cardDark: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      rowGap: 10,
    },
    titleLeft: {
      ...textStyles(theme).title,
      textAlign: 'left',
      fontWeight: '700',
    },
    subtitleLeft: {
      ...textStyles(theme).subtitle,
      textAlign: 'left',
    },
    addLocationText: {
      fontSize: 15,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    ageSeparator: { marginHorizontal: 8 },
    privacyCard: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      rowGap: 20,
    },
    privacyInner: { rowGap: 6 },
    actionsRow: {
      marginTop: 12,
      rowGap: 12,
    },
    buttonFull: { width: '100%' },
    modalScroll: { maxHeight: 320 },
    modalFooterRow: {
      justifyContent: 'flex-end',
      marginTop: 12,
      gap: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalCloseButton: { paddingHorizontal: 20 },
    rowBase: { flexDirection: 'row', alignItems: 'center' },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    locationRowSelected: { backgroundColor: theme.primary },
    locationRowTextSelected: { color: theme.background, fontWeight: '700' },
    sectionTitle: {
      marginTop: 10,
      marginBottom: 8,
      fontWeight: '700',
    },

    chip: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: theme.backgroundInput,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    chipText: {
      fontWeight: '600',
      color: theme.textPrimary,
    },
    chipTextActive: { color: theme.background, fontWeight: '700' },

    smallLabel: {
      marginTop: 12,
      marginBottom: 6,
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
    },

    ageInput: {
      minWidth: 90,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: theme.backgroundInput,
      textAlign: 'center',
      fontWeight: '700',
      color: theme.textPrimary,
    },

    locationPicker: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: theme.backgroundInput,
      marginBottom: 8,
    },
    tag: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
    },
    tagSelected: { backgroundColor: theme.primary },
    tagText: { color: theme.background, fontWeight: '700' },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'center',
      padding: 16,
    },
    modalCard: {
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 18,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
      color: theme.textPrimary,
    },
    locationRow: {
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: theme.backgroundInput,
      borderWidth: 1,
      borderColor: theme.border,
    },
    locationRowText: {
      fontWeight: '600',
      color: theme.textPrimary,
    },
  });
