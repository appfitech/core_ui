import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ALL_LOCATIONS,
  findLocationById,
  formatLocationName,
} from '@/constants/locations';
import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useOpenable } from '@/hooks/use-openable';
import { useUserStore } from '@/stores/user';
import { LocationDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { useUpdateUser } from '../api/mutations/useUpdateUser';
import { AnimatedAppText } from '../components/AnimatedAppText';
import { DatePicker } from '../components/DatePicker';
import { DropdownWrapper } from '../components/DropdownWrapper';
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
  const [selectedLocation, setSelectedLocation] = useState<LocationDto | null>(
    null,
  );
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const { isOpen, open, close, setIsOpen } = useOpenable();

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
        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.updateText}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      {/* Location selection modal */}
      <Modal transparent visible={locationModalOpen} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Selecciona tu distrito</Text>
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
                      selected && { backgroundColor: theme.backgroundInverted },
                    ]}
                  >
                    <Text
                      style={[
                        styles.locationRowText,
                        selected && { color: theme.dark100, fontWeight: '700' },
                      ]}
                    >
                      {formatLocationName(loc)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 12,
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setLocationModalOpen(false)}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    locationPicker: {
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#D7D7D7',
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: '#FFF',
      marginBottom: 8,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'center',
      padding: 16,
    },
    modalCard: {
      borderRadius: 16,
      backgroundColor: theme.dark100,
      padding: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 8,
      color: theme.textPrimary,
    },
    locationRow: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 8,
      backgroundColor: '#F5F5F5',
    },
    locationRowText: {
      fontWeight: '600',
      color: theme.textPrimary,
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: '#EFEFEF',
    },
    modalButtonText: {
      fontWeight: '600',
      color: theme.textPrimary,
    },
    ...SHARED_STYLES(theme),
    headerTitle: {
      ...HEADING_STYLES(theme).title,
      fontWeight: '700',
    },
  });
