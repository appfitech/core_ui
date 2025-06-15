import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUpdateFitnessGoals } from '../api/mutations/use-update-fitness-goals';
import { useGetAllFitnessGoalTypes } from '../api/queries/use-get-all-fitness-goal-types';
import { BackButton } from '../components/BackButton';
import { SelectableCard } from '../components/SelectableCard';
import { useUserStore } from '../stores/user';
import { FitnessGoal } from '../types/FitnessGoal';

export default function FitnessGoalsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>([]);
  const { mutate: updateFitnessGoals } = useUpdateFitnessGoals();
  const updateUserInfo = useUserStore((s) => s.updateUserInfo);
  const router = useRouter();

  const userGoals = useUserStore(
    (s) => s?.user?.user?.person?.fitnessGoalTypes,
  );

  const { data: goals = [] } = useGetAllFitnessGoalTypes();

  useEffect(() => {
    if (userGoals?.length) {
      setSelectedGoals(userGoals);
    }
  }, [userGoals]);

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
        fitnessGoalTypeIds: selectedGoals?.map((goal) => goal.id),
      },
      {
        onSuccess: async (response) => {
          console.log('[K] response', response);
          await updateUserInfo(response);
          router.back();
        },
      },
    );
  }, [selectedGoals]);

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 60,
          minHeight: '100%',
        },
      ]}
    >
      <View style={{ marginTop: 0, marginBottom: 60 }}>
        <BackButton />
      </View>
      <Text style={styles.header}>Objetivos Fitness</Text>
      <Text style={styles.subheader}>
        Selecciona tus metas para recibir recomendaciones personalizadas (puedes
        elegir varios)
      </Text>

      {goals.map((goal) => (
        <SelectableCard
          key={`${goal.id}-fitness-goal-option`}
          icon={goal.icon}
          title={goal.name}
          description={goal.description}
          selected={selectedGoals.some((g) => g.id === goal.id)}
          onPress={() => toggleGoal(goal)}
        />
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F4C81',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 12,
    color: '#555',
    marginBottom: 36,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
  },
  cancelText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#444',
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#0F4C81',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  updateText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
});
