import { formatLocationName } from '@/constants/locations';
import { LocationDto } from '@/types/api/types.gen';

export type LocationDropdownItemKind = 'department' | 'province' | 'location';

export type LocationDropdownItem = {
  label: string;
  value: string;
  kind: LocationDropdownItemKind;
  disabled: boolean;
};

function compareLabels(a: string, b: string) {
  return a.localeCompare(b, 'es', { sensitivity: 'base' });
}

function headerValue(kind: LocationDropdownItemKind, key: string) {
  return `__${kind}__${key}`;
}

export function getLocationDistrictLabel(location: LocationDto) {
  return location.district?.trim() || formatLocationName(location);
}

export function getLocationDepartmentLabel(location: LocationDto) {
  return location.department?.trim() || location.province?.trim() || '';
}

/** Searchable label — includes department so duplicate district names are distinct. */
export function getLocationOptionLabel(location: LocationDto) {
  const district = getLocationDistrictLabel(location);
  const department = getLocationDepartmentLabel(location);

  if (!department || department.localeCompare(district, 'es', { sensitivity: 'base' }) === 0) {
    return district;
  }

  return `${district} — ${department}`;
}

/** Flat list with department / province headers and selectable districts. */
export function buildGroupedLocationItems(
  locations: LocationDto[],
): LocationDropdownItem[] {
  const active = locations.filter((loc) => loc.isActive !== false);

  const byDepartment = new Map<string, Map<string, LocationDto[]>>();

  for (const loc of active) {
    const department = loc.department?.trim() || 'Otros';
    const province = loc.province?.trim() || '—';

    if (!byDepartment.has(department)) {
      byDepartment.set(department, new Map());
    }

    const byProvince = byDepartment.get(department)!;
    if (!byProvince.has(province)) {
      byProvince.set(province, []);
    }

    byProvince.get(province)!.push(loc);
  }

  const items: LocationDropdownItem[] = [];

  for (const [department, provinces] of [...byDepartment.entries()].sort(
    ([a], [b]) => compareLabels(a, b),
  )) {
    items.push({
      kind: 'department',
      label: department,
      value: headerValue('department', department),
      disabled: true,
    });

    for (const [province, provinceLocations] of [...provinces.entries()].sort(
      ([a], [b]) => compareLabels(a, b),
    )) {
      items.push({
        kind: 'province',
        label: province,
        value: headerValue('province', `${department}/${province}`),
        disabled: true,
      });

      for (const loc of provinceLocations.sort((a, b) =>
        compareLabels(
          a.district ?? formatLocationName(a),
          b.district ?? formatLocationName(b),
        ),
      )) {
        if (loc.id == null) continue;

        items.push({
          kind: 'location',
          label: getLocationOptionLabel(loc),
          value: String(loc.id),
          disabled: false,
        });
      }
    }
  }

  return items;
}

function normalizeSearchText(text: string) {
  return text
    .toLowerCase()
    .replace(/\s/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Keeps group headers for locations that match the search query. */
export function filterLocationsForSearch(
  locations: LocationDto[],
  search: string,
): LocationDto[] {
  const query = normalizeSearchText(search.trim());
  if (!query) return locations;

  return locations.filter((loc) => {
    const haystack = [loc.department, loc.province, loc.district, loc.fullName]
      .filter(Boolean)
      .join(' ');

    return normalizeSearchText(haystack).includes(query);
  });
}
