export type Contract = {
  id: number;
  clientId: number;
  trainerId: number;
  serviceId: number;
  contractStatus: 'ACTIVE' | 'INACTIVE';
  startDate: string;
  endDate: string | null;
  totalAmount: number;
  serviceName: string;
};
