export type Resource = {
  clientId: number;
  clientName: string;
  createdAt: string;
  endDate: string | null;
  id: number;
  isActive: boolean;
  resourceDetails: string;
  resourceName: string;
  resourceObjective: string;
  resourceType: 'DIETA' | 'RUTINA';
  serviceId: number;
  serviceName: string;
  startDate: string;
  trainerName: string;
  trainerNotes: string;
  updatedAt: string;
};

export type DietResource = Resource & {
  resourceType: 'DIETA';
};

export type RoutineResource = Resource & {
  resourceType: 'RUTINA';
};
