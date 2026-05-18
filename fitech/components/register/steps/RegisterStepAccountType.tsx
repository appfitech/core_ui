import type { Dispatch, SetStateAction } from 'react';

import { RegisterFormFields } from '@/components/register/RegisterFormFields';
import { REGISTER_ACCOUNT_TYPE_FIELDS } from '@/constants/forms';
import { UserDtoWritable } from '@/types/api/types.gen';

type Props = {
  form: UserDtoWritable;
  setForm: Dispatch<SetStateAction<UserDtoWritable>>;
};

export function RegisterStepAccountType({ form, setForm }: Props) {
  return (
    <RegisterFormFields
      fields={REGISTER_ACCOUNT_TYPE_FIELDS}
      form={form}
      setForm={setForm}
    />
  );
}
