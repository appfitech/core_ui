import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

const DEFAULT_LIMIT = 3;

function isValidActivity(
  item: ClientResourceResponseDtoReadable | undefined,
): item is ClientResourceResponseDtoReadable {
  return item?.id != null;
}

function addUnique(
  picked: ClientResourceResponseDtoReadable[],
  usedIds: Set<number>,
  item: ClientResourceResponseDtoReadable | undefined,
) {
  if (!isValidActivity(item) || usedIds.has(item.id!)) {
    return;
  }
  usedIds.add(item.id!);
  picked.push(item);
}

/** Up to `limit` items: at least one routine and one diet when both exist. */
export function pickFeaturedActivities(
  routines: ClientResourceResponseDtoReadable[] | undefined,
  diets: ClientResourceResponseDtoReadable[] | undefined,
  limit = DEFAULT_LIMIT,
): ClientResourceResponseDtoReadable[] {
  const validRoutines = (routines ?? []).filter(isValidActivity);
  const validDiets = (diets ?? []).filter(isValidActivity);

  if (validRoutines.length === 0 && validDiets.length === 0) {
    return [];
  }

  if (validDiets.length === 0) {
    return validRoutines.slice(0, limit);
  }

  if (validRoutines.length === 0) {
    return validDiets.slice(0, limit);
  }

  const picked: ClientResourceResponseDtoReadable[] = [];
  const usedIds = new Set<number>();

  addUnique(picked, usedIds, validRoutines[0]);
  addUnique(picked, usedIds, validDiets[0]);

  let routineIndex = 1;
  let dietIndex = 1;

  while (picked.length < limit) {
    const before = picked.length;

    if (routineIndex < validRoutines.length) {
      addUnique(picked, usedIds, validRoutines[routineIndex]);
      routineIndex += 1;
    }

    if (picked.length >= limit) {
      break;
    }

    if (dietIndex < validDiets.length) {
      addUnique(picked, usedIds, validDiets[dietIndex]);
      dietIndex += 1;
    }

    if (picked.length === before) {
      break;
    }
  }

  return picked.slice(0, limit);
}
