import { PERSONAL_INFO_FORM_FIELDS } from '@/constants/forms';
import { PersonDto, UserResponseDtoReadable } from '@/types/api/types.gen';

const LOCATION_ID_FIELDS = new Set(['residenceLocationId', 'gymLocationId']);

export function getPersonalInfoFieldValue(
  form: UserResponseDtoReadable | undefined,
  field: string,
): string | number | undefined {
  if (!form) return undefined;

  if (LOCATION_ID_FIELDS.has(field)) {
    return form.person?.[field as keyof PersonDto] as number | undefined;
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
