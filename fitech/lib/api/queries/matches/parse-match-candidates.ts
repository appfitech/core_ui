import {
  GymBroCandidateResponseDto,
  GymCrushCandidateResponseDto,
} from '@/types/api/types.gen';

export type MatchCandidate =
  | GymBroCandidateResponseDto
  | GymCrushCandidateResponseDto;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function toString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim();
  return undefined;
}

function resolveProfilePhotoUrl(
  record: Record<string, unknown>,
  person: Record<string, unknown> | null,
): string | undefined {
  const direct =
    toString(record.profilePhotoUrl) ??
    toString(record.profileImageUrl) ??
    toString(person?.profilePhotoUrl) ??
    toString(person?.profileImageUrl);

  if (direct) return direct;

  const photoId =
    toNumber(record.profilePhotoId) ?? toNumber(person?.profilePhotoId);

  if (photoId != null) {
    return `/v1/app/file-upload/view/${photoId}`;
  }

  return undefined;
}

/** Normalize API / testing payloads into candidate DTO shape. */
export function normalizeMatchCandidate(raw: unknown): MatchCandidate | null {
  const record = asRecord(raw);
  if (!record) return null;

  const person = asRecord(record.person);
  const userId =
    toNumber(record.userId) ??
    toNumber(record.id) ??
    toNumber(record.targetUserId) ??
    toNumber(person?.userId);

  if (userId == null) return null;

  const firstName =
    toString(record.firstName) ??
    toString(person?.firstName) ??
    toString(record.name);

  const lastName =
    toString(record.lastName) ?? toString(person?.lastName);

  return {
    userId,
    firstName,
    lastName,
    age: toNumber(record.age) ?? toNumber(person?.age),
    profilePhotoUrl: resolveProfilePhotoUrl(record, person),
    city: toString(record.city) ?? toString(person?.city),
    fitnessLevel:
      toString(record.fitnessLevel) ?? toString(person?.fitnessLevel),
    goals: toString(record.goals),
    bio: toString(record.bio) ?? toString(person?.bio),
    gender: toString(record.gender) ?? toString(person?.gender),
    gymBroShowBioInProfile:
      record.gymBroShowBioInProfile === true
        ? true
        : record.gymBroShowBioInProfile === false
          ? false
          : undefined,
    gymCrushShowBioInProfile:
      record.gymCrushShowBioInProfile === true
        ? true
        : record.gymCrushShowBioInProfile === false
          ? false
          : undefined,
  };
}

function mapCandidateList(items: unknown[]): MatchCandidate[] {
  const normalized: MatchCandidate[] = [];

  for (const item of items) {
    const candidate = normalizeMatchCandidate(item);
    if (candidate) normalized.push(candidate);
  }

  return normalized;
}

function extractArrayLike(value: unknown): unknown[] | null {
  if (Array.isArray(value)) return value;

  const record = asRecord(value);
  if (!record) return null;

  const arrayKeys = [
    'data',
    'requests',
    'content',
    'items',
    'pagesResult',
    'results',
  ] as const;

  for (const key of arrayKeys) {
    const nested = record[key];
    if (Array.isArray(nested)) return nested;
  }

  for (const key of arrayKeys) {
    const nested = record[key];
    const nestedRecord = asRecord(nested);
    if (nestedRecord) {
      const values = Object.values(nestedRecord);
      if (
        values.length > 0 &&
        values.every((entry) => asRecord(entry) != null)
      ) {
        return values;
      }
    }
  }

  const topLevelValues = Object.values(record);
  if (
    topLevelValues.length > 0 &&
    topLevelValues.every((entry) => asRecord(entry) != null) &&
    topLevelValues.some((entry) => {
      const row = asRecord(entry);
      return (
        row != null &&
        (row.userId != null ||
          row.id != null ||
          row.firstName != null ||
          row.name != null)
      );
    })
  ) {
    return topLevelValues;
  }

  return null;
}

/** Parse list endpoints that may return arrays or wrapped payloads. */
export function parseMatchCandidateList(raw: unknown): MatchCandidate[] {
  const items = extractArrayLike(raw);
  if (!items) return [];
  return mapCandidateList(items);
}
