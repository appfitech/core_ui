import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '@/app/components/AppText';
import PageContainer from '@/app/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import {
  addExercise,
  type Exercise,
  getDay,
  MUSCLE_GROUPS,
  type MuscleGroup,
  type SetEntry,
  type WorkoutDay,
} from '../workoutStore';

function formatDateLongEs(dISO: string) {
  try {
    const d = new Date(dISO + 'T00:00:00');
    return new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dISO;
  }
}

export default function WorkoutDayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [day, setDay] = useState<WorkoutDay>(() => getDay(date!));
  const [showForm, setShowForm] = useState(false);

  const exerciseCount = day.exercises.length;
  const title = `Ejercicios del ${formatDateLongEs(day.dateISO)}`;

  const handleSaveExercise = (payload: {
    muscleGroup: MuscleGroup;
    name: string;
    sets: SetEntry[];
    notes?: string;
  }) => {
    const updated = addExercise(day.dateISO, payload);
    setDay(updated);
    setShowForm(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Detalle', headerShown: false }} />
      <PageContainer style={{ padding: 16 }}>
        <AppText style={styles.headerTitle}>{title}</AppText>

        <View style={styles.summaryRow}>
          <SummaryPill icon="🕒" label={`${day.durationMin} min`} />
          <SummaryPill
            icon="🏋️"
            label={`${exerciseCount} ${exerciseCount === 1 ? 'ejercicio' : 'ejercicios'}`}
          />
        </View>

        <FlatList
          data={day.exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => <ExerciseCard ex={item} theme={theme} />}
          ListEmptyComponent={
            <AppText style={{ opacity: 0.7, marginTop: 12 }}>
              No hay ejercicios para este día.
            </AppText>
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
          <Pressable
            style={[styles.button, styles.btnPrimary]}
            onPress={() => setShowForm(true)}
          >
            <AppText style={[styles.buttonText, { color: theme.dark100 }]}>
              + Agregar Ejercicio
            </AppText>
          </Pressable>
        </View>
      </PageContainer>

      {showForm && (
        <AddExerciseModal
          onClose={() => setShowForm(false)}
          onSave={handleSaveExercise}
          theme={theme}
          dateISO={day.dateISO}
        />
      )}
    </>
  );
}

function SummaryPill({ icon, label }: { icon: string; label: string }) {
  return (
    <View
      style={{
        backgroundColor: '#EAF2FF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
      }}
    >
      <AppText style={{ fontWeight: '600' }}>
        {icon} {label}
      </AppText>
    </View>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: '#4CAF50',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
      }}
    >
      <AppText style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>
        {label}
      </AppText>
    </View>
  );
}

