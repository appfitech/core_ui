import { LocationDto } from '@/types/api/types.gen';

/**
 * List of available locations in the application
 * TODO: Replace with API call when available
 */
export const ALL_LOCATIONS: LocationDto[] = [
  { id: 75, fullName: 'Cusco - Cusco - San Blas' },
  { id: 70, fullName: 'Cusco - Urubamba - Machupicchu' },
  { id: 51, fullName: 'Lima - Magdalena' },
  { id: 52, fullName: 'Lima - Miraflores' },
];

/**
 * Utility to format the full name of a location
 */
export const formatLocationName = (location: LocationDto): string => {
  return location.fullName || 
    [location.department, location.province, location.district]
      .filter(Boolean)
      .join(' - ');
};

/**
 * Utility to find a location by ID
 */
export const findLocationById = (id: number): LocationDto | undefined => {
  return ALL_LOCATIONS.find(location => location.id === id);
};