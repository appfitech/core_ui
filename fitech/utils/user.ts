import { PersonDto } from '@/types/api/types.gen';

export const getUserAvatarURL = (person?: PersonDto): string | undefined => {
  const photoId = person?.profilePhotoId;
  if (photoId == null || photoId <= 0) {
    return undefined;
  }

  return `https://appfitech.com/v1/app/file-upload/view/${photoId}`;
};

/** Build full image URL from candidate profilePhotoUrl (GymBro/GymCrush). Use for display and prefetch. */
export function getCandidateProfileImageUrl(
  profilePhotoUrl?: string | null,
): string | null {
  const raw = profilePhotoUrl ?? '';
  if (!raw) return null;
  if (raw.startsWith('http')) return raw;
  return `https://appfitech.com${raw.startsWith('/') ? raw : `/${raw}`}`;
}
