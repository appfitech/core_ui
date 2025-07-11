import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
  const [displayPass, setDisplayPass] = useState(false);

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
          router.replace(ROUTES.home);
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
    <LinearGradient
      colors={[theme.background, theme.background]}
      style={styles.gradient}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContainer}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={Platform.OS === 'android' ? 100 : 60}
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
                  style={[styles.input, { flex: 1 }]}
                  value={username}
                  onChangeText={handleChange('username')}
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
                  placeholder={'Contraseña'}
                  placeholderTextColor={theme.dark800}
                  secureTextEntry={!displayPass}
                  value={password}
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  onChangeText={handleChange('password')}
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

              <Animated.View entering={ZoomIn.delay(200)}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleLogin}
                >
                  <AppText style={styles.submitText}>
                    {'Iniciar sesión'}
                  </AppText>
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
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 100,
      paddingBottom: 40,
      justifyContent: 'flex-start',
      alignItems: 'center',
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
      shadowColor: theme.background,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 6,
      marginTop: 20,
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
