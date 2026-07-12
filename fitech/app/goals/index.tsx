import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { FooterActions } from '@/components/FooterActions';
import PageContainer from '@/components/PageContainer';
import { SelectableCard } from '@/components/SelectableCard';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUpdateFitnessGoals } from '@/lib/api/mutations/use-update-fitness-goals';
import { useGetAllFitnessGoalTypes } from '@/lib/api/queries/use-get-all-fitness-goal-types';
import { useUserStore } from '@/stores/user';
import { UserResponseDtoReadable } from '@/types/api/types.gen';
import { FitnessGoal } from '@/types/fitness-goals';
import { AppTheme } from '@/types/theme';

export default function FitnessGoalsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { fitnessGoalsScreen: copy } = TRANSLATIONS;
  const { showAlert } = useAlert();

  const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>([]);
  const { mutate: updateFitnessGoals, isPending: isSaving } =
    useUpdateFitnessGoals();
  const updateUserInfo = useUserStore((s) => s.updateUserInfo);
  const router = useRouter();

  const userGoals = useUserStore(
    (s) => s?.user?.user?.person?.fitnessGoalTypes,
  );

  const {
    data: goalsData = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllFitnessGoalTypes();

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
          showAlert({
            title: copy.successTitle,
            message: copy.successMessage,
          });
        },
        onError: () => {
          showAlert({
            title: copy.errorTitle,
            message: copy.errorMessage,
          });
        },
      },
    );
  }, [
    selectedGoals,
    updateFitnessGoals,
    updateUserInfo,
    showAlert,
    copy.successTitle,
    copy.successMessage,
    copy.errorTitle,
    copy.errorMessage,
  ]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <PageContainer
      title={copy.title}
      subheader={copy.subheader}
      style={styles.pageStyle}
      includeTabBarPadding={false}
      hasBottomPadding={false}
      footer={
        <FooterActions
          primaryLabel={copy.updateButton}
          primaryLoadingLabel={TRANSLATIONS.common.updating}
          onPrimary={handleUpdate}
          cancelLabel={copy.cancelButton}
          onCancel={handleCancel}
          primaryLoading={isSaving}
          cancelDisabled={isSaving || isLoading}
          primaryDisabled={isLoading || goals.length === 0}
        />
      }
    >
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.brand.primary} />
        </View>
      ) : (
        <>
          {isError ? (
            <Pressable onPress={() => refetch()}>
              <AppText style={styles.errorHint}>
                No se pudieron cargar los objetivos. Toca para reintentar.
              </AppText>
            </Pressable>
          ) : null}

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
        </>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: {
      rowGap: 20,
      paddingBottom: 0,
    },
    cardList: {
      rowGap: 12,
    },
    loadingWrap: {
      paddingVertical: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorHint: {
      ...text.small,
      color: theme.status.error.text,
      textAlign: 'center',
      paddingVertical: 8,
      marginBottom: 4,
    },
  });
};
