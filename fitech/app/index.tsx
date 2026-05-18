import { useRouter } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
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
          source={require('../assets/images/logos/rounded_logo.webp')}
          style={styles.logo}
          resizeMode={'contain'}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(200).duration(800)}
        style={styles.textContainer}
      >
        <AppText variant="header">{welcomeScreen.header}</AppText>
        <AppText variant="subheader">{welcomeScreen.subheader}</AppText>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).duration(800)}
        style={styles.buttonContainer}
      >
        <Button
          label={welcomeScreen.createAccountButton}
          onPress={handleRegisterClick}
        />
        <Button
          label={welcomeScreen.logInButton}
          onPress={handleLoginClick}
          type={'secondary'}
        />
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
    buttonContainer: {
      width: '100%',
      gap: 16,
    },
  });
