import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { TextInput } from '@/components/TextInput';
import { MUSCLE_GROUPS } from '@/constants/exercise';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import usePreviousValue from '@/hooks/use-previous-value';
import {
  useCreateWorkout,
  useEditWorkout,
} from '@/lib/api/mutations/workouts/use-actions-user-workouts';
import { useGetWorkoutSeries } from '@/lib/api/queries/workouts/use-get-user-workouts';
import {
  CreateExerciseWithSetsRequest,
  ExerciseSetDto,
  WorkoutSessionDto,
} from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

type Props = {
  mode: 'add' | 'edit';
  initial?: WorkoutSessionDto;
  onClose: () => void;
  refetchCallback: () => void;
  dateISO: string;
};

export function AddEditExerciseModal({
  mode,
  initial,
  onClose,
  refetchCallback,
  dateISO,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const {
    data: initialSeries,
    isLoading,
    isSuccess,
  } = useGetWorkoutSeries(initial?.id);
  const { mutate: editWorkout } = useEditWorkout();
  const { mutate: createWorkout } = useCreateWorkout();

  const [name, setName] = useState(initial?.exerciseName || '');
  const [muscleGroup, setMuscleGroup] = useState<string | undefined>(
    initial?.muscleGroup || undefined,
  );
  const [notes, setNotes] = useState(initial?.exerciseNotes || '');
  const [sets, setSets] = useState<ExerciseSetDto[]>([]);

  const prevIsLoading = usePreviousValue(isLoading);

  useEffect(() => {
    if (mode === 'add') {
      setSets([
        {
          repetitions: undefined,
          weightKg: undefined,
        },
      ]);

      return;
    }

    if ((prevIsLoading && !isLoading) || (!isLoading && isSuccess)) {
      if (!!initialSeries?.length) {
        setSets(initialSeries);
        return;
      }

      setSets([
        {
          repetitions: undefined,
          weightKg: undefined,
        },
      ]);
    }
  }, [prevIsLoading, mode, isLoading, isSuccess, initialSeries]);

  const addSet = () => setSets((prev) => [...prev, { repetitions: undefined }]);

  const removeSet = (idx: number) =>
    setSets((prev) => prev.filter((_, i) => i !== idx));

  const updateSet = (
    idx: number,
    field: 'repetitions' | 'weightKg',
    value: string,
  ) => {
    setSets((prev) => {
      const next = [...prev];
      const num = value ? Number(value) : undefined;
      next[idx] = {
        ...next[idx],
        [field]: field === 'repetitions' ? Number(value || 0) : num,
      } as any;
      return next;
    });
  };

  const canSave =
    name.trim().length > 0 &&
    sets.length > 0 &&
    !!muscleGroup &&
    sets.every((s) => (s.repetitions ?? 0) > 0 && (s.weightKg ?? 0) > 0);

  const handleSave = useCallback(() => {
    const payload: CreateExerciseWithSetsRequest = {
      exerciseName: name,
      workoutDate: String(dateISO),
      muscleGroup: muscleGroup,
      exerciseNotes: notes,
      sets: sets.map((s, i) => ({
        setNumber: i + 1,
        repetitions: s.repetitions,
        weightKg: s.weightKg,
      })),
    };

    if (mode === 'add') {
      createWorkout(
        { ...payload, exerciseOrder: 1 },
        { onSuccess: refetchCallback },
      );
      return;
    }

    editWorkout(
      { ...payload, workoutSessionId: initial?.id },
      { onSuccess: refetchCallback },
    );
  }, [
    mode,
    name,
    muscleGroup,
    dateISO,
    sets,
    notes,
    initial?.id,
    createWorkout,
    editWorkout,
    refetchCallback,
  ]);

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={styles.modalRoot} behavior="padding">
        <View style={styles.modalSheet}>
          <View style={styles.modalPageStyle}>
            <ScrollView
              style={styles.formScroll}
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalHeader}>
                <AppText style={styles.modalTitle}>
                  {mode === 'add' ? '+ Agregar Ejercicio' : 'Editar Ejercicio'}
                </AppText>
                <AppText style={styles.modalSubtitle}>
                  {moment(dateISO).format('DD/MM/YYYY')}
                </AppText>
              </View>

              <TextInput
                placeholder="Nombre del Ejercicio*"
                value={name}
                onChangeText={setName}
                style={[styles.input, styles.nameInput]}
              />

              <Dropdown
                placeholder={'Grupo Muscular'}
                options={MUSCLE_GROUPS.map((item) => ({
                  label: item,
                  value: item,
                }))}
                zIndex={6000}
                onChange={setMuscleGroup}
                value={muscleGroup}
              />

              <TextInput
                placeholder="Notas (opcional)"
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, styles.notesInput]}
                multiline
              />

              <View style={styles.seriesHeaderRow}>
                <AppText style={styles.seriesLabel}>Series</AppText>
                <Pressable onPress={addSet}>
                  <AppText style={styles.addSeriesText}>+ Añadir serie</AppText>
                </Pressable>
              </View>

              {sets.map((s, idx) => (
                <View key={idx} style={styles.setCard}>
                  <View style={styles.setHeader}>
                    <AppText style={styles.setLabel}>Serie {idx + 1}</AppText>
                    <Pressable
                      onPress={() => removeSet(idx)}
                      style={styles.removeButton}
                    >
                      <AppText style={styles.removeButtonText}>
                        Eliminar
                      </AppText>
                    </Pressable>
                  </View>

                  <View style={styles.setInputsRow}>
                    <TextInput
                      keyboardType="numeric"
                      placeholder="Repeticiones"
                      value={String(s.repetitions || '')}
                      onChangeText={(t) => updateSet(idx, 'repetitions', t)}
                      style={[styles.input, styles.inputSmall]}
                    />
                    <TextInput
                      keyboardType="numeric"
                      placeholder="Peso (kg)"
                      value={
                        typeof s.weightKg === 'number' ? String(s.weightKg) : ''
                      }
                      onChangeText={(t) => updateSet(idx, 'weightKg', t)}
                      style={[styles.input, styles.inputSmall]}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                label={'Cancelar'}
                onPress={onClose}
                style={styles.buttonFlex}
                type={'tertiary'}
                buttonStyle={styles.footerButtonPadding}
              />

              <Button
                label={mode === 'add' ? 'Guardar Ejercicio' : 'Guardar Cambios'}
                disabled={!canSave}
                buttonStyle={[
                  styles.footerButtonPadding,
                  !canSave && styles.confirmButtonDisabled,
                ]}
                onPress={handleSave}
                style={styles.buttonFlex}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    modalRoot: {
      flex: 1,
      backgroundColor: theme.background.app,
      justifyContent: 'flex-start',
      paddingTop: 64,
    },
    modalSheet: {
      backgroundColor: theme.background.app,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      borderWidth: 1,
      borderColor: theme.border.default,
      overflow: 'hidden',
      flex: 1,
    },
    modalPageStyle: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    formScroll: { flex: 1 },
    formContent: {
      rowGap: 10,
      paddingBottom: 16,
    },
    modalHeader: { marginBottom: 4, marginTop: 4 },
    modalTitle: {
      ...text.stat,
      color: theme.text.primary,
      lineHeight: 28,
    },
    modalSubtitle: {
      ...text.smallSemibold,
      color: theme.text.secondary,
      marginTop: 2,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border.default,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 12,
      ...text.body,
      backgroundColor: theme.background.input,
      color: theme.text.primary,
    },
    nameInput: {
      flex: 0,
      minHeight: 52,
      paddingVertical: 10,
    },
    inputSmall: { flex: 1 },
    seriesHeaderRow: {
      marginTop: 8,
      marginBottom: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    seriesLabel: { ...text.bodySemibold, color: theme.text.primary },
    addSeriesText: { ...text.bodySemibold, color: theme.brand.primary },
    setCard: {
      borderWidth: 1,
      borderColor: theme.border.default,
      backgroundColor: theme.background.card,
      borderRadius: 12,
      padding: 10,
      rowGap: 10,
    },
    setHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    setInputsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    setLabel: { ...text.bodySemibold, color: theme.text.primary },
    removeButton: { paddingHorizontal: 8, paddingVertical: 4 },
    removeButtonText: { ...text.bodySemibold, color: theme.status.error.icon },
    notesInput: { flex: 0, minHeight: 88, maxHeight: 110, marginTop: 4 },
    modalFooter: {
      flexDirection: 'row',
      gap: 10,
      paddingTop: 12,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border.default,
      backgroundColor: theme.background.app,
    },
    buttonFlex: { flex: 1 },
    footerButtonPadding: { paddingVertical: 10 },
    confirmButtonDisabled: { opacity: 0.5 },
  });
};
