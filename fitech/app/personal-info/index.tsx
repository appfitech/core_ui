import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserStore } from '@/stores/user';

import { useUpdateUser } from '../api/mutations/useUpdateUser';
import { BackButton } from '../components/BackButton';

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { mutate: updateUser } = useUpdateUser();

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: '#F5F7FA' }}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 60,
          },
        ]}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100}
      >
        <View style={{ marginTop: 0, marginBottom: 60 }}>
          <BackButton />
        </View>

        <Animated.Text
          entering={FadeInDown.duration(500)}
          style={styles.sectionTitle}
        >
          Editar Información Personal
        </Animated.Text>

        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={styles.card}
        >
          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('firstName')}
              value={form?.person?.firstName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('lastName')}
              value={form?.person?.lastName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              readOnly
              style={styles.input}
              value={form?.person?.email}
              keyboardType="email-address"
            />
            {user?.isEmailVerified && (
              <View style={styles.verifiedTag}>
                <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                <Text style={styles.verifiedText}>Email Verificado</Text>
              </View>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Número de documento</Text>
            <TextInput
              style={styles.input}
              readOnly
              value={form?.person?.documentNumber}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={form?.person?.phoneNumber}
              keyboardType="phone-pad"
              onChangeText={handleChange('phoneNumber')}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Biografía</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              defaultValue={form?.person?.bio ?? ''}
              multiline
              numberOfLines={4}
              onChangeText={handleChange('bio')}
              textAlignVertical="top"
              placeholder="Cuéntanos sobre ti..."
            />
          </View>
        </Animated.View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#1B1F23',
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
});
