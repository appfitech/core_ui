import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ROUTES } from '@/constants/routes';
import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { extractErrorMessage } from '@/utils/errors';

import { TRANSLATIONS } from '../../constants/strings';
import { useLogin } from '../api/mutations/useLogin';
import { AnimatedAppText } from '../components/AnimatedAppText';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ErrorBanner } from '../components/ErrorBanner';
import PageContainer from '../components/PageContainer';
import { TextInput } from '../components/TextInput';

export default function LoginScreen() {
  const { theme } = useTheme();
  useAuthRedirect();

  const { loginScreen } = TRANSLATIONS;
  const styles = getStyles(theme);

  const [showUI, setShowUI] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayPass, setDisplayPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const { mutate: submitLogin } = useLogin();

  useEffect(() => {
    const t = setTimeout(() => setShowUI(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!errorMsg) return;

    const t = setTimeout(() => setErrorMsg(null), 10000);

    return () => clearTimeout(t);
  }, [errorMsg]);

  const handleLogin = useCallback(() => {
    setErrorMsg(null);
    submitLogin(
      { username, password },
      {
        onSuccess: (response) => {
          setUser(response);
          router.replace(ROUTES.home);
        },
        onError: (error) => {
          setErrorMsg(extractErrorMessage(error));
        },
      },
    );
  }, [username, password]);

  const handleSignUp = () => {
    router.replace(ROUTES.register);
  };

  const handleToggleDisplayPass = () => {
    setDisplayPass((prev) => !prev);
  };

  return (
    <PageContainer hasBottomPadding={false} style={{ paddingHorizontal: 24 }}>
      <View style={styles.headerWrapper}>
        <Animated.Image
          entering={FadeInUp.duration(600)}
          source={require('../../assets/images/logos/rounded_logo.webp')}
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
        <Card style={{ marginTop: 20 }}>
          <ErrorBanner
            errorMessage={errorMsg}
            onClear={() => setErrorMsg(null)}
          />

          <View style={styles.inputWrapper}>
            <Feather
              name="at-sign"
              size={20}
              color={theme.dark800}
              style={styles.iconLeft}
            />
            <TextInput
              placeholder="Usuario"
              placeholderTextColor={theme.dark800}
              keyboardType="email-address"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather
              name="lock"
              size={20}
              color={theme.dark800}
              style={styles.iconLeft}
            />
            <TextInput
              placeholder="Contraseña"
              secureTextEntry={!displayPass}
              value={password}
              style={{ marginBottom: 0 }}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={handleToggleDisplayPass}>
              <Feather
                name={!displayPass ? 'eye' : 'eye-off'}
                size={20}
                color={theme.dark800}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity>
              <AppText style={styles.forgotText}>
                {'¿Olvidaste tu contraseña?'}
              </AppText>
            </TouchableOpacity>
          </View>

          <Button
            label={'Iniciar sesión'}
            onPress={handleLogin}
            style={{ marginTop: 24 }}
          />

          <View style={styles.footerText}>
            <AppText
              style={{ color: theme.dark400, fontSize: 18, fontWeight: '500' }}
            >
              {'¿No tienes una cuenta?'}
            </AppText>
            <TouchableOpacity onPress={handleSignUp}>
              <AppText style={styles.signUp}>{'Regístrate'}</AppText>
            </TouchableOpacity>
          </View>
        </Card>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    headerWrapper: {
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
      marginTop: 30,
    },
    headerSubtitle: {
      ...HEADING_STYLES(theme).subheader,
      marginTop: 8,
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
