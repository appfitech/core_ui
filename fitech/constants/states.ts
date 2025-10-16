import { UserDtoWritable } from '@/types/api/types.gen';

export const emptyUserWritable: UserDtoWritable = {
  username: '',
  type: 2,
  password: '',
  person: {
    firstName: '',
    lastName: '',
    documentNumber: '',
    phoneNumber: '',
    email: '',
    documentType: 'DNI',
    birthDate: undefined,
    bio: '',
    gender: undefined,
  },
};
