import { PERSONAL_INFO_FORM_FIELDS } from '@/constants/forms';
import { PersonDto, UserResponseDtoReadable } from '@/types/api/types.gen';

export function getPersonalInfoFieldValue(
  form: UserResponseDtoReadable | undefined,
  field: string,
): string | number | undefined {
  if (!form) return undefined;

  if (field === 'residenceLocationId') {
    return form.person?.residenceLocationId;
  }

  const value = form.person?.[field as keyof PersonDto];
  return value != null ? String(value) : undefined;
}

export function isPersonalInfoFormValid(
  form: UserResponseDtoReadable | undefined,
): boolean {
  if (!form?.id) return false;

  for (const field of PERSONAL_INFO_FORM_FIELDS) {
    if (field.isOptional || field.editable === false) {
      continue;
    }

    const value = getPersonalInfoFieldValue(form, field.field);
    if (field.inputType === 'location-picker') {
      continue;
    }

    if (value == null || String(value).trim() === '') {
      return false;
    }
  }

  return true;
}
