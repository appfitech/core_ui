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
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';

import { CREATE_USER_FORM } from '@/constants/forms';
import { ROUTES } from '@/constants/routes';
import { SHARED_STYLES } from '@/constants/shared_styles';
import { emptyUserWritable } from '@/constants/states';
import { useTheme } from '@/contexts/ThemeContext';
import { UserDtoWritable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { useCreateUser } from '../api/mutations/useCreateUser';
import { BackButton } from '../components/BackButton';
import { Dropdown } from '../components/Dropdown';

export default function Register() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UserDtoWritable>(emptyUserWritable);

  const router = useRouter();
  const { mutate: createUser } = useCreateUser();

  const [accountTypes] = useState([
    { label: 'Trainer', value: 1 },
    { label: 'Usuario', value: 2 },
  ]);

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
    <LinearGradient
      colors={[theme.background, theme.background]}
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
            {'Crear cuenta'}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(300)}
            style={styles.headerSubtitle}
          >
            {'Ingresa tus datos para registrarte'}
          </Animated.Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollForm}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={SlideInDown.springify()} style={styles.card}>
            <Text style={styles.label}>{'Tipo de cuenta'}</Text>
            <Dropdown
              options={accountTypes}
              isOpen={open}
              setIsOpen={setOpen}
              value={form.type}
              onChange={(callback) =>
                setForm((prev) => ({
                  ...prev,
                  type: callback(prev.type),
                }))
              }
            />

            {CREATE_USER_FORM.map(({ label, field, ...rest }) => {
              const isBase = rest?.isBase ?? false;

              return (
                <View key={field} style={styles.inputWrapper}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={label}
                    placeholderTextColor={theme.dark700}
                    secureTextEntry={rest?.secureTextEntry}
                    keyboardType={rest?.keyboardType}
                    value={isBase ? form?.[field] : form?.person?.[field]}
                    onChangeText={(text) =>
                      isBase
                        ? handleBaseChange(field, text)
                        : handlePersonChange(field, text)
                    }
                  />
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>{'CREAR CUENTA'}</Text>
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
      color: theme.dark900,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.dark700,
      textAlign: 'center',
      marginTop: 8,
    },
    scrollForm: {
      paddingBottom: 80,
    },
    card: {
      backgroundColor: theme.background,
      width: '100%',
      borderRadius: 16,
      padding: 16,
      elevation: 6,
    },
    ...SHARED_STYLES(theme),
  });
