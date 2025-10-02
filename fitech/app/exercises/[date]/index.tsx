import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

import { useGetDailyWorkouts } from '@/app/api/queries/use-get-user-workouts';
import { AppText } from '@/app/components/AppText';
import PageContainer from '@/app/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import {
  CreateExerciseWithSetsRequest,
  ExerciseSetDto,
  WorkoutSessionDto,
} from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

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

  const [sessions, setSessions] = useState<WorkoutSessionDto[]>([]);

  const [showForm, setShowForm] = useState<
    null | { mode: 'add' } | { mode: 'edit'; session: WorkoutSessionDto }
  >(null);

  const { data: dailyData, isLoading } = useGetDailyWorkouts(date);

  const title = `Entrenamientos del ${formatDateLongEs(date!)}`;
  const exerciseCount = sessions.length;

  useEffect(() => {
    if (!isLoading && dailyData) {
      setSessions(dailyData || []);
    }
  }, [dailyData]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await fetch(`https://appfitech.com/v1/app/workouts/exercises/${id}`, {
      method: 'DELETE',
    });
    // await fetchDay();
  };

  const handleCreate = async (payload: {
    name: string;
    muscleGroup?: string;
    notes?: string;
    sets: { repetitions: number; weightKg?: number }[];
  }) => {
    const req: CreateExerciseWithSetsRequest = {
      exerciseName: payload.name,
      workoutDate: String(date),
      muscleGroup: payload.muscleGroup,
      exerciseNotes: payload.notes,
      sets: payload.sets.map((s, i) => ({
        setNumber: i + 1,
        repetitions: s.repetitions,
        weightKg: s.weightKg,
      })),
    };
    await fetch('https://appfitech.com/v1/app/workouts/exercises/with-sets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    setShowForm(null);
    // await fetchDay();
  };

  const handleEdit = async (
    id: number,
    payload: {
      name: string;
      muscleGroup?: string;
      notes?: string;
      sets: { repetitions: number; weightKg?: number }[];
    },
  ) => {
    const req: CreateExerciseWithSetsRequest = {
      exerciseName: payload.name,
      workoutDate: String(date),
      muscleGroup: payload.muscleGroup,
      exerciseNotes: payload.notes,
      sets: payload.sets.map((s, i) => ({
        setNumber: i + 1,
        repetitions: s.repetitions,
        weightKg: s.weightKg,
      })),
    };
    await fetch(
      `https://appfitech.com/v1/app/workouts/exercises/${id}/with-sets`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      },
    );
    setShowForm(null);
    // await fetchDay();
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Detalle', headerShown: false }} />
      <PageContainer style={{ padding: 16 }}>
        <AppText style={styles.headerTitle}>{title}</AppText>

        <View style={styles.summaryRow}>
          <SummaryPill
            icon="🏋️"
            label={`${exerciseCount} ${exerciseCount === 1 ? 'ejercicio' : 'ejercicios'}`}
          />
        </View>

        <FlatList
          data={sessions}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <ExerciseCard
              session={item}
              theme={theme}
              onDelete={() => handleDelete(item.id)}
              onEdit={() => setShowForm({ mode: 'edit', session: item })}
            />
          )}
          ListEmptyComponent={
            !isLoading ? (
              <AppText style={{ opacity: 0.7, marginTop: 12 }}>
                No hay ejercicios para este día.
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
          <Pressable
            style={[styles.button, styles.btnPrimary]}
            onPress={() => setShowForm({ mode: 'add' })}
          >
            <AppText style={[styles.buttonText, { color: theme.dark100 }]}>
              + Agregar Ejercicio
            </AppText>
          </Pressable>
        </View>
      </PageContainer>

      {showForm && (
        <AddEditExerciseModal
          mode={showForm.mode}
          initial={showForm.mode === 'edit' ? showForm.session : undefined}
          onClose={() => setShowForm(null)}
          onSave={async (payload) => {
            if (showForm.mode === 'add') return handleCreate(payload);
            return handleEdit(showForm.session!.id!, payload);
          }}
          theme={theme}
          dateISO={String(date)}
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

function ExerciseCard({
  session,
  theme,
  onDelete,
  onEdit,
}: {
  session: WorkoutSessionDto;
  theme: FullTheme;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const sets = (session.exerciseSets || []) as ExerciseSetDto[];
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
        <AppText style={{ fontSize: 18, fontWeight: '700' }}>
          {session.exerciseName}
        </AppText>
        {!!session.muscleGroup && <Badge label={session.muscleGroup} />}
      </View>

      <View style={{ marginTop: 8 }}>
        {sets.map((s, idx) => (
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
        <Pressable onPress={onEdit}>
          <AppText style={{ color: '#1A73E8', fontWeight: '700' }}>
            ✎ Editar
          </AppText>
        </Pressable>
        <Pressable onPress={() => onDelete()}>
          <AppText style={{ color: '#D9534F', fontWeight: '700' }}>
            🗑️ Eliminar
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

function AddEditExerciseModal({
  mode,
  initial,
  onClose,
  onSave,
  theme,
  dateISO,
}: {
  mode: 'add' | 'edit';
  initial?: WorkoutSessionDto;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    muscleGroup?: string;
    notes?: string;
    sets: { repetitions: number; weightKg?: number }[];
  }) => void;
  theme: FullTheme;
  dateISO: string;
}) {
  const [name, setName] = useState(initial?.exerciseName || '');
  const [muscleGroup, setMuscleGroup] = useState<string | undefined>(
    initial?.muscleGroup || undefined,
  );
  const [notes, setNotes] = useState(initial?.exerciseNotes || '');
  const [sets, setSets] = useState<
    { repetitions: number; weightKg?: number }[]
  >(
    (initial?.exerciseSets || [])?.map((s) => ({
      repetitions: s.repetitions ?? 10,
      weightKg: s.weightKg,
    })) || [{ repetitions: 10 }],
  );

  const styles = getStyles(theme);
  const addSet = () => setSets((prev) => [...prev, { repetitions: 10 }]);
  const removeSet = (idx: number) =>
    setSets((prev) => prev.filter((_, i) => i !== idx));
  const updateSet = (
    idx: number,
    field: 'repetitions' | 'weightKg',
    value: string,
  ) => {
    setSets((prev) => {
      const next = [...prev];
      const num = value ? Number(value) : undefined;
      next[idx] = {
        ...next[idx],
        [field]: field === 'repetitions' ? Number(value || 0) : num,
      } as any;
      return next;
    });
  };

  const canSave =
    name.trim().length > 0 &&
    sets.length > 0 &&
    sets.every((s) => (s.repetitions ?? 0) > 0);

  return (
    <Modal animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.modalOverlay}
      >
        <View style={styles.modalCard}>
          <AppText style={styles.modalTitle}>
            {mode === 'add' ? '+ Agregar Ejercicio' : 'Editar Ejercicio'} -{' '}
            {formatDateLongEs(dateISO)}
          </AppText>

          <TextInput
            placeholder="Nombre del Ejercicio*"
            placeholderTextColor="#808080"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Grupo Muscular"
            placeholderTextColor="#808080"
            value={muscleGroup || ''}
            onChangeText={setMuscleGroup}
            style={styles.input}
          />

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
                value={String(s.repetitions || '')}
                onChangeText={(t) => updateSet(idx, 'repetitions', t)}
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

          <TextInput
            placeholder="Notas (opcional)"
            placeholderTextColor="#808080"
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, { height: 80 }]}
            multiline
          />

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
                onSave({ name, muscleGroup, notes: notes || undefined, sets })
              }
              style={[
                styles.button,
                styles.btnPrimary,
                !canSave && { opacity: 0.5 },
              ]}
              disabled={!canSave}
            >
              <AppText style={[styles.buttonText, { color: theme.dark100 }]}>
                {mode === 'add' ? 'Guardar Ejercicio' : 'Guardar Cambios'}
              </AppText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
