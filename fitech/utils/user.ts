import { PersonDto } from '@/types/api/types.gen';

export const getUserAvatarURL = (person?: PersonDto) => {
  if (!person || !person?.profilePhotoId) {
    return '';
  }

  return `https://appfitech.com/v1/app/file-upload/view/${person?.profilePhotoId}`;
};

/** Build full image URL from candidate profilePhotoUrl (GymBro/GymCrush). Use for display and prefetch. */
export function getCandidateProfileImageUrl(profilePhotoUrl?: string | null): string | null {
  const raw = profilePhotoUrl ?? '';
  if (!raw) return null;
  if (raw.startsWith('http')) return raw;
  return `https://appfitech.com${raw.startsWith('/') ? raw : `/${raw}`}`;
}
