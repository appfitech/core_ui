import { Person } from './user';

export type Trainer = {
  id: number;
  username: string;
  type: number;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  premiumBy: string;
  premium: boolean;
  person: Person;
};

export type TrainerService = {
  id: number;
  trainerId: number;
  name: string;
  description: string;
  totalPrice: number;
  pricePerSession: number;
  platformCommissionRate: number;
  platformCommissionAmount: number;
  trainerEarnings: number;
  isInPerson: boolean;
  transportIncluded: boolean;
  transportCostPerSession: number;
  enrolledUsersCount: number;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  districts: any[];
};

export type TrainerPhoto = {
  id: number;
  userId: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  file_path: string;
};

export type ContractAvailabilityResponse = {
  canContract: boolean;
  message: string;
};
