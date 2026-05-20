import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

export type ActiveInactiveFilter = 'ACTIVE' | 'INACTIVE';

export function filterClientResourcesByActive(
  items: ClientResourceResponseDtoReadable[] | undefined,
  filter: ActiveInactiveFilter,
): ClientResourceResponseDtoReadable[] {
  if (!items?.length) return [];

  if (filter === 'ACTIVE') {
    return items.filter((item) => item.isActive !== false);
  }

  return items.filter((item) => item.isActive === false);
}
