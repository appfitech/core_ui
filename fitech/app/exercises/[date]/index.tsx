import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { ListEmptyState } from '@/components/list/ListEmptyState';
import { ExerciseCard } from '@/components/modules/ExerciseCard';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetDailyWorkouts } from '@/lib/api/queries/workouts/use-get-user-workouts';
import { AppTheme } from '@/types/theme';

export default function WorkoutDayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { exercisesScreen: copy } = TRANSLATIONS;
  const dayCopy = copy.workoutDay;

  const {
    data: sessions,
    isLoading,
    refetch: refetchDailyWorkouts,
  } = useGetDailyWorkouts(date);

  const exerciseCount = sessions?.length ?? 0;

  useFocusEffect(
    useCallback(() => {
      void refetchDailyWorkouts();
    }, [refetchDailyWorkouts]),
  );

  const openAddExercise = useCallback(() => {
    router.push({
      pathname: '/exercises/[date]/workout',
      params: { date: String(date), mode: 'add' },
    });
  }, [date, router]);

  const listHeader = useCallback(() => {
    if (exerciseCount <= 0) return null;

    return (
      <View style={styles.summaryRow}>
        <Tag
          backgroundColor={theme.brand.primary}
          textColor={theme.background.app}
          label={`🏋️ ${exerciseCount} ejercicio${exerciseCount > 1 ? 's' : ''}`}
        />
      </View>
    );
  }, [exerciseCount, styles.summaryRow, theme]);

  return (
    <>
      <PageContainer
        title={moment(date).format('DD/MM/YYYY')}
        subheader={dayCopy.subheader}
        disableScroll
        style={styles.pageStyle}
        hasBottomPadding={false}
        includeTabBarPadding={false}
      >
        <FlatList
          style={styles.listStyle}
          data={sessions ?? []}
          keyExtractor={(item) => `exercise-card-${date}-${item.id}`}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ExerciseCard
                session={item}
                refetchCallback={refetchDailyWorkouts}
              />
            </View>
          )}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={theme.brand.primary} />
                <AppText style={styles.loadingText}>{dayCopy.loading}</AppText>
              </View>
            ) : (
              <ListEmptyState
                icon="barbell-outline"
                title={dayCopy.emptyTitle}
                hint={dayCopy.emptyHint}
              />
            )
          }
        />
      </PageContainer>
      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.button, styles.btnGhost]}
          onPress={() => router.back()}
        >
          <AppText style={[styles.buttonText, styles.buttonTextGhost]}>
            Cerrar
          </AppText>
        </Pressable>
        <Pressable
          style={[styles.button, styles.btnPrimary]}
          onPress={openAddExercise}
        >
          <AppText style={[styles.buttonText, styles.buttonTextPrimary]}>
            + Ejercicio
          </AppText>
        </Pressable>
      </View>
    </>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: {
      paddingHorizontal: 16,
      paddingBottom: 0,
      rowGap: 10,
    },
    summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    listStyle: { flex: 1 },
    listContent: { paddingBottom: 100 },
    cardWrapper: { marginBottom: 12 },
    loadingWrap: {
      paddingVertical: 48,
      alignItems: 'center',
      rowGap: 12,
    },
    loadingText: {
      ...text.nav,
      color: theme.text.secondary,
    },
    bottomBar: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 24,
      flexDirection: 'row',
      gap: 12,
      paddingTop: 20,
      backgroundColor: theme.background.app,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    btnPrimary: { backgroundColor: theme.brand.primary },
    btnGhost: { backgroundColor: theme.background.input },
    buttonText: { fontSize: 16, fontWeight: '700' },
    buttonTextGhost: { color: theme.text.primary },
    buttonTextPrimary: { color: theme.background.app },
  });
};
