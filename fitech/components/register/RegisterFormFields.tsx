import type { Dispatch, SetStateAction } from 'react';
import { memo, useCallback } from 'react';

import { DatePicker } from '@/components/DatePicker';
import { Dropdown } from '@/components/Dropdown';
import { TextInput } from '@/components/TextInput';
import { CreateUserFormField } from '@/constants/forms';
import { getRegisterFieldValue } from '@/lib/register/form';
import { PersonDto, UserDtoWritable } from '@/types/api/types.gen';
import { getDOBMaxDate } from '@/utils/dates';

import { LocalLocationPicker } from '../LocalLocationPicker';

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

function applyFieldChange(
  setForm: Dispatch<SetStateAction<UserDtoWritable>>,
  field: CreateUserFormField,
  value: string,
) {
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
}

type FieldRowProps = {
  field: CreateUserFormField;
  form: UserDtoWritable;
  setForm: Dispatch<SetStateAction<UserDtoWritable>>;
};

function RegisterFieldRow({ field, form, setForm }: FieldRowProps) {
  const handleChange = useCallback(
    (value: string) => applyFieldChange(setForm, field, value),
    [field, setForm],
  );

  const inputType = resolveInputType(field);
  const placeholder = field.placeholder ?? field.label;
  const stringValue = (getFieldValue(form, field) as string | undefined) ?? '';

  if (inputType === 'dropdown' && field.options) {
    return (
      <Dropdown
        id={field.field}
        label={field.label}
        options={field.options}
        value={getFieldValue(form, field)}
        onChange={handleChange}
        placeholder={placeholder}
        zIndex={field.zIndex}
      />
    );
  }

  if (inputType === 'location-picker') {
    const locationField = field.field as keyof PersonDto;
    const locationValue = form.person?.[locationField] as number | undefined;

    return (
      <LocalLocationPicker
        label={field.label}
        placeholder={placeholder}
        id={field.field}
        required={!field.isOptional}
        zIndex={field.zIndex}
        value={locationValue ?? null}
        onChange={(locationId) =>
          setForm((prev) => ({
            ...prev,
            person: {
              ...prev.person,
              [locationField]: locationId,
            },
          }))
        }
      />
    );
  }

  if (inputType === 'date') {
    return (
      <DatePicker
        label={field.label}
        placeholder={placeholder}
        value={form.person?.birthDate ?? ''}
        maxDate={getDOBMaxDate()}
        onChange={(value) => handleChange(value ?? '')}
      />
    );
  }

  return (
    <TextInput
      id={field.field}
      label={field.label}
      placeholder={placeholder}
      secureTextEntry={field.secureTextEntry}
      newPasswordAutofill={field.secureTextEntry && field.field === 'password'}
      keyboardType={field.keyboardType}
      value={stringValue}
      onChangeText={handleChange}
      maxLength={field.maxLength}
      multiline={field.multiline}
      numberOfLines={field.numberOfLines ?? (field.multiline ? 5 : undefined)}
      required={!field.isOptional}
    />
  );
}

function fieldRowPropsAreEqual(prev: FieldRowProps, next: FieldRowProps) {
  if (prev.field !== next.field) return false;
  return (
    getFieldValue(prev.form, prev.field) ===
    getFieldValue(next.form, next.field)
  );
}

const MemoizedRegisterFieldRow = memo(RegisterFieldRow, fieldRowPropsAreEqual);

export function RegisterFormFields({ fields, form, setForm }: Props) {
  return (
    <>
      {fields.map((field) => (
        <MemoizedRegisterFieldRow
          key={field.field}
          field={field}
          form={form}
          setForm={setForm}
        />
      ))}
    </>
  );
}
