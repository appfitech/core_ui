import { UserDtoWritable } from '@/types/api/types.gen';

export const emptyUserWritable: UserDtoWritable = {
  username: '',
  type: 2,
  password: '',
  //   isEmailVerified: false,
  //   premiumBy: 'NONE',
  //   premium: false,
  person: {
    firstName: '',
    lastName: '',
    documentNumber: '',
    phoneNumber: '',
    email: '',
    documentType: 'DNI',
    // profilePhotoId: undefined,
    // presentationVideoId: undefined,
    // bio: '',
    // gender: 'OTHER', F o M nomas
    // birthDate: '',
    // fitnessGoalTypes: [],
  },
};
