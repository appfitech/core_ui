import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { WorkoutExerciseForm } from '@/components/workouts/WorkoutExerciseForm';
import usePreviousValue from '@/hooks/use-previous-value';
import {
  useCreateWorkout,
  useEditWorkout,
} from '@/lib/api/mutations/workouts/use-actions-user-workouts';
import { useGetWorkoutSeries } from '@/lib/api/queries/workouts/use-get-user-workouts';
import {
  createEmptySet,
  isExerciseFormValid,
  parseRepsInput,
  parseWeightInput,
  roundReps,
  roundWeightKg,
  sanitizeExerciseSet,
} from '@/lib/workouts/exercise-form';
import {
  CreateExerciseWithSetsRequest,
  ExerciseSetDto,
} from '@/types/api/types.gen';

type WorkoutFormParams = {
  date: string;
  mode?: 'add' | 'edit';
  id?: string;
  exerciseName?: string;
  muscleGroup?: string;
  exerciseNotes?: string;
};

export default function WorkoutExerciseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<WorkoutFormParams>();
  const {
    date,
    mode = 'add',
    id,
    exerciseName: exerciseNameParam,
    muscleGroup: muscleGroupParam,
    exerciseNotes: exerciseNotesParam,
  } = params;

  const isEdit = mode === 'edit' && !!id;
  const workoutSessionId = id ? Number(id) : undefined;

  const {
    data: initialSeries,
    isLoading: isSeriesLoading,
    isSuccess: isSeriesSuccess,
  } = useGetWorkoutSeries(isEdit ? workoutSessionId : undefined);

  const { mutate: editWorkout, isPending: isEditPending } = useEditWorkout();
  const { mutate: createWorkout, isPending: isCreatePending } =
    useCreateWorkout();

  const [name, setName] = useState(() =>
    isEdit ? String(exerciseNameParam ?? '') : '',
  );
  const [muscleGroup, setMuscleGroup] = useState<string | undefined>(() =>
    isEdit && muscleGroupParam ? String(muscleGroupParam) : undefined,
  );
  const [notes, setNotes] = useState(() =>
    isEdit ? String(exerciseNotesParam ?? '') : '',
  );
  const [sets, setSets] = useState<ExerciseSetDto[]>([createEmptySet()]);
  const [seriesHydrated, setSeriesHydrated] = useState(!isEdit);

  const prevIsSeriesLoading = usePreviousValue(isSeriesLoading);

  useEffect(() => {
    if (!isEdit) return;

    setName(String(exerciseNameParam ?? ''));
    setMuscleGroup(muscleGroupParam ? String(muscleGroupParam) : undefined);
    setNotes(String(exerciseNotesParam ?? ''));
  }, [isEdit, exerciseNameParam, muscleGroupParam, exerciseNotesParam]);

  useEffect(() => {
    if (!isEdit) {
      setSets([createEmptySet()]);
      setSeriesHydrated(true);
      return;
    }

    if (
      (prevIsSeriesLoading && !isSeriesLoading) ||
      (!isSeriesLoading && isSeriesSuccess)
    ) {
      setSets(
        initialSeries?.length
          ? initialSeries.map(sanitizeExerciseSet)
          : [createEmptySet()],
      );
      setSeriesHydrated(true);
    }
  }, [
    isEdit,
    prevIsSeriesLoading,
    isSeriesLoading,
    isSeriesSuccess,
    initialSeries,
  ]);

  const addSet = () => setSets((prev) => [...prev, createEmptySet()]);

  const removeSet = (idx: number) =>
    setSets((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx),
    );

  const updateSet = (
    idx: number,
    field: 'repetitions' | 'weightKg',
    value: string,
  ) => {
    setSets((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        [field]:
          field === 'repetitions'
            ? parseRepsInput(value)
            : parseWeightInput(value),
      };
      return next;
    });
  };

  const canSave = useMemo(
    () => isExerciseFormValid(name, muscleGroup, sets),
    [name, muscleGroup, sets],
  );

  const isSaving = isEditPending || isCreatePending;
  const formattedDate = moment(String(date)).format('DD/MM/YYYY');
  const isFormReady = seriesHydrated && (!isEdit || !isSeriesLoading);

  const handleSave = useCallback(() => {
    if (!canSave || !date) return;

    const payload: CreateExerciseWithSetsRequest = {
      exerciseName: name.trim(),
      workoutDate: String(date),
      muscleGroup,
      exerciseNotes: notes.trim() || undefined,
      sets: sets.map((s, i) => ({
        setNumber: i + 1,
        repetitions:
          typeof s.repetitions === 'number'
            ? roundReps(s.repetitions)
            : s.repetitions,
        weightKg:
          typeof s.weightKg === 'number' ? roundWeightKg(s.weightKg) : s.weightKg,
      })),
    };

    const onSuccess = () => router.back();

    if (isEdit && workoutSessionId != null) {
      editWorkout({ ...payload, workoutSessionId }, { onSuccess });
      return;
    }

    createWorkout({ ...payload, exerciseOrder: 1 }, { onSuccess });
  }, [
    canSave,
    createWorkout,
    date,
    editWorkout,
    isEdit,
    muscleGroup,
    name,
    notes,
    router,
    sets,
    workoutSessionId,
  ]);

  const footer = (
    <View style={styles.footerRow}>
      <Button
        label="Cancelar"
        type="tertiary"
        onPress={() => router.back()}
        disabled={isSaving}
        style={styles.footerButton}
      />
      <Button
        label="Guardar"
        onPress={handleSave}
        disabled={!canSave || isSaving}
        loading={isSaving}
        style={styles.footerButton}
        buttonStyle={!canSave ? styles.saveButtonDisabled : undefined}
      />
    </View>
  );

  return (
    <PageContainer
      title={isEdit ? 'Editar ejercicio' : 'Agregar ejercicio'}
      subheader={formattedDate}
      style={styles.pageStyle}
      hasBottomPadding={false}
      includeTabBarPadding={false}
      footer={footer}
    >
      {!isFormReady ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      ) : (
        <WorkoutExerciseForm
          name={name}
          onNameChange={setName}
          muscleGroup={muscleGroup}
          onMuscleGroupChange={setMuscleGroup}
          notes={notes}
          onNotesChange={setNotes}
          sets={sets}
          onAddSet={addSet}
          onRemoveSet={removeSet}
          onUpdateSet={updateSet}
        />
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  pageStyle: {
    rowGap: 16,
    paddingBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  footerButton: {
    flex: 1,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  loadingWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
});
