import { Ionicons } from '@expo/vector-icons';
import type { Dispatch, SetStateAction } from 'react';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { DatePicker } from '@/components/DatePicker';
import { LocalLocationPicker } from '@/components/LocalLocationPicker';
import { TextInput } from '@/components/TextInput';
import { PersonalInfoFormField } from '@/constants/forms';
import { useTheme } from '@/contexts/ThemeContext';
import { getPersonalInfoFieldValue } from '@/lib/personal-info/form';
import { UserResponseDtoReadable } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { getDOBMaxDate } from '@/utils/dates';

type Props = {
  fields: PersonalInfoFormField[];
  form: UserResponseDtoReadable | undefined;
  setForm: Dispatch<SetStateAction<UserResponseDtoReadable | undefined>>;
  isEmailVerified?: boolean;
};

function applyFieldChange(
  setForm: Dispatch<SetStateAction<UserResponseDtoReadable | undefined>>,
  field: string,
  value: string,
) {
  setForm((prev) => ({
    ...prev,
    person: {
      ...prev?.person,
      [field]: value,
    },
  }));
}

type FieldRowProps = {
  field: PersonalInfoFormField;
  form: UserResponseDtoReadable | undefined;
  setForm: Dispatch<SetStateAction<UserResponseDtoReadable | undefined>>;
  isEmailVerified?: boolean;
};

function PersonalInfoFieldRow({
  field,
  form,
  setForm,
  isEmailVerified,
}: FieldRowProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const handleChange = useCallback(
    (value: string) => applyFieldChange(setForm, field.field, value),
    [field.field, setForm],
  );

  const editable = field.editable !== false;
  const required = !field.isOptional;
  const placeholder = field.placeholder ?? field.label;
  const stringValue =
    (getPersonalInfoFieldValue(form, field.field) as string | undefined) ?? '';

  if (field.inputType === 'location-picker') {
    return (
      <LocalLocationPicker
        id={field.field}
        label={field.label}
        placeholder={placeholder}
        required={required}
        value={form?.person?.residenceLocationId ?? null}
        onChange={(locationId) =>
          setForm((prev) => ({
            ...prev,
            person: {
              ...prev?.person,
              residenceLocationId: locationId,
            },
          }))
        }
      />
    );
  }

  if (field.inputType === 'date') {
    return (
      <DatePicker
        label={field.label}
        placeholder={placeholder}
        value={form?.person?.birthDate ?? ''}
        maxDate={getDOBMaxDate()}
        required={required}
        onChange={(value) => handleChange(value ?? '')}
      />
    );
  }

  if (field.showEmailVerifiedBadge) {
    return (
      <View>
        <TextInput
          id={field.field}
          label={field.label}
          value={stringValue}
          editable={false}
          required={required}
        />

        {isEmailVerified && (
          <View style={styles.verifiedTag}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={theme.status.success.icon}
            />
            <AppText variant="caption" style={styles.verifiedText}>
              Verificado
            </AppText>
          </View>
        )}
      </View>
    );
  }

  return (
    <TextInput
      id={field.field}
      label={field.label}
      placeholder={placeholder}
      keyboardType={field.keyboardType}
      value={stringValue}
      onChangeText={handleChange}
      editable={editable}
      multiline={field.multiline}
      numberOfLines={field.numberOfLines ?? (field.multiline ? 8 : undefined)}
      required={required}
    />
  );
}

function fieldRowPropsAreEqual(prev: FieldRowProps, next: FieldRowProps) {
  if (prev.field !== next.field) return false;
  if (prev.isEmailVerified !== next.isEmailVerified) return false;

  return (
    getPersonalInfoFieldValue(prev.form, prev.field.field) ===
    getPersonalInfoFieldValue(next.form, next.field.field)
  );
}

const MemoizedPersonalInfoFieldRow = memo(
  PersonalInfoFieldRow,
  fieldRowPropsAreEqual,
);

export function PersonalInfoFormFields({
  fields,
  form,
  setForm,
  isEmailVerified,
}: Props) {
  return (
    <>
      {fields.map((field) => (
        <MemoizedPersonalInfoFieldRow
          key={field.field}
          field={field}
          form={form}
          setForm={setForm}
          isEmailVerified={isEmailVerified}
        />
      ))}
    </>
  );
}

const getStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    verifiedTag: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 2,
      paddingVertical: 4,
    },
    verifiedText: {
      color: theme.status.success.text,
    },
  });
};
