import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';

import { useTheme } from '@/contexts/ThemeContext';

import { useCreateUser } from '../api/mutations/useCreateUser';
import { BackButton } from '../components/BackButton';
import { FullTheme } from '../types/theme';

export default function Register() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: 1,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    documentNumber: '',
    username: '',
    password: '',
  });

  const router = useRouter();
  const { mutate: createUser } = useCreateUser();

  const [accountTypes] = useState([
    { label: 'Trainer', value: 1 },
    { label: 'Usuario', value: 2 },
  ]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { username, password, type, ...person } = form;

    createUser(
      { type, username, password, person },
      {
        onSuccess: () => {
          router.push('/login');
        },
      },
    );
  };

  return (
    <LinearGradient
      colors={[theme.background, theme.primaryDark]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <BackButton />
          <Animated.Text
            entering={FadeInUp.delay(200)}
            style={styles.headerTitle}
          >
            Crear cuenta
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(300)}
            style={styles.headerSubtitle}
          >
            Ingresa tus datos para registrarte
          </Animated.Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollForm}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={SlideInDown.springify()} style={styles.card}>
            <Text style={styles.label}>Tipo de cuenta</Text>
            <DropDownPicker
              open={open}
              value={form.type}
              items={accountTypes}
              setOpen={setOpen}
              setValue={(callback) =>
                setForm((prev) => ({
                  ...prev,
                  type: callback(prev.type),
                }))
              }
              listMode="SCROLLVIEW"
              style={styles.dropdown}
              dropDownContainerStyle={{
                backgroundColor: '#F5F7FA',
                borderColor: '#ccc',
              }}
            />

            {[
              { label: 'Nombre', field: 'firstName' },
              { label: 'Apellido', field: 'lastName' },
              {
                label: 'Correo electrónico',
                field: 'email',
                keyboardType: 'email-address',
              },
              {
                label: 'Teléfono',
                field: 'phoneNumber',
                keyboardType: 'phone-pad',
              },
              { label: 'Documento', field: 'documentNumber' },
              { label: 'Usuario', field: 'username' },
              {
                label: 'Contraseña',
                field: 'contrasena',
                secureTextEntry: true,
              },
            ].map(({ label, field, ...rest }) => (
              <View key={field} style={styles.inputWrapper}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={label}
                  placeholderTextColor="#888"
                  secureTextEntry={rest.secureTextEntry}
                  keyboardType={rest.keyboardType}
                  value={form[field]}
                  onChangeText={(text) => handleChange(field, text)}
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Crear cuenta</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingTop: 60,
      paddingHorizontal: 24,
    },
    header: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 24,
      marginTop: 24,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#fff',
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#DDE6FF',
      textAlign: 'center',
      marginTop: 8,
    },
    scrollForm: {
      paddingBottom: 80,
    },
    card: {
      backgroundColor: '#fff',
      width: '100%',
      borderRadius: 16,
      padding: 24,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 6,
    },
    label: {
      fontSize: 12,
      color: '#666',
      marginBottom: 6,
      marginTop: 12,
    },
    inputWrapper: {
      marginBottom: 4,
    },
    input: {
      backgroundColor: '#F5F7FA',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 14,
      fontSize: 14,
      color: '#1B1F23',
    },
    dropdown: {
      backgroundColor: '#F5F7FA',
      borderColor: '#ccc',
      borderRadius: 10,
    },
    submitButton: {
      backgroundColor: theme.primaryLight,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 24,
    },
    submitText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
  });
