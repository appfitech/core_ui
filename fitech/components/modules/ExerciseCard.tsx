import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDeleteWorkout } from '@/lib/api/mutations/workouts/use-actions-user-workouts';
import { useGetWorkoutSeries } from '@/lib/api/queries/workouts/use-get-user-workouts';
import {
  formatRepsDisplay,
  formatWeightDisplay,
  MAX_EXERCISE_CARD_SETS_VISIBLE,
} from '@/lib/workouts/exercise-form';
import { ExerciseSetDto, WorkoutSessionDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

type Props = {
  session: WorkoutSessionDto;
  refetchCallback: () => void;
};

export function ExerciseCard({ session, refetchCallback }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { showAlert } = useAlert();
  const router = useRouter();
  const { data: series } = useGetWorkoutSeries(session?.id);
  const { mutate: deleteWorkout, isPending: isDeleting } = useDeleteWorkout();

  const { visibleSets, hiddenSetCount } = useMemo(() => {
    const all = series ?? [];
    return {
      visibleSets: all.slice(0, MAX_EXERCISE_CARD_SETS_VISIBLE),
      hiddenSetCount: Math.max(0, all.length - MAX_EXERCISE_CARD_SETS_VISIBLE),
    };
  }, [series]);

  const handleDelete = useCallback(() => {
    if (!session.id || isDeleting) return;

    showAlert({
      title: 'Eliminar ejercicio',
      message: `¿Eliminar "${session.exerciseName ?? 'este ejercicio'}" y todas sus series?`,
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteWorkout(session.id!, {
              onSuccess: () => refetchCallback(),
            });
          },
        },
      ],
    });
  }, [
    deleteWorkout,
    isDeleting,
    refetchCallback,
    session.exerciseName,
    session.id,
    showAlert,
  ]);

  const openEdit = useCallback(() => {
    if (!session.id || !session.workoutDate) return;

    router.push({
      pathname: '/exercises/[date]/workout',
      params: {
        date: String(session.workoutDate),
        mode: 'edit',
        id: String(session.id),
        exerciseName: session.exerciseName ?? '',
        muscleGroup: session.muscleGroup ?? '',
        exerciseNotes: session.exerciseNotes ?? '',
      },
    });
  }, [router, session]);

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <AppText
            variant="sectionTitle"
            style={styles.title}
            numberOfLines={2}
          >
            {session.exerciseName}
          </AppText>
          {!!session.muscleGroup && (
            <Tag
              backgroundColor={theme.brand.primarySoft}
              textColor={theme.brand.primaryLight}
              label={session.muscleGroup}
              style={styles.muscleTag}
            />
          )}
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={openEdit}
            accessibilityLabel="Editar ejercicio"
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={theme.text.primary}
            />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            disabled={isDeleting}
            accessibilityLabel="Eliminar ejercicio"
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              styles.iconButtonDanger,
              pressed && styles.iconButtonPressed,
              isDeleting && styles.iconButtonDisabled,
            ]}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={theme.status.error.icon}
            />
          </Pressable>
        </View>
      </View>

      {visibleSets.length > 0 ? (
        <View style={styles.seriesBlock}>
          {visibleSets.map((s, idx) => (
            <SetRow
              key={s.id ?? `set-${idx}`}
              set={s}
              index={idx}
              styles={styles}
            />
          ))}
          {hiddenSetCount > 0 ? (
            <AppText style={styles.seriesOverflow}>
              + {hiddenSetCount}{' '}
              {hiddenSetCount === 1 ? 'serie más' : 'series más'}
            </AppText>
          ) : null}
        </View>
      ) : null}

      {!!session.exerciseNotes?.trim() && (
        <View style={styles.notesBox}>
          <AppText variant="caption" style={styles.notesLabel}>
            Notas
          </AppText>
          <AppText style={styles.notesText} numberOfLines={2}>
            {session.exerciseNotes}
          </AppText>
        </View>
      )}
    </Card>
  );
}

function SetRow({
  set,
  index,
  styles,
}: {
  set: ExerciseSetDto;
  index: number;
  styles: ReturnType<typeof getStyles>;
}) {
  const setLabel = set.setNumber ?? index + 1;
  const reps = set.repetitions ?? 0;

  return (
    <View style={styles.setRow}>
      <AppText style={styles.setLabel}>Serie {setLabel}</AppText>
      <View style={styles.setPills}>
        <View style={styles.pill}>
          <AppText style={styles.pillText}>{formatRepsDisplay(reps)}</AppText>
        </View>
        {typeof set.weightKg === 'number' ? (
          <View style={styles.pill}>
            <AppText style={styles.pillText}>
              {formatWeightDisplay(set.weightKg)} kg
            </AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    card: {
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    titleBlock: {
      flex: 1,
      minWidth: 0,
      rowGap: 8,
    },
    title: {
      color: theme.text.primary,
    },
    muscleTag: {
      alignSelf: 'flex-start',
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    iconButtonDanger: {
      backgroundColor: theme.status.error.bg,
      borderColor: theme.status.error.border,
    },
    iconButtonPressed: {
      opacity: 0.75,
    },
    iconButtonDisabled: {
      opacity: 0.45,
    },
    seriesBlock: {
      marginTop: 14,
      rowGap: 8,
    },
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
    },
    setLabel: {
      ...text.caption,
      color: theme.text.tertiary,
      minWidth: 52,
    },
    setPills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      flex: 1,
    },
    pill: {
      backgroundColor: theme.background.input,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border.subtle,
    },
    pillText: {
      ...text.small,
      color: theme.text.primary,
    },
    seriesOverflow: {
      ...text.caption,
      color: theme.text.secondary,
      marginTop: 2,
    },
    notesBox: {
      marginTop: 12,
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.background.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border.subtle,
    },
    notesLabel: {
      color: theme.text.secondary,
      marginBottom: 4,
    },
    notesText: {
      ...text.small,
      color: theme.text.primary,
    },
  });
};
