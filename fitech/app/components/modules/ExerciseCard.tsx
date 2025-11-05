import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { useDeleteWorkout } from '@/app/api/mutations/workouts/use-actions-user-workouts';
import { useGetWorkoutSeries } from '@/app/api/queries/workouts/use-get-user-workouts';
import { AppText } from '@/app/components/AppText';
import { Tag } from '@/app/components/Tag';
import { useTheme } from '@/contexts/ThemeContext';
import { WorkoutSessionDto } from '@/types/api/types.gen';

import { Button } from '../Button';

type Props = {
  session: WorkoutSessionDto;
  refetchCallback: () => void;
  onEdit: () => void;
};

export function ExerciseCard({ session, refetchCallback, onEdit }: Props) {
  const { theme } = useTheme();
  const { data: series } = useGetWorkoutSeries(session?.id);
  const { mutate: deleteWorkout } = useDeleteWorkout();

  const handleDelete = useCallback(() => {
    if (!session.id) {
      return;
    }

    deleteWorkout(session.id, {
      onSuccess: () => {
        refetchCallback();
      },
    });
  }, [refetchCallback, session]);

  return (
    <View
      style={{
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#DDD',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <AppText style={{ fontSize: 18, fontWeight: '700' }}>
          {session.exerciseName}
        </AppText>
        {!!session.muscleGroup && (
          <Tag
            backgroundColor={theme.backgroundInverted}
            textColor={theme.dark100}
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
            <AppText style={{ color: theme.dark400, fontWeight: '700' }}>
              Serie {s.setNumber ?? idx + 1}:
            </AppText>
            <View
              style={{
                backgroundColor: '#F0F0F0',
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 999,
              }}
            >
              <AppText>
                {s.repetitions ?? 0}{' '}
                {(s.repetitions ?? 0) === 1 ? 'repetición' : 'repeticiones'}
              </AppText>
            </View>
            {typeof s.weightKg === 'number' && (
              <View
                style={{
                  backgroundColor: '#F0F0F0',
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 999,
                }}
              >
                <AppText>{s.weightKg} kg</AppText>
              </View>
            )}
          </View>
        ))}
      </View>

      {!!session.exerciseNotes && (
        <View
          style={{
            backgroundColor: '#F7F7F7',
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
          }}
        >
          <AppText style={{ fontWeight: '600', marginBottom: 4 }}>
            Notas del entrenamiento:
          </AppText>
          <AppText>{session.exerciseNotes}</AppText>
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
          onPress={onEdit}
          type={'tertiary'}
        />
        <Button
          buttonStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
          label={'Eliminar'}
          onPress={handleDelete}
          type={'destructive'}
        />
      </View>
    </View>
  );
}
