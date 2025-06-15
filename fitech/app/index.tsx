import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS } from './constants/colors';
import { TRANSLATIONS } from './constants/strings';
import { useAuthRedirect } from './hooks/use-auth-reditect';

export default function WelcomeScreen() {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark.background,
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
    color: COLORS.dark.textPrimary,
    fontSize: 32,
    fontFamily: 'Urbanist_700Bold',
    marginTop: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.dark.textSecondary,
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.light.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderColor: COLORS.light.accent,
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.light.accent,
    fontSize: 16,
    fontWeight: '600',
  },
});
