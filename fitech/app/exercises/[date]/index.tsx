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
        style={{ padding: 16, rowGap: 10, flex: 1 }}
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
          style={{ flex: 1 }}
          data={sessions}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <ExerciseCard
                session={item}
                refetchCallback={refetchDailyWorkouts}
              />
            </View>
          )}
          ListEmptyComponent={
            !isLoading ? (
              <AppText
                style={{
                  fontSize: 19,
                  color: theme.dark500,
                  marginTop: 40,
                  textAlign: 'center',
                }}
              >
                Hoy no tienes ejercicios registrados. Añade una rutina y sigue
                sumando progreso. 🏋️
              </AppText>
            ) : null
          }
        />

        <View style={styles.bottomBar}>
          <Pressable
            style={[styles.button, styles.btnGhost]}
            onPress={() => router.back()}
          >
            <AppText style={[styles.buttonText, { color: theme.textPrimary }]}>
              Cerrar
            </AppText>
          </Pressable>
          <Pressable style={[styles.button, styles.btnPrimary]} onPress={open}>
            <AppText style={[styles.buttonText, { color: theme.dark100 }]}>
              + Agregar Ejercicio
            </AppText>
          </Pressable>
        </View>
      </PageContainer>

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
    headerTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
    summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'flex-end',
    },
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
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    modalFooter: { flexDirection: 'row', gap: 10, marginTop: 8 },
  });
