import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { SelectableCard } from '@/components/SelectableCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useUpdateFitnessGoals } from '@/lib/api/mutations/use-update-fitness-goals';
import { useGetAllFitnessGoalTypes } from '@/lib/api/queries/use-get-all-fitness-goal-types';
import { useUserStore } from '@/stores/user';
import { UserResponseDtoReadable } from '@/types/api/types.gen';
import { FitnessGoal } from '@/types/fitness-goals';
import { FullTheme } from '@/types/theme';

export default function FitnessGoalsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>([]);
  const { mutate: updateFitnessGoals } = useUpdateFitnessGoals();
  const updateUserInfo = useUserStore((s) => s.updateUserInfo);
  const router = useRouter();

  const userGoals = useUserStore(
    (s) => s?.user?.user?.person?.fitnessGoalTypes,
  );

  const { data: goalsData = [] } = useGetAllFitnessGoalTypes();

  useEffect(() => {
    if (!userGoals?.length || !goalsData.length) return;
    const ids = new Set(
      userGoals.map((g) => g?.id).filter((id): id is number => id != null),
    );
    setSelectedGoals(
      goalsData.filter((g) => g.id != null && ids.has(g.id)) as FitnessGoal[],
    );
  }, [userGoals, goalsData]);

  const goals = goalsData.filter(
    (g) => g != null && g.id != null,
  ) as FitnessGoal[];

  const toggleGoal = (goal: FitnessGoal) => {
    setSelectedGoals((prev) => {
      const exists = prev.some((g) => g.id === goal.id);
      if (exists) {
        return prev.filter((g) => g.id !== goal.id);
      } else {
        return [...prev, goal];
      }
    });
  };

  const handleUpdate = useCallback(() => {
    updateFitnessGoals(
      {
        fitnessGoalTypeIds: selectedGoals.map((goal) => goal.id),
      },
      {
        onSuccess: async (response) => {
          if (response?.user)
            await updateUserInfo(response.user as UserResponseDtoReadable);
          router.back();
        },
      },
    );
  }, [selectedGoals, updateFitnessGoals, updateUserInfo, router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <PageContainer
      title="Objetivos Fitness"
      subheader="Selecciona tus metas para recomendaciones personalizadas"
      style={styles.pageStyle}
      contentPaddingBottom={220}
    >
      <AppText style={styles.subheader}>
        Puedes elegir varios objetivos.
      </AppText>

      <View style={styles.cardList}>
        {goals.map((goal) => (
          <SelectableCard
            key={`${goal.id}-fitness-goal-option`}
            icon={goal.icon ?? 'fitness'}
            title={goal.name ?? ''}
            description={goal.description ?? ''}
            selected={selectedGoals.some((g) => g.id === goal.id)}
            onPress={() => toggleGoal(goal)}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        <Button
          type="secondary"
          onPress={handleCancel}
          label="Cancelar"
          style={styles.buttonFlex}
        />
        <Button
          onPress={handleUpdate}
          label="Actualizar"
          style={styles.buttonFlex}
        />
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {
      rowGap: 16,
    },
    subheader: {
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: 8,
    },
    cardList: {
      rowGap: 12,
      marginBottom: 8,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    buttonFlex: {
      flex: 1,
    },
  });
