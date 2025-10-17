// api/types/CandidatesResponse.ts

// Helper for nullable fields
type Nullable<T> = T | null;

// If photo items are URLs or objects, this union keeps it flexible.
// Replace with your real shape if you have one.
export type PhotoLike = string;

export interface Candidate {
  id: number;
  userId: number;

  firstName: string;
  lastName: string;
  fullName: string;

  age: Nullable<number>;
  bio: Nullable<string>;

  city: Nullable<string>;
  country: Nullable<string>;
  email: Nullable<string>;

  fitnessLevel: Nullable<'Beginner' | 'Intermediate' | 'Advanced' | string>;
  goals: Nullable<string[]>;

  hasPhotos: boolean;
  profilePhotoUrl: Nullable<string>;

  // These come back as arrays (unknown shape in sample) or null
  photos: Nullable<PhotoLike[]>;
  additionalPhotos: Nullable<PhotoLike[]>;

  // Counters
  totalPhotosCount: number;
  calculatedPhotosCount: number;
}

export interface CandidatesResponse {
  count: number;
  data: Candidate[];
  message: string;
  success: boolean;
}
