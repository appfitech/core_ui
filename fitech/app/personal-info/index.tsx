import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import {
  ALL_LOCATIONS,
  findLocationById,
  formatLocationName,
} from '@/constants/locations';
import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useOpenable } from '@/hooks/use-openable';
import { useUserStore } from '@/stores/user';
import { LocationDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { useUpdateUser } from '../api/mutations/useUpdateUser';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { DatePicker } from '../components/DatePicker';
import { DropdownWrapper } from '../components/DropdownWrapper';
import { FormWrapper } from '../components/FormWrapper';
import { InputWrapper } from '../components/InputWrapper';
import PageContainer from '../components/PageContainer';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { mutate: updateUser } = useUpdateUser();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const user = useUserStore((s) => s.user?.user);
  const updateUserInfo = useUserStore((s) => s.updateUserInfo);

  const [form, setForm] = useState(user);
  const [selectedLocation, setSelectedLocation] = useState<LocationDto | null>(
    null,
  );
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const { isOpen, setIsOpen } = useOpenable();

  // Load user's initial location
  useEffect(() => {
    if (user?.person?.residenceLocationId) {
      const userLocation = findLocationById(user.person.residenceLocationId);
      if (userLocation) {
        setSelectedLocation(userLocation);
        // No need to update form here since it already comes with correct data
      }
    }
  }, [user]);

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

  const handleLocationChange = useCallback((location: LocationDto | null) => {
    setSelectedLocation(location);
    setForm((prev) => ({
      ...prev,
      person: {
        ...prev?.person,
        residenceLocationId: location?.id,
      },
    }));
  }, []);

  return (
    <PageContainer
      title="Editar Información Personal"
      style={styles.pageStyle}
      contentPaddingBottom={120}
    >
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

        <View style={styles.emailRow}>
          <View style={styles.emailInputWrap}>
            <InputWrapper
              id="email"
              label="Email"
              value={form?.person?.email}
              editable={false}
              disabled
            />
          </View>
          {user?.isEmailVerified && (
            <View style={styles.verifiedTag}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={theme.success}
              />
              <AppText style={styles.verifiedText}>Verificado</AppText>
            </View>
          )}
        </View>

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

        <DropdownWrapper
          label={'Distrito de residencia'}
          placeholder={'Seleccionar distrito'}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          onChange={setSelectedLocation}
          options={ALL_LOCATIONS.map((item) => ({
            value: item.id,
            label: item.fullName,
          }))}
          value={selectedLocation}
          zIndex={10000}
        />

        <InputWrapper
          id={'bio'}
          label={'Biografía'}
          value={form?.person?.bio ?? ''}
          multiline
          numberOfLines={8}
          onChangeText={handleChange('bio')}
        />
      </Animated.View>

      <View style={styles.buttonRow}>
        <Button
          label="Actualizar"
          type="primary"
          onPress={handleUpdate}
          style={styles.buttonFull}
          buttonStyle={styles.primaryButton}
        />
        <Button
          label="Cancelar"
          type="secondary"
          onPress={handleCancel}
          style={styles.buttonFull}
        />
      </View>

      {/* Location selection modal */}
      <Modal transparent visible={locationModalOpen} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>Selecciona tu distrito</AppText>
            <ScrollView style={{ maxHeight: 320 }}>
              {ALL_LOCATIONS.map((loc) => {
                const selected = selectedLocation?.id === loc.id;

                return (
                  <Pressable
                    key={loc.id}
                    onPress={() => {
                      if (selected) {
                        handleLocationChange(null); // Deselect if already selected
                      } else {
                        handleLocationChange(loc); // Select only this location
                        setLocationModalOpen(false); // Close modal automatically
                      }
                    }}
                    style={[
                      styles.locationRow,
                      selected && { backgroundColor: theme.primary },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.locationRowText,
                        selected && {
                          color: theme.background,
                          fontWeight: '700',
                        },
                      ]}
                    >
                      {formatLocationName(loc)}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                label="Cerrar"
                type="tertiary"
                onPress={() => setLocationModalOpen(false)}
                buttonStyle={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {
      paddingHorizontal: 16,
    },
    buttonRow: {
      flexDirection: 'column',
      marginTop: 24,
      rowGap: 12,
    },
    buttonFull: {
      width: '100%',
    },
    primaryButton: {
      paddingVertical: 14,
    },
    emailRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 12,
      marginBottom: 8,
    },
    emailInputWrap: {
      flex: 1,
      minWidth: 0,
    },
    verifiedTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.successBackground,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      gap: 8,
      borderWidth: 1,
      borderColor: theme.successBorder,
      marginBottom: 8,
    },
    verifiedText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.successText,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      padding: 16,
    },
    modalCard: {
      borderRadius: 16,
      backgroundColor: theme.card,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 12,
      color: theme.textPrimary,
    },
    locationRow: {
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 6,
      backgroundColor: theme.backgroundInput,
      borderWidth: 1,
      borderColor: theme.border,
    },
    locationRowText: {
      fontWeight: '600',
      fontSize: 15,
      color: theme.textPrimary,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    ...SHARED_STYLES(theme),
  });
