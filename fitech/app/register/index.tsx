import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

import {
  CREATE_USER_FORM,
  DOCUMENT_TYPES,
  GENDER_TYPES,
  USER_TYPES,
} from '@/constants/forms';
import { ROUTES } from '@/constants/routes';
import { emptyUserWritable } from '@/constants/states';
import { useTheme } from '@/contexts/ThemeContext';
import { useOpenable } from '@/hooks/use-openable';
import { UserDtoWritable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { getDOBMaxDate } from '@/utils/dates';

import { useCreateUser } from '../api/mutations/user/use-create-user';
import { Button } from '../components/Button';
import { DatePicker } from '../components/DatePicker';
import { DropdownWrapper } from '../components/DropdownWrapper';
import { FormWrapper } from '../components/FormWrapper';
import { InputWrapper } from '../components/InputWrapper';
import PageContainer from '../components/PageContainer';

export default function Register() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { isOpen: isUserTypeOpen, setIsOpen: setIsUserTypeOpen } =
    useOpenable();
  const { isOpen: isDocTypeOpen, setIsOpen: setIsDocTypeOpen } = useOpenable();
  const { isOpen: isGenderOpen, setIsOpen: setIsGenderOpen } = useOpenable();
  const [form, setForm] = useState<UserDtoWritable>(emptyUserWritable);

  const router = useRouter();
  const { mutate: createUser } = useCreateUser();

  const handlePersonChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      person: { ...prev.person, [field]: value },
    }));
  };

  const handleBaseChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    createUser(form, {
      onSuccess: () => {
        router.replace(ROUTES.login);
      },
    });
  };

  return (
    <PageContainer
      header={'Crear cuenta'}
      subheader={'Ingresa tus datos para registrarte'}
      style={{ padding: 16 }}
    >
      <Animated.View entering={SlideInDown.springify()} style={styles.card}>
        <DropdownWrapper
          id={'type'}
          label={'Tipo de cuenta'}
          options={USER_TYPES}
          isOpen={isUserTypeOpen}
          setIsOpen={setIsUserTypeOpen}
          value={form.type}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              type: value,
            }))
          }
          zIndex={3000}
        />

        <DropdownWrapper
          id={'documentType'}
          label={'Tipo de documento'}
          options={DOCUMENT_TYPES}
          isOpen={isDocTypeOpen}
          setIsOpen={setIsDocTypeOpen}
          value={form.person?.documentType}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              person: {
                ...prev.person,
                documentType: value,
              },
            }))
          }
          zIndex={2000}
        />

        <DropdownWrapper
          id={'gender'}
          label={'Genero'}
          options={GENDER_TYPES}
          isOpen={isGenderOpen}
          setIsOpen={setIsGenderOpen}
          value={form.person?.gender}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              person: {
                ...prev.person,
                gender: value,
              },
            }))
          }
          zIndex={1000}
        />

        <FormWrapper label={'Fecha de nacimiento'}>
          <DatePicker
            placeholder="Fecha de nacimiento"
            value={form?.person?.birthDate ?? ''}
            maxDate={getDOBMaxDate()}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                person: {
                  ...prev.person,
                  birthDate: value ?? '',
                },
              }))
            }
          />
        </FormWrapper>

        {CREATE_USER_FORM.map(({ label, field, type, ...rest }) => {
          const isBase = rest?.isBase ?? false;

          return (
            <InputWrapper
              key={field}
              id={field}
              label={label}
              placeholder={label}
              secureTextEntry={rest?.secureTextEntry}
              keyboardType={rest?.keyboardType}
              value={isBase ? form?.[field] : form?.person?.[field]}
              onChangeText={(text) =>
                isBase
                  ? handleBaseChange(field, text)
                  : handlePersonChange(field, text)
              }
              multiline={type === 'text-area' ? true : false}
              numberOfLines={type === 'text-area' ? 10 : 1}
            />
          );
        })}

        <Button
          label={'Crear cuenta'}
          style={{ marginTop: 30 }}
          onPress={handleSubmit}
        />
      </Animated.View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.background,
      width: '100%',
      borderRadius: 16,
      padding: 16,
      elevation: 6,
    },
  });
