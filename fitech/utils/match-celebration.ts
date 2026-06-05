import { MatchActionResponseDto } from '@/types/api/types.gen';

import { getCandidateProfileImageUrl } from './user';

export type MatchCelebrationPayload = {
  type: 'gymbro' | 'gymcrush';
  name: string;
  photoUrl: string | null;
};

export function buildMatchCelebrationFromResponse(
  type: 'gymbro' | 'gymcrush',
  response: MatchActionResponseDto,
): MatchCelebrationPayload | null {
  if (!response.hasMatch) return null;

  return {
    type,
    name: response.matchedUserName?.trim() || 'alguien especial',
    photoUrl: getCandidateProfileImageUrl(response.matchedUserPhoto),
  };
}
