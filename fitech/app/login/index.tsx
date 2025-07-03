import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInUp,
  SlideInDown,
  ZoomIn,
} from 'react-native-reanimated';

import { ROUTES } from '@/constants/routes';
import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthRedirect } from '@/hooks/use-auth-reditect';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';

import { TRANSLATIONS } from '../../constants/strings';
import { useLogin } from '../api/mutations/useLogin';
import { AnimatedAppText } from '../components/AnimatedAppText';
import { AppText } from '../components/AppText';
import { BackButton } from '../components/BackButton';

export default function LoginScreen() {
  const { theme } = useTheme();
  useAuthRedirect();

  const { loginScreen } = TRANSLATIONS;
  const styles = getStyles(theme);

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
          setUser(response);
          router.replace(ROUTES.onboarding);
        },
      },
    );
  }, [username, password]);

  const handleSignUp = () => {
    router.replace(ROUTES.register);
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
          <Animated.Image
            entering={FadeInUp.duration(600)}
            source={require('../../assets/images/logos/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <AnimatedAppText
            entering={FadeInUp.delay(200)}
            style={styles.headerTitle}
          >
            {loginScreen.header}
          </AnimatedAppText>
          <AnimatedAppText
            entering={FadeInUp.delay(300)}
            style={styles.headerSubtitle}
          >
            {loginScreen.subheader}
          </AnimatedAppText>
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
                color={theme.dark700}
                style={styles.iconLeft}
              />
              <TextInput
                placeholder="Usuario"
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
                color={theme.dark700}
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
                <AppText style={styles.forgotText}>
                  {'¿Olvidaste tu contraseña?'}
                </AppText>
              </TouchableOpacity>
            </View>

            <Animated.View entering={ZoomIn.delay(200)}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogin}
              >
                <AppText style={styles.submitText}>{'Iniciar sesión'}</AppText>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.footerText}>
              <AppText
                style={{
                  color: theme.dark400,
                  fontSize: 18,
                  fontWeight: '500',
                }}
              >
                {'¿No tienes una cuenta?'}
              </AppText>
              <TouchableOpacity onPress={handleSignUp}>
                <AppText style={styles.signUp}>{'Regístrate'}</AppText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
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
      width: 80,
      height: 80,
      marginBottom: 10,
    },
    headerTitle: {
      ...HEADING_STYLES(theme).header,
      fontWeight: '600',
      marginTop: 40,
    },
    headerSubtitle: {
      ...HEADING_STYLES(theme).subheader,
      marginTop: 8,
    },
    card: {
      backgroundColor: theme.backgroundInverted,
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
      fontSize: 16,
      color: theme.dark100,
      fontWeight: '500',
    },
    footerText: {
      marginTop: 50,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    signUp: {
      color: theme.dark100,
      fontWeight: '600',
      marginLeft: 10,
      fontSize: 18,
    },
    gradient: {
      flex: 1,
    },
    iconLeft: {
      marginRight: 8,
    },
    ...SHARED_STYLES(theme),
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundInput,
      borderRadius: 10,
      paddingHorizontal: 12,
      marginBottom: 16,
    },
  });
