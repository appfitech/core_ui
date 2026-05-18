import type { Dispatch, SetStateAction } from 'react';

import { RegisterFormFields } from '@/components/register/RegisterFormFields';
import { REGISTER_BASIC_INFO_FIELDS } from '@/constants/forms';
import { UserDtoWritable } from '@/types/api/types.gen';

type Props = {
  form: UserDtoWritable;
  setForm: Dispatch<SetStateAction<UserDtoWritable>>;
};

export function RegisterStepBasicInfo({ form, setForm }: Props) {
  return (
    <RegisterFormFields
      fields={REGISTER_BASIC_INFO_FIELDS}
      form={form}
      setForm={setForm}
    />
  );
}
