import { useRouter } from 'expo-router';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { TRANSLATIONS } from '@/constants/strings';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import {
  authFadeInUp,
  shouldAnimateAuthButtons,
} from '@/utils/platform-animations';

export default function WelcomeScreen() {
  const styles = getStyles();

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
    <ImageBackground
      source={require('@/assets/images/backgrounds/welcome_bg.jpg')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} pointerEvents="none" />
      <View style={styles.content}>
        <Animated.View
          entering={authFadeInUp(800)}
          style={styles.logoContainer}
        >
          <Image
            source={require('@/assets/images/logos/rounded_logo.webp')}
            style={styles.logo}
            resizeMode={'contain'}
          />
        </Animated.View>

        <Animated.View
          entering={authFadeInUp(800, 200)}
          style={styles.textContainer}
        >
          <AppText variant="header">{welcomeScreen.header}</AppText>
          <AppText variant="subheader">{welcomeScreen.subheader}</AppText>
        </Animated.View>

        <Animated.View
          entering={authFadeInUp(800, 400)}
          style={styles.buttonContainer}
        >
          <Button
            label={welcomeScreen.createAccountButton}
            onPress={handleRegisterClick}
            animated={shouldAnimateAuthButtons()}
          />
          <Button
            label={welcomeScreen.logInButton}
            onPress={handleLoginClick}
            type={'secondary'}
            animated={shouldAnimateAuthButtons()}
          />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
      opacity: 0.85,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(5, 6, 8, 0.65)',
    },
    logoContainer: {
      marginBottom: 32,
      width: '60%',
      alignItems: 'center',
    },
    logo: {
      width: '100%',
      height: 150,
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
