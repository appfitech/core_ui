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

export type CreateContractRequest = {
  serviceId: number;
  clientId: number;
  termsAccepted: boolean;
  notes: string;
};

export type CreateContractResponse = {
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
