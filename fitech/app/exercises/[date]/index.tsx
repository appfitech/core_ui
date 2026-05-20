import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { AddEditExerciseModal } from '@/components/modules/AddEditWorkoutModal';
import { ExerciseCard } from '@/components/modules/ExerciseCard';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { useTheme } from '@/contexts/ThemeContext';
import { useOpenable } from '@/hooks/use-openable';
import { useGetDailyWorkouts } from '@/lib/api/queries/workouts/use-get-user-workouts';
import { FullTheme } from '@/types/theme';

export default function WorkoutDayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { isOpen, open, close } = useOpenable();

  const {
    data: sessions,
    isLoading,
    refetch: refetchDailyWorkouts,
  } = useGetDailyWorkouts(date);

  const exerciseCount = sessions?.length ?? 0;

  const handleCallback = useCallback(() => {
    close();
    refetchDailyWorkouts();
  }, [close, refetchDailyWorkouts]);

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
        subheader="Entrenamientos registrados"
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
            !isLoading ? (
              <AppText style={styles.emptyText}>
                Hoy no tienes ejercicios registrados. Añade una rutina y sigue
                sumando progreso. 🏋️
              </AppText>
            ) : null
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
        <Pressable style={[styles.button, styles.btnPrimary]} onPress={open}>
          <AppText style={[styles.buttonText, styles.buttonTextPrimary]}>
            + Agregar Ejercicio
          </AppText>
        </Pressable>
      </View>
      {isOpen && (
        <AddEditExerciseModal
          mode={'add'}
          initial={undefined}
          onClose={handleCallback}
          refetchCallback={handleCallback}
          dateISO={String(date)}
        />
      )}
    </>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: { padding: 16, rowGap: 10 },
    summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    listStyle: { flex: 1 },
    listContent: { paddingBottom: 180 },
    cardWrapper: { marginBottom: 12 },
    emptyText: {
      fontSize: 19,
      color: theme.text.disabled,
      marginTop: 40,
      textAlign: 'center',
    },
    bottomBar: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 140,
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
