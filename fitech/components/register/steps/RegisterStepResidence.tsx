import type { Dispatch, SetStateAction } from 'react';

import { RegisterFormFields } from '@/components/register/RegisterFormFields';
import { REGISTER_RESIDENCE_FIELDS } from '@/constants/forms';
import { UserDtoWritable } from '@/types/api/types.gen';

type Props = {
  form: UserDtoWritable;
  setForm: Dispatch<SetStateAction<UserDtoWritable>>;
};

export function RegisterStepResidence({ form, setForm }: Props) {
  return (
    <RegisterFormFields
      fields={REGISTER_RESIDENCE_FIELDS}
      form={form}
      setForm={setForm}
    />
  );
}
