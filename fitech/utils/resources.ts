/** API values used for diet / nutrition client resources. */
export const DIET_RESOURCE_TYPES = ['DIETA', 'DIET'] as const;

export type DietResourceType = (typeof DIET_RESOURCE_TYPES)[number];

export function isDietResourceType(
  resourceType: string | undefined | null,
): resourceType is DietResourceType {
  return (
    resourceType != null &&
    (DIET_RESOURCE_TYPES as readonly string[]).includes(resourceType)
  );
}
