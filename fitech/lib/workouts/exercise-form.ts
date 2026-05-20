import { ExerciseSetDto } from '@/types/api/types.gen';

/** Max sets listed on exercise cards before showing an overflow hint. */
export const MAX_EXERCISE_CARD_SETS_VISIBLE = 3;

const WEIGHT_DECIMAL_PLACES = 2;

/** Strip non-digits while typing reps (integers only, no decimals). */
export function normalizeRepsInputText(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Allow digits with at most one decimal separator and 2 fractional digits.
 * Accepts comma or dot; stored/displayed with dot while typing.
 */
export function normalizeWeightInputText(value: string): string {
  const withDot = value.replace(',', '.');
  const sanitized = withDot.replace(/[^\d.]/g, '');

  const dotIndex = sanitized.indexOf('.');
  if (dotIndex === -1) {
    return sanitized;
  }

  const intPart = sanitized.slice(0, dotIndex);
  const fracPart = sanitized
    .slice(dotIndex + 1)
    .replace(/\./g, '')
    .slice(0, WEIGHT_DECIMAL_PLACES);

  return `${intPart}.${fracPart}`;
}

/** Whole number only. */
export function roundReps(value: number): number {
  return Math.trunc(value);
}

/** At most 2 decimal places. */
export function roundWeightKg(value: number): number {
  const factor = 10 ** WEIGHT_DECIMAL_PLACES;
  return Math.round(value * factor) / factor;
}

export function parseRepsInput(value: string): number | undefined {
  const trimmed = normalizeRepsInputText(value);
  if (!trimmed) return undefined;
  const n = parseInt(trimmed, 10);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return roundReps(n);
}

export function parseWeightInput(value: string): number | undefined {
  const normalized = normalizeWeightInputText(value);
  if (!normalized || normalized === '.') return undefined;
  const n = Number(normalized);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return roundWeightKg(n);
}

/** Normalize API / stored values when loading a set into the form. */
export function sanitizeExerciseSet(set: ExerciseSetDto): ExerciseSetDto {
  return {
    ...set,
    repetitions:
      typeof set.repetitions === 'number' && set.repetitions > 0
        ? roundReps(set.repetitions)
        : undefined,
    weightKg:
      typeof set.weightKg === 'number' && set.weightKg > 0
        ? roundWeightKg(set.weightKg)
        : undefined,
  };
}

export function formatRepsValue(reps: number | undefined): string {
  if (reps == null || reps <= 0) return '';
  return String(roundReps(reps));
}

export function formatWeightValue(weight: number | undefined): string {
  if (weight == null || weight <= 0) return '';
  return String(roundWeightKg(weight));
}

/** Display on cards — integer reps. */
export function formatRepsDisplay(reps: number): string {
  const n = roundReps(reps);
  return n === 1 ? '1 rep' : `${n} reps`;
}

/** Display on cards — at most 2 decimals. */
export function formatWeightDisplay(weight: number): string {
  const rounded = roundWeightKg(weight);
  if (rounded % 1 === 0) {
    return String(Math.trunc(rounded));
  }
  return rounded
    .toFixed(WEIGHT_DECIMAL_PLACES)
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.$/, '');
}

function isValidReps(reps: number | undefined): reps is number {
  return typeof reps === 'number' && Number.isInteger(reps) && reps > 0;
}

function isValidWeight(weight: number | undefined): weight is number {
  return (
    typeof weight === 'number' &&
    weight > 0 &&
    roundWeightKg(weight) === weight
  );
}

export function isExerciseFormValid(
  name: string,
  muscleGroup: string | undefined,
  sets: ExerciseSetDto[],
): boolean {
  return (
    name.trim().length > 0 &&
    Boolean(muscleGroup?.trim()) &&
    sets.length > 0 &&
    sets.every((s) => isValidReps(s.repetitions) && isValidWeight(s.weightKg))
  );
}

export function createEmptySet(): ExerciseSetDto {
  return { repetitions: undefined, weightKg: undefined };
}
