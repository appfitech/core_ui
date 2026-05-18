import type { Dispatch, SetStateAction } from 'react';

import { DatePicker } from '@/components/DatePicker';
import { Dropdown } from '@/components/Dropdown';
import { TextInput } from '@/components/TextInput';
import { CreateUserFormField } from '@/constants/forms';
import { getRegisterFieldValue } from '@/lib/register/form';
import { UserDtoWritable } from '@/types/api/types.gen';
import { getDOBMaxDate } from '@/utils/dates';

import { ResidencePicker } from '../ResidencePicker';

type Props = {
  fields: CreateUserFormField[];
  form: UserDtoWritable;
  setForm: Dispatch<SetStateAction<UserDtoWritable>>;
};

function resolveInputType(field: CreateUserFormField) {
  if (field.inputType) return field.inputType;
  if (field.options?.length) return 'dropdown' as const;
  return 'text' as const;
}

function getFieldValue(form: UserDtoWritable, field: CreateUserFormField) {
  if (field.isBase && field.field === 'type') {
    return form.type != null ? form.type : null;
  }
  return getRegisterFieldValue(form, field.field, field.isBase);
}

export function RegisterFormFields({ fields, form, setForm }: Props) {
  const handleChange = (field: CreateUserFormField, value: string) => {
    if (field.isBase && field.field === 'type') {
      setForm((prev) => ({
        ...prev,
        type: Number(value) as 1 | 2,
      }));
      return;
    }

    if (field.isBase) {
      setForm((prev) => ({ ...prev, [field.field]: value }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      person: { ...prev.person, [field.field]: value },
    }));
  };

  return (
    <>
      {fields.map((field) => {
        const inputType = resolveInputType(field);
        const placeholder = field.placeholder ?? field.label;

        if (inputType === 'dropdown' && field.options) {
          return (
            <Dropdown
              key={field.field}
              id={field.field}
              label={field.label}
              options={field.options}
              value={getFieldValue(form, field)}
              onChange={(value) => handleChange(field, value)}
              placeholder={placeholder}
              zIndex={field.zIndex}
            />
          );
        }

        if (inputType === 'residence-picker') {
          return (
            <ResidencePicker
              key={field.field}
              id={field.field}
              value={form.person?.residenceLocationId ?? null}
              onChange={(locationId) =>
                setForm((prev) => ({
                  ...prev,
                  person: {
                    ...prev.person,
                    residenceLocationId: locationId,
                  },
                }))
              }
            />
          );
        }

        if (inputType === 'date') {
          return (
            <DatePicker
              key={field.field}
              label={field.label}
              placeholder={placeholder}
              value={form.person?.birthDate ?? ''}
              maxDate={getDOBMaxDate()}
              onChange={(value) => handleChange(field, value ?? '')}
            />
          );
        }

        return (
          <TextInput
            key={field.field}
            id={field.field}
            label={field.label}
            placeholder={placeholder}
            secureTextEntry={field.secureTextEntry}
            newPasswordAutofill={
              field.secureTextEntry && field.field === 'password'
            }
            keyboardType={field.keyboardType}
            value={getFieldValue(form, field) as string | undefined}
            onChangeText={(text) => handleChange(field, text)}
            multiline={field.multiline}
            numberOfLines={field.multiline ? 10 : 1}
            required={!field.isOptional}
          />
        );
      })}
    </>
  );
}
