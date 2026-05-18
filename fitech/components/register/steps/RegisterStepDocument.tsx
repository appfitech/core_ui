import type { Dispatch, SetStateAction } from 'react';

import { RegisterFormFields } from '@/components/register/RegisterFormFields';
import { REGISTER_DOCUMENT_FIELDS } from '@/constants/forms';
import { UserDtoWritable } from '@/types/api/types.gen';

type Props = {
  form: UserDtoWritable;
  setForm: Dispatch<SetStateAction<UserDtoWritable>>;
};

export function RegisterStepDocument({ form, setForm }: Props) {
  return (
    <RegisterFormFields
      fields={REGISTER_DOCUMENT_FIELDS}
      form={form}
      setForm={setForm}
    />
  );
}
