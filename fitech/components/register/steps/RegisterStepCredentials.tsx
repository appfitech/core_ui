import type { Dispatch, SetStateAction } from 'react';

import { RegisterFormFields } from '@/components/register/RegisterFormFields';
import { TextInput } from '@/components/TextInput';
import { REGISTER_CREDENTIALS_FIELDS } from '@/constants/forms';
import { UserDtoWritable } from '@/types/api/types.gen';

type Props = {
  form: UserDtoWritable;
  setForm: Dispatch<SetStateAction<UserDtoWritable>>;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
};

export function RegisterStepCredentials({
  form,
  setForm,
  confirmPassword,
  onConfirmPasswordChange,
}: Props) {
  return (
    <>
      <RegisterFormFields
        fields={REGISTER_CREDENTIALS_FIELDS}
        form={form}
        setForm={setForm}
      />
      <TextInput
        id="confirmPassword"
        label="Confirmar contraseña"
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        textContentType="password"
        autoComplete="off"
      />
    </>
  );
}