function ExerciseCard({ ex, theme }: { ex: Exercise; theme: FullTheme }) {
  return (
    <View
      style={{
        backgroundColor: theme.backgroundPrimary,
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
        <AppText style={{ fontSize: 18, fontWeight: '700' }}>{ex.name}</AppText>
        <Badge label={ex.muscleGroup} />
      </View>

      <View style={{ marginTop: 8 }}>
        {ex.sets.map((s, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginVertical: 4,
            }}
          >
            <AppText style={{ color: '#1A73E8', fontWeight: '700' }}>
              Serie {idx + 1}:
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
                {s.reps} {s.reps === 1 ? 'repetición' : 'repeticiones'}
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

      {!!ex.notes && (
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
          <AppText>{ex.notes}</AppText>
        </View>
      )}
    </View>
  );
}

function AddExerciseModal({
  onClose,
  onSave,
  theme,
  dateISO,
}: {
  onClose: () => void;
  onSave: (payload: {
    muscleGroup: MuscleGroup;
    name: string;
    sets: SetEntry[];
    notes?: string;
  }) => void;
  theme: FullTheme;
  dateISO: string;
}) {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null);
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState<SetEntry[]>([{ reps: 10 }]);
  const [showSelect, setShowSelect] = useState(false);

  const styles = getStyles(theme);

  const addSet = () => setSets((prev) => [...prev, { reps: 10 }]);
  const removeSet = (idx: number) =>
    setSets((prev) => prev.filter((_, i) => i !== idx));
  const updateSet = (idx: number, field: keyof SetEntry, value: string) => {
    setSets((prev) => {
      const next = [...prev];
      const num = value ? Number(value) : undefined;
      next[idx] = {
        ...next[idx],
        [field]: field === 'reps' ? Number(value || 0) : num,
      };
      return next;
    });
  };

  const canSave =
    !!muscleGroup &&
    name.trim().length > 0 &&
    sets.length > 0 &&
    sets.every((s) => s.reps > 0);

  return (
    <Modal animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.modalOverlay}
      >
        <View style={styles.modalCard}>
          <AppText style={styles.modalTitle}>
            Agregar Ejercicio - {formatDateLongEs(dateISO)}
          </AppText>

          {/* Grupo muscular (custom select) */}
          <Pressable onPress={() => setShowSelect(true)} style={styles.input}>
            <AppText
              style={{ color: muscleGroup ? theme.textPrimary : '#808080' }}
            >
              {muscleGroup ?? 'Grupo Muscular*'}
            </AppText>
          </Pressable>

          {/* Nombre del ejercicio */}
          <TextInput
            placeholder="Nombre del Ejercicio*"
            placeholderTextColor="#808080"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          {/* Series */}
          <View
            style={{
              marginTop: 8,
              marginBottom: 4,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <AppText style={{ fontWeight: '700' }}>Series</AppText>
            <Pressable onPress={addSet}>
              <AppText style={{ color: '#1A73E8', fontWeight: '700' }}>
                + Añadir serie
              </AppText>
            </Pressable>
          </View>

          {sets.map((s, idx) => (
            <View key={idx} style={styles.setRow}>
              <AppText style={{ fontWeight: '600', width: 64 }}>
                Serie {idx + 1}
              </AppText>
              <TextInput
                keyboardType="numeric"
                placeholder="Repeticiones"
                placeholderTextColor="#808080"
                value={String(s.reps || '')}
                onChangeText={(t) => updateSet(idx, 'reps', t)}
                style={[styles.input, styles.inputSmall]}
              />
              <TextInput
                keyboardType="numeric"
                placeholder="Peso (kg)"
                placeholderTextColor="#808080"
                value={typeof s.weightKg === 'number' ? String(s.weightKg) : ''}
                onChangeText={(t) => updateSet(idx, 'weightKg', t)}
                style={[styles.input, styles.inputSmall]}
              />
              <Pressable
                onPress={() => removeSet(idx)}
                style={{ paddingHorizontal: 8 }}
              >
                <AppText style={{ color: '#D9534F', fontWeight: '700' }}>
                  🗑️
                </AppText>
              </Pressable>
            </View>
          ))}

          {/* Notas */}
          <TextInput
            placeholder="Notas (opcional)"
            placeholderTextColor="#808080"
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, { height: 80 }]}
            multiline
          />

          {/* Footer */}
          <View style={styles.modalFooter}>
            <Pressable
              onPress={onClose}
              style={[styles.button, styles.btnGhost]}
            >
              <AppText
                style={[styles.buttonText, { color: theme.textPrimary }]}
              >
                Cancelar
              </AppText>
            </Pressable>
            <Pressable
              onPress={() =>
                canSave &&
                onSave({
                  muscleGroup: muscleGroup!,
                  name,
                  sets,
                  notes: notes || undefined,
                })
              }
              style={[
                styles.button,
                styles.btnPrimary,
                !canSave && { opacity: 0.5 },
              ]}
              disabled={!canSave}
            >
              <AppText style={[styles.buttonText, { color: theme.dark100 }]}>
                Guardar Ejercicio
              </AppText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showSelect} transparent animationType="fade">
        <Pressable
          style={styles.selectOverlay}
          onPress={() => setShowSelect(false)}
        >
          <View style={styles.selectCard}>
            <FlatList
              data={MUSCLE_GROUPS}
              keyExtractor={(it) => it}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setMuscleGroup(item);
                    setShowSelect(false);
                  }}
                  style={({ pressed }) => [
                    {
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      backgroundColor: pressed ? '#F3F4F6' : 'white',
                    },
                  ]}
                >
                  <AppText>{item}</AppText>
                </Pressable>
              )}
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: '#EEE' }} />
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </Modal>
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
      bottom: 150,
      flexDirection: 'row',
      gap: 12,
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

    // Modal
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

    // Select
    selectOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      padding: 24,
    },
    selectCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      overflow: 'hidden',
      maxHeight: '70%',
    },
  });
