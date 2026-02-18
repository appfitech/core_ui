import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  useCreateWorkout,
  useEditWorkout,
} from '@/app/api/mutations/workouts/use-actions-user-workouts';
import { useGetWorkoutSeries } from '@/app/api/queries/workouts/use-get-user-workouts';
import { AppText } from '@/app/components/AppText';
import { MUSCLE_GROUPS } from '@/constants/exercise';
import { useTheme } from '@/contexts/ThemeContext';
import { useOpenable } from '@/hooks/use-openable';
import usePreviousValue from '@/hooks/use-previous-value';
import {
  CreateExerciseWithSetsRequest,
  ExerciseSetDto,
  WorkoutSessionDto,
} from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { Button } from '../Button';
import { Dropdown } from '../Dropdown';
import PageContainer from '../PageContainer';
import { TextInput } from '../TextInput';

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

  const { isOpen, setIsOpen } = useOpenable();

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
  }, [prevIsLoading, mode, isLoading, isSuccess]);

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
  }, [mode, name, muscleGroup, dateISO, sets, notes, initial?.id]);

  return (
    <Modal animationType="slide" presentationStyle="fullScreen">
      <PageContainer
        hasBackButton={false}
        styleContainer={{ backgroundColor: 'transparent' }}
        style={styles.modalPageStyle}
      >
        <View style={styles.modalCard}>
          <AppText style={styles.modalTitle}>
            {mode === 'add' ? '+ Agregar Ejercicio' : 'Editar Ejercicio'} -{' '}
            {moment(dateISO).format('DD/MM/YYYY')}
          </AppText>

          <TextInput
            placeholder="Nombre del Ejercicio*"
            placeholderTextColor="#808080"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Dropdown
            placeholder={'Grupo Muscular'}
            options={MUSCLE_GROUPS.map((item) => ({
              label: item,
              value: item,
            }))}
            zIndex={6000}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onChange={setMuscleGroup}
            value={muscleGroup}
          />

          <View style={styles.seriesHeaderRow}>
            <AppText style={styles.seriesLabel}>Series</AppText>
            <Pressable onPress={addSet}>
              <AppText style={styles.addSeriesText}>+ Añadir serie</AppText>
            </Pressable>
          </View>

          <ScrollView>
            {sets.map((s, idx) => (
              <View key={idx} style={styles.setRow}>
                <AppText style={styles.setLabel}>Serie {idx + 1}</AppText>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Repeticiones"
                  placeholderTextColor="#808080"
                  value={String(s.repetitions || '')}
                  onChangeText={(t) => updateSet(idx, 'repetitions', t)}
                  style={[styles.input, styles.inputSmall]}
                />
                <TextInput
                  keyboardType="numeric"
                  placeholder="Peso (kg)"
                  placeholderTextColor="#808080"
                  value={
                    typeof s.weightKg === 'number' ? String(s.weightKg) : ''
                  }
                  onChangeText={(t) => updateSet(idx, 'weightKg', t)}
                  style={[styles.input, styles.inputSmall]}
                />
                <Pressable
                  onPress={() => removeSet(idx)}
                  style={styles.removeButton}
                >
                  <AppText style={styles.removeButtonText}>🗑️</AppText>
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <TextInput
            placeholder="Notas (opcional)"
            placeholderTextColor="#808080"
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, styles.notesInput]}
            multiline
          />

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
      </PageContainer>
    </Modal>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    modalPageStyle: { padding: 0, paddingBottom: 0 },
    modalCard: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      gap: 10,
      maxHeight: '92%',
      paddingBottom: 50,
    },
    modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    input: {
      borderWidth: 1,
      borderColor: '#C7C7C7',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: 'white',
    },
    inputSmall: { flex: 1 },
    seriesHeaderRow: {
      marginTop: 8,
      marginBottom: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    seriesLabel: { fontWeight: '700' },
    addSeriesText: { color: '#1A73E8', fontWeight: '700' },
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    setLabel: { fontWeight: '600', width: 64 },
    removeButton: { paddingHorizontal: 8 },
    removeButtonText: { color: '#D9534F', fontWeight: '700' },
    notesInput: { height: 50 },
    modalFooter: { flexDirection: 'row', gap: 10, marginTop: 8 },
    buttonFlex: { flex: 1 },
    footerButtonPadding: { paddingVertical: 10 },
    confirmButtonDisabled: { opacity: 0.5 },
  });
