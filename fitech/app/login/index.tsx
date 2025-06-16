import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInUp,
  SlideInDown,
  ZoomIn,
} from 'react-native-reanimated';

import { useLogin } from '../api/mutations/useLogin';
import { BackButton } from '../components/BackButton';
import { COLORS } from '../constants/colors';
import { TRANSLATIONS } from '../constants/strings';
import { useAuthRedirect } from '../hooks/use-auth-reditect';
import { useUserStore } from '../stores/user';

export default function LoginScreen() {
  useAuthRedirect();

  const { loginScreen } = TRANSLATIONS;

  const [showUI, setShowUI] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const setUser = useUserStore((s) => s.setUser);

  const { mutate: submitLogin } = useLogin();

  useEffect(() => {
    setTimeout(() => setShowUI(true), 600);
  }, []);

  const handleChange = useCallback(
    (key: string) => (text: string) => {
      if (key === 'username') {
        setUsername(text);
        return;
      }

      setPassword(text);
    },
    [],
  );

  const handleLogin = useCallback(() => {
    submitLogin(
      { username, password },
      {
        onSuccess: (response) => {
          console.log('[K] user', response);
          setUser(response);
          router.push('/onboarding');
        },
      },
    );
  }, [username, password]);

  return (
    <LinearGradient
      colors={[COLORS.dark.accent, COLORS.dark.background]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <BackButton />
          <Animated.Image
            entering={FadeInUp.duration(600)}
            source={require('../../assets/images/logos/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Animated.Text
            entering={FadeInUp.delay(200)}
            style={styles.headerTitle}
          >
            {loginScreen.header}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(300)}
            style={styles.headerSubtitle}
          >
            {loginScreen.subheader}
          </Animated.Text>
        </View>

        {showUI && (
          <Animated.View
            entering={SlideInDown.springify().damping(15)}
            style={styles.card}
          >
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#888"
                style={styles.iconLeft}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                style={styles.input}
                value={username}
                onChangeText={handleChange('username')}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#888"
                style={styles.iconLeft}
              />
              <TextInput
                placeholder={'Contraseña'}
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                onChangeText={handleChange('password')}
              />
              <Ionicons name="eye-outline" size={20} color="#888" />
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity>
                <Text style={styles.forgotText}>
                  {'¿Olvidaste tu contraseña?'}
                </Text>
              </TouchableOpacity>
            </View>

            <Animated.View entering={ZoomIn.delay(200)}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>{'Iniciar sesión'}</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.footerText}>
              <Text style={{ color: '#999' }}>{'¿No tienes una cuenta?'}</Text>
              <TouchableOpacity>
                <Text style={styles.signUp}>{'Regístrate'}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#fff',
    marginTop: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#DDE6FF',
    textAlign: 'center',
    marginTop: 8,
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
    marginTop: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  googleButtonText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E6EB',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1B1F23',
  },
  passwordWrapper: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0,
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 12,
    color: COLORS.light.primary,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: COLORS.light.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUp: {
    color: COLORS.light.primary,
    fontWeight: '500',
  },
  gradient: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  iconLeft: {
    marginRight: 8,
  },
});
