import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ConfettiAnimation from '@/assets/lottie/confetti.json';
import { AppText } from '@/components/AppText';
import { AvatarPhoto } from '@/components/AvatarPhoto';
import { Button } from '@/components/Button';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { AppTheme } from '@/types/theme';
import { MatchCelebrationPayload } from '@/utils/match-celebration';
import { getUserAvatarURL } from '@/utils/user';

const AUTO_DISMISS_MS = 4500;
const copy = TRANSLATIONS.matchCelebration;

type Props = {
  celebration: MatchCelebrationPayload | null;
  onDismiss: () => void;
  onViewMatches?: () => void;
};

export function MatchCelebrationModal({
  celebration,
  onDismiss,
  onViewMatches,
}: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const styles = getStyles(theme);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const person = useUserStore((s) => s.user?.user?.person);
  const myPhotoUrl = getUserAvatarURL(person);
  const myGender = person?.gender;

  const visible = celebration != null;

  useEffect(() => {
    if (!visible) {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
      return;
    }

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    dismissTimerRef.current = setTimeout(() => {
      onDismiss();
    }, AUTO_DISMISS_MS);

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, [visible, onDismiss]);

  if (!celebration) return null;

  const isGymBro = celebration.type === 'gymbro';
  const title = isGymBro ? copy.gymbroTitle : copy.gymcrushTitle;
  const subtitle = (isGymBro ? copy.gymbroSubtitle : copy.gymcrushSubtitle).replace(
    '{name}',
    celebration.name,
  );

  const handleDismiss = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    onDismiss();
  };

  const handleViewMatches = () => {
    handleDismiss();
    onViewMatches?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <View style={styles.backdrop}>
        <View
          pointerEvents="none"
          style={[styles.confetti, { width, height }]}
        >
          <LottieView
            source={ConfettiAnimation}
            autoPlay
            loop={false}
            resizeMode="cover"
            style={{ width: '100%', height: '100%' }}
          />
        </View>

        <Animated.View
          entering={FadeIn.duration(280)}
          style={[styles.content, { paddingTop: insets.top + 24 }]}
          pointerEvents="box-none"
        >
          <Animated.View
            entering={ZoomIn.delay(120).duration(420).springify()}
            style={styles.avatarCluster}
          >
            <View style={[styles.avatarWrap, styles.avatarWrapLeft]}>
              <AvatarPhoto
                url={myPhotoUrl}
                gender={myGender}
                size={96}
                containerStyle={styles.avatarRing}
              />
            </View>
            <View style={[styles.avatarWrap, styles.avatarWrapRight]}>
              <AvatarPhoto
                url={celebration.photoUrl}
                size={96}
                containerStyle={[
                  styles.avatarRing,
                  isGymBro ? styles.avatarRingGymBro : styles.avatarRingGymCrush,
                ]}
              />
            </View>
            <View
              style={[
                styles.matchBadge,
                isGymBro ? styles.matchBadgeGymBro : styles.matchBadgeGymCrush,
              ]}
            >
              <AppText style={styles.matchBadgeText}>
                {isGymBro ? '💪' : '❤️'}
              </AppText>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(220).duration(400)}>
            <AppText style={styles.title}>{title}</AppText>
            <AppText style={styles.subtitle}>{subtitle}</AppText>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(320).duration(400)}
            style={styles.actions}
          >
            {onViewMatches ? (
              <Button
                label={copy.viewMatches}
                type="primary"
                onPress={handleViewMatches}
                animated={false}
              />
            ) : null}
            <Button
              label={copy.continue}
              type={onViewMatches ? 'secondary' : 'primary'}
              onPress={handleDismiss}
              animated={false}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(5, 6, 7, 0.92)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    confetti: {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0.95,
    },
    content: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 28,
      alignItems: 'center',
      justifyContent: 'center',
      rowGap: 28,
    },
    avatarCluster: {
      width: 200,
      height: 110,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarWrap: {
      position: 'absolute',
      top: 0,
    },
    avatarWrapLeft: {
      left: 8,
      transform: [{ rotate: '-8deg' }],
    },
    avatarWrapRight: {
      right: 8,
      transform: [{ rotate: '8deg' }],
    },
    avatarRing: {
      borderWidth: 3,
      borderColor: theme.brand.primary,
      borderRadius: 999,
      overflow: 'hidden',
    },
    avatarRingGymBro: {
      borderColor: theme.brand.primary,
    },
    avatarRingGymCrush: {
      borderColor: '#FF6B8A',
    },
    matchBadge: {
      position: 'absolute',
      bottom: 0,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.background.app,
    },
    matchBadgeGymBro: {
      backgroundColor: theme.brand.primaryDark,
    },
    matchBadgeGymCrush: {
      backgroundColor: '#FF6B8A',
    },
    matchBadgeText: {
      fontSize: 20,
      lineHeight: 24,
    },
    title: {
      ...text.display,
      color: theme.text.primary,
      textAlign: 'center',
      letterSpacing: 0.3,
    },
    subtitle: {
      ...text.body,
      color: theme.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      marginTop: 10,
      maxWidth: 320,
    },
    actions: {
      width: '100%',
      maxWidth: 320,
      rowGap: 10,
      marginTop: 8,
    },
  });
};
