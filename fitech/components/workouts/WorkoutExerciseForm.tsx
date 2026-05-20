import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { TextInput } from '@/components/TextInput';
import { MUSCLE_GROUPS } from '@/constants/exercise';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  formatRepsValue,
  getWeightInputDisplay,
  normalizeRepsInputText,
  normalizeWeightInputText,
  type WorkoutSetFormRow,
} from '@/lib/workouts/exercise-form';
import { FullTheme } from '@/types/theme';

type Props = {
  name: string;
  onNameChange: (value: string) => void;
  muscleGroup: string | undefined;
  onMuscleGroupChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  sets: WorkoutSetFormRow[];
  onAddSet: () => void;
  onRemoveSet: (index: number) => void;
  onUpdateSet: (
    index: number,
    field: 'repetitions' | 'weightKg',
    value: string,
  ) => void;
};

export function WorkoutExerciseForm({
  name,
  onNameChange,
  muscleGroup,
  onMuscleGroupChange,
  notes,
  onNotesChange,
  sets,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.form}>
      <TextInput
        label="Nombre del ejercicio"
        placeholder="Ej. Press banca"
        value={name}
        onChangeText={onNameChange}
      />

      <Dropdown
        label="Grupo muscular"
        placeholder="Selecciona un grupo"
        options={MUSCLE_GROUPS.map((item) => ({
          label: item,
          value: item,
        }))}
        zIndex={6000}
        onChange={onMuscleGroupChange}
        value={muscleGroup}
      />

      <TextInput
        label="Notas"
        required={false}
        placeholder="Opcional — técnica, RPE, etc."
        value={notes}
        onChangeText={onNotesChange}
        multiline
      />

      <View style={styles.seriesSection}>
        <AppText variant="sectionTitle" style={styles.seriesTitle}>
          Series
        </AppText>
        <Button
          type="secondary"
          label="+ Añadir serie"
          onPress={onAddSet}
          style={styles.addSetButton}
          buttonStyle={styles.addSetButtonInner}
        />
      </View>

      {sets.map((set, idx) => (
        <View key={`set-${idx}`} style={styles.setCard}>
          <View style={styles.setCardHeader}>
            <AppText style={styles.setNumber}>Serie {idx + 1}</AppText>
            <Pressable
              onPress={() => onRemoveSet(idx)}
              disabled={sets.length <= 1}
              hitSlop={10}
              accessibilityLabel={`Eliminar serie ${idx + 1}`}
              style={({ pressed }) => [
                styles.removeSetButton,
                sets.length <= 1 && styles.removeSetButtonDisabled,
                pressed && sets.length > 1 && styles.removeSetButtonPressed,
              ]}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color={
                  sets.length <= 1
                    ? theme.text.disabled
                    : theme.status.error.icon
                }
              />
            </Pressable>
          </View>

          <View style={styles.setInputsRow}>
            <View style={styles.setField}>
              <TextInput
                label="Repeticiones"
                keyboardType="number-pad"
                placeholder="0"
                value={formatRepsValue(set.repetitions)}
                onChangeText={(text) =>
                  onUpdateSet(idx, 'repetitions', normalizeRepsInputText(text))
                }
              />
            </View>
            <View style={styles.setField}>
              <TextInput
                label="Peso (kg)"
                keyboardType="decimal-pad"
                placeholder="0"
                value={getWeightInputDisplay(set)}
                onChangeText={(text) =>
                  onUpdateSet(idx, 'weightKg', normalizeWeightInputText(text))
                }
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    form: {
      rowGap: 16,
    },
    seriesSection: {
      marginTop: 8,
      rowGap: 12,
    },
    seriesTitle: {
      color: theme.text.primary,
    },
    addSetButton: {
      alignSelf: 'stretch',
    },
    addSetButtonInner: {
      paddingVertical: 12,
    },
    setCard: {
      borderWidth: 1,
      borderColor: theme.border.default,
      backgroundColor: theme.background.card,
      borderRadius: 12,
      padding: 14,
      rowGap: 12,
    },
    setCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    setNumber: {
      ...text.bodySemibold,
      color: theme.text.primary,
    },
    removeSetButton: {
      padding: 4,
    },
    removeSetButtonPressed: {
      opacity: 0.7,
    },
    removeSetButtonDisabled: {
      opacity: 0.4,
    },
    setInputsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    setField: {
      flex: 1,
      minWidth: 0,
    },
  });
};
