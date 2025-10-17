import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';

import { useUpdateUser } from '../api/mutations/useUpdateUser';
import { AnimatedAppText } from '../components/AnimatedAppText';
import { DatePicker } from '../components/DatePicker';
import { FormWrapper } from '../components/FormWrapper';
import { InputWrapper } from '../components/InputWrapper';
import PageContainer from '../components/PageContainer';

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { mutate: updateUser } = useUpdateUser();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const user = useUserStore((s) => s.user?.user);
  const updateUserInfo = useUserStore((s) => s.updateUserInfo);

  const [form, setForm] = useState(user);

  const handleUpdate = useCallback(() => {
    updateUser(form, {
      onSuccess: async (response) => {
        await updateUserInfo(response);
        router.back();
      },
    });
  }, [form]);

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  const handleChange = useCallback(
    (key: string) => (text) => {
      setForm((prev) => ({
        ...prev,
        person: { ...prev?.person, [key]: text },
      }));
    },
    [],
  );

  return (
    <PageContainer style={{ padding: 16, paddingBottom: 150 }}>
      <View style={styles.header}>
        <AnimatedAppText
          entering={FadeInDown.duration(500)}
          style={styles.headerTitle}
        >
          Editar Información Personal
        </AnimatedAppText>
      </View>

      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <InputWrapper
          id={'firstName'}
          label={'Nombre'}
          onChangeText={handleChange('firstName')}
          value={form?.person?.firstName}
        />

        <InputWrapper
          id={'lastName'}
          label={'Apellido'}
          onChangeText={handleChange('lastName')}
          value={form?.person?.lastName}
        />

        <InputWrapper
          id={'email'}
          label={'Email'}
          readOnly
          value={form?.person?.email}
        />
        {user?.isEmailVerified && (
          <View style={styles.verifiedTag}>
            <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
            <Text style={styles.verifiedText}>Email Verificado</Text>
          </View>
        )}

        <InputWrapper
          id={'documentNumber'}
          label={'Documento'}
          readOnly
          value={form?.person?.documentNumber}
        />

        <FormWrapper label={'Fecha de Nacimiento'}>
          <DatePicker
            value={form?.person?.birthDate ?? ''}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                person: {
                  ...prev?.person,
                  birthDate: value ?? '',
                },
              }))
            }
          />
        </FormWrapper>

        <InputWrapper
          id={'phoneNumber'}
          label={'Teléfono'}
          keyboardType="phone-pad"
          onChangeText={handleChange('phoneNumber')}
          value={form?.person?.phoneNumber}
        />

        <InputWrapper
          id={'bio'}
          label={'Biografía'}
          value={form?.person?.bio ?? ''}
          multiline
          numberOfLines={4}
          onChangeText={handleChange('bio')}
        />
      </Animated.View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.updateText}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#F5F7FA',
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#0F4C81',
      marginBottom: 16,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 4,
    },
    field: {
      marginBottom: 16,
    },

    header: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 12,
    },

    textArea: {
      height: 100,
      paddingTop: 10,
    },
    buttonRow: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginTop: 10,
      rowGap: 10,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      borderColor: '#ccc',
      borderWidth: 1,
      marginRight: 8,
    },
    cancelText: {
      fontWeight: '600',
      fontSize: 14,
      color: '#444',
    },
    updateButton: {
      flex: 1,
      backgroundColor: '#0F4C81',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginLeft: 8,
    },
    updateText: {
      fontWeight: '600',
      fontSize: 14,
      color: '#fff',
    },
    verifiedTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#DFF6DD',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginTop: 10,
      maxWidth: 150,
    },
    verifiedText: {
      marginLeft: 4,
      color: '#2E7D32',
      fontWeight: '600',
      fontSize: 12,
    },
    ...SHARED_STYLES(theme),
    headerTitle: {
      ...HEADING_STYLES(theme).title,
      fontWeight: '700',
    },
  });
