import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useTheme } from '@/contexts/ThemeContext';
import { useAuthRedirect } from '@/hooks/use-auth-reditect';
import { FullTheme } from '@/types/theme';

import { TRANSLATIONS } from '../constants/strings';

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const styles = getThemedStyles(theme);

  useAuthRedirect();

  const { welcomeScreen } = TRANSLATIONS;

  const router = useRouter();

  const handleRegisterClick = () => {
    router.push('/register');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.duration(800)}
        style={styles.logoContainer}
      >
        <Image
          source={require('../assets/images/logos/logo.png')}
          style={styles.logo}
          resizeMode={'contain'}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(200).duration(800)}
        style={styles.textContainer}
      >
        <Text style={styles.title}>{welcomeScreen.header}</Text>
        <Text style={styles.subtitle}>{welcomeScreen.subheader}</Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).duration(800)}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRegisterClick}
        >
          <Text style={styles.primaryButtonText}>
            {welcomeScreen.createAccountButton}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleLoginClick}
        >
          <Text style={styles.secondaryButtonText}>
            {welcomeScreen.logInButton}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const getThemedStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    logoContainer: {
      marginBottom: 32,
      width: '60%',
      alignItems: 'center',
    },
    logo: {
      width: '100%',
      height: 200,
    },
    textContainer: {
      marginBottom: 40,
      alignItems: 'center',
    },
    title: {
      color: theme.textPrimary,
      fontSize: 34,
      fontFamily: 'Urbanist_700Bold',
      marginTop: 12,
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: 18,
      color: theme.textSecondary,
      marginTop: 8,
    },
    buttonContainer: {
      width: '100%',
      gap: 16,
    },
    primaryButton: {
      backgroundColor: theme.green500,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: '600',
    },
    secondaryButton: {
      borderColor: theme.green700,
      borderWidth: 2,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: theme.green700,
      fontSize: 18,
      fontWeight: '600',
    },
  });
