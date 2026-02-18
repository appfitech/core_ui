import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { useGetDailyWorkouts } from '@/app/api/queries/workouts/use-get-user-workouts';
import { AppText } from '@/app/components/AppText';
import { AddEditExerciseModal } from '@/app/components/modules/AddEditWorkoutModal';
import { ExerciseCard } from '@/app/components/modules/ExerciseCard';
import PageContainer from '@/app/components/PageContainer';
import { Tag } from '@/app/components/Tag';
import { useTheme } from '@/contexts/ThemeContext';
import { useOpenable } from '@/hooks/use-openable';
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

  const exerciseCount = sessions?.length;

  const handleCallback = useCallback(() => {
    close();
    refetchDailyWorkouts();
  }, []);

  return (
    <>
      <PageContainer
        header={moment(date).format('DD/MM/YYYY')}
        subheader={'Entrenamientos registrados'}
        style={styles.pageStyle}
        hasBottomPadding={false}
      >
        {exerciseCount && (
          <View style={styles.summaryRow}>
            <Tag
              backgroundColor={theme.primary}
              textColor={theme.background}
              label={`🏋️ ${exerciseCount} ejercicio${exerciseCount > 1 ? 's' : ''}`}
            />
          </View>
        )}
        <FlatList
          style={styles.listStyle}
          data={sessions}
          keyExtractor={(item) => `exercise-card-${date}-${item.id}`}
          contentContainerStyle={styles.listContent}
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
    pageStyle: { padding: 16, rowGap: 10, flex: 1 },
    summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    listStyle: { flex: 1 },
    listContent: { paddingBottom: 120 },
    cardWrapper: { marginBottom: 12 },
    emptyText: {
      fontSize: 19,
      color: theme.dark500,
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
      backgroundColor: theme.background,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    btnPrimary: { backgroundColor: theme.backgroundInverted },
    btnGhost: { backgroundColor: '#EFEFEF' },
    buttonText: { fontSize: 16, fontWeight: '700' },
    buttonTextGhost: { color: theme.textPrimary },
    buttonTextPrimary: { color: theme.dark100 },
  });
