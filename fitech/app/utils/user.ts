import { PersonDto } from '@/src/types/api/types.gen';

export const getUserAvatarURL = (person?: PersonDto) => {
  if (!person || !person?.profilePhotoId) {
    return '';
  }

  return `https://appfitech.com/v1/app/file-upload/view/${person?.profilePhotoId}`;
};
