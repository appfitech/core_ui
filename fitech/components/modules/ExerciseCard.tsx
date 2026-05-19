import React, { useCallback } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { useTheme } from '@/contexts/ThemeContext';
import { useOpenable } from '@/hooks/use-openable';
import { useDeleteWorkout } from '@/lib/api/mutations/workouts/use-actions-user-workouts';
import { useGetWorkoutSeries } from '@/lib/api/queries/workouts/use-get-user-workouts';
import { WorkoutSessionDto } from '@/types/api/types.gen';

import { AddEditExerciseModal } from './AddEditWorkoutModal';

type Props = {
  session: WorkoutSessionDto;
  refetchCallback: () => void;
};

export function ExerciseCard({ session, refetchCallback }: Props) {
  const { theme } = useTheme();
  const { data: series, refetch: refetchSeries } = useGetWorkoutSeries(
    session?.id,
  );
  const { mutate: deleteWorkout } = useDeleteWorkout();

  const { isOpen, close, open } = useOpenable();

  const handleDelete = useCallback(() => {
    if (!session.id) {
      return;
    }

    deleteWorkout(session.id, {
      onSuccess: () => {
        refetchCallback();
      },
    });
  }, [deleteWorkout, refetchCallback, session]);

  const handleCallback = useCallback(() => {
    close();
    refetchSeries();
    refetchCallback();
  }, [close, refetchCallback, refetchSeries]);

  return (
    <Card
      style={{
        backgroundColor: theme.background.card,
        borderColor: theme.brand.primary,
        borderWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <AppText variant="sectionTitle" style={{ color: theme.text.primary }}>
          {session.exerciseName}
        </AppText>
        {!!session.muscleGroup && (
          <Tag
            backgroundColor={theme.brand.primarySoft}
            textColor={theme.brand.primaryLight}
            label={session.muscleGroup}
          />
        )}
      </View>

      <View style={{ marginTop: 8 }}>
        {series?.map((s, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginVertical: 4,
            }}
          >
            <AppText style={{ color: theme.text.tertiary }}>
              Serie {s.setNumber ?? idx + 1}:
            </AppText>
            <View
              style={{
                backgroundColor: theme.background.input,
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 999,
              }}
            >
              <AppText style={{ color: theme.text.primary }}>
                {s.repetitions ?? 0}{' '}
                {(s.repetitions ?? 0) === 1 ? 'repetición' : 'repeticiones'}
              </AppText>
            </View>
            {typeof s.weightKg === 'number' && (
              <View
                style={{
                  backgroundColor: theme.background.input,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 999,
                }}
              >
                <AppText style={{ color: theme.text.primary }}>
                  {s.weightKg} kg
                </AppText>
              </View>
            )}
          </View>
        ))}
      </View>

      {!!session.exerciseNotes && (
        <View
          style={{
            backgroundColor: theme.background.input,
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
          }}
        >
          <AppText
            variant="smallSemibold"
            style={{ marginBottom: 4, color: theme.text.primary }}
          >
            Notas del entrenamiento:
          </AppText>
          <AppText style={{ color: theme.text.primary }}>
            {session.exerciseNotes}
          </AppText>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 16,
          marginTop: 10,
        }}
      >
        <Button
          label={'Editar'}
          buttonStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
          onPress={open}
          type={'tertiary'}
        />
        <Button
          buttonStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
          label={'Eliminar'}
          onPress={handleDelete}
          type={'destructive'}
        />
      </View>

      {isOpen && (
        <AddEditExerciseModal
          mode={'edit'}
          initial={session}
          onClose={handleCallback}
          refetchCallback={handleCallback}
          dateISO={String(session.workoutDate)}
        />
      )}
    </Card>
  );
}
