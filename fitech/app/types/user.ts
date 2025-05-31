export type Person = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  documentType?: string;
  phoneNumber: string;
  birthDate?: number[];
  bio?: string | null;
  gender?: string | null;
  presentationVideoId?: number;
  profilePhotoId?: number;
};

export type User = {
  id: number;
  username: string;
  type: number;
  premium: boolean;
  premiumBy: string;
  createdAt: number[];
  updatedAt: number[];
  isEmailVerified: boolean;
  person: Person;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type CreateUserRequest = {
  username: string;
  password: string;
  person: Person;
  type: number;
};
