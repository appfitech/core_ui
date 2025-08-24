export type MuscleGroup =
  | 'Pecho'
  | 'Espalda'
  | 'Hombros'
  | 'Brazos'
  | 'Piernas'
  | 'Core'
  | 'Glúteos'
  | 'Cuerpo Completo'
  | 'Cardio';

export type SetEntry = { reps: number; weightKg?: number };
export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: SetEntry[];
  notes?: string;
};

export type WorkoutDay = {
  dateISO: string; // 'YYYY-MM-DD'
  durationMin: number; // total min per day
  exercises: Exercise[];
  dayNotes?: string;
};

const mock: Record<string, WorkoutDay> = {
  // matches your screenshots style
  '2025-08-18': {
    dateISO: '2025-08-18',
    durationMin: 30,
    exercises: [
      {
        id: 'ex-1',
        name: 'Correr en cinta',
        muscleGroup: 'Cardio',
        sets: [{ reps: 1 }],
        notes: 'Cardio ligero',
      },
    ],
  },
  '2025-08-21': {
    dateISO: '2025-08-21',
    durationMin: 60,
    exercises: [
      {
        id: 'ex-2',
        name: 'Press de banca',
        muscleGroup: 'Pecho',
        sets: [
          { reps: 12, weightKg: 80 },
          { reps: 10, weightKg: 85 },
          { reps: 8, weightKg: 90 },
        ],
      },
      {
        id: 'ex-3',
        name: 'Sentadillas',
        muscleGroup: 'Piernas',
        sets: [{ reps: 10, weightKg: 60 }],
      },
    ],
  },
  '2025-08-22': {
    dateISO: '2025-08-22',
    durationMin: 45,
    exercises: [
      {
        id: 'ex-4',
        name: 'Dominadas',
        muscleGroup: 'Espalda',
        sets: [{ reps: 8 }, { reps: 6 }, { reps: 5 }],
      },
      {
        id: 'ex-5',
        name: 'Curl de bíceps',
        muscleGroup: 'Brazos',
        sets: [{ reps: 12, weightKg: 12 }],
      },
    ],
  },
  '2025-08-23': {
    dateISO: '2025-08-23',
    durationMin: 50,
    exercises: [
      {
        id: 'ex-6',
        name: 'Remo con barra',
        muscleGroup: 'Espalda',
        sets: [{ reps: 10, weightKg: 45 }],
      },
      {
        id: 'ex-7',
        name: 'Press militar',
        muscleGroup: 'Hombros',
        sets: [{ reps: 8, weightKg: 30 }],
      },
    ],
  },
  '2025-08-02': {
    dateISO: '2025-08-02',
    durationMin: 35,
    exercises: [
      {
        id: 'ex-8',
        name: 'Abdominales',
        muscleGroup: 'Core',
        sets: [{ reps: 20 }],
      },
    ],
  },
};

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Pecho',
  'Espalda',
  'Hombros',
  'Brazos',
  'Piernas',
  'Core',
  'Glúteos',
  'Cuerpo Completo',
  'Cardio',
];

export function listAll(): Record<string, WorkoutDay> {
  return mock;
}

export function getDay(dateISO: string): WorkoutDay {
  return mock[dateISO] ?? { dateISO, durationMin: 0, exercises: [] };
}

export function upsertDay(day: WorkoutDay) {
  mock[day.dateISO] = day;
}

export function addExercise(
  dateISO: string,
  ex: Omit<Exercise, 'id'>,
): WorkoutDay {
  const current = getDay(dateISO);
  const newEx: Exercise = { id: `ex-${Date.now()}`, ...ex };
  const updated: WorkoutDay = {
    ...current,
    // naive duration heuristic if not set: +10min per exercise, +2 per set
    durationMin: current.durationMin || 10 + (ex.sets?.length ?? 0) * 2,
    exercises: [...current.exercises, newEx],
  };
  upsertDay(updated);
  return updated;
}
