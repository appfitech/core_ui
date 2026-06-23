import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast, { BaseToastProps } from 'react-native-toast-message';

import { AppText } from '@/components/AppText';
import { THEME } from '@/constants/theme';

type MatchToastProps = BaseToastProps & {
  props?: { onPress?: () => void };
};

type ContractToastProps = BaseToastProps & {
  props?: { onPress?: () => void; ctaLabel?: string };
};

function InfoSuccessToast({ text1, text2 }: BaseToastProps) {
  return (
    <Animated.View entering={FadeInDown.duration(220)} style={toastStyles.card}>
      <View style={toastStyles.iconWrap}>
        <Ionicons
          name="checkmark-circle-outline"
          size={22}
          color={THEME.brand.primaryLight}
        />
      </View>
      <View style={toastStyles.textWrap}>
        {!!text1 && (
          <AppText variant="bodySemibold" style={toastStyles.title}>
            {text1}
          </AppText>
        )}
        {!!text2 && (
          <AppText variant="caption" style={toastStyles.subtitle}>
            {text2}
          </AppText>
        )}
      </View>
    </Animated.View>
  );
}

const toastStyles = StyleSheet.create({
  card: {
    width: '92%',
    maxWidth: 360,
    alignSelf: 'center',
    marginTop: 56,
    backgroundColor: THEME.background.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.border.default,
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 12 },
    }),
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.brand.primarySoft,
  },
  textWrap: { flex: 1, rowGap: 4, paddingTop: 4 },
  title: { color: THEME.text.primary },
  subtitle: { color: THEME.text.secondary, lineHeight: 18 },
  matchCard: {
    width: '92%',
    maxWidth: 380,
    alignSelf: 'center',
    marginTop: 56,
    backgroundColor: 'rgba(5, 6, 7, 0.94)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.brand.primary,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    ...Platform.select({
      ios: {
        shadowColor: THEME.brand.primary,
        shadowOpacity: 0.35,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 14 },
    }),
  },
  matchIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.brand.primarySoft,
  },
  matchEmoji: { fontSize: 22, lineHeight: 26 },
  matchTitle: { color: THEME.text.primary },
  matchSubtitle: { color: THEME.text.secondary, lineHeight: 18 },
  matchCta: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: THEME.brand.primary,
  },
  matchCtaText: { color: THEME.text.inverse },
  contractCard: {
    width: '92%',
    maxWidth: 380,
    alignSelf: 'center',
    marginTop: 56,
    backgroundColor: 'rgba(5, 6, 7, 0.94)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.brand.primary,
    rowGap: 12,
    ...Platform.select({
      ios: {
        shadowColor: THEME.brand.primary,
        shadowOpacity: 0.35,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 14 },
    }),
  },
  contractHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 12,
  },
  contractCta: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: THEME.brand.primary,
  },
  contractCtaText: { color: THEME.text.inverse, textAlign: 'center' },
});

export const toastConfig = {
  success: InfoSuccessToast,
  info: InfoSuccessToast,
  match: ({ text1, text2, props }: MatchToastProps) => (
    <Animated.View
      entering={FadeInDown.duration(280)}
      style={toastStyles.matchCard}
    >
      <View style={toastStyles.matchIconWrap}>
        <AppText style={toastStyles.matchEmoji}>✨</AppText>
      </View>
      <View style={toastStyles.textWrap}>
        <AppText variant="bodySemibold" style={toastStyles.matchTitle}>
          {text1}
        </AppText>
        {!!text2 && (
          <AppText variant="caption" style={toastStyles.matchSubtitle}>
            {text2}
          </AppText>
        )}
      </View>

      {props?.onPress ? (
        <Pressable
          onPress={props.onPress as () => void}
          style={toastStyles.matchCta}
        >
          <AppText variant="smallSemibold" style={toastStyles.matchCtaText}>
            Abrir chat
          </AppText>
        </Pressable>
      ) : null}
    </Animated.View>
  ),
  contract: ({ text1, text2, props }: ContractToastProps) => (
    <Animated.View
      entering={FadeInDown.duration(280)}
      style={toastStyles.contractCard}
    >
      <View style={toastStyles.contractHeaderRow}>
        <View style={toastStyles.matchIconWrap}>
          <Ionicons
            name="chatbubbles-outline"
            size={22}
            color={THEME.brand.primaryLight}
          />
        </View>
        <View style={toastStyles.textWrap}>
          <AppText variant="bodySemibold" style={toastStyles.matchTitle}>
            {text1}
          </AppText>
          {!!text2 && (
            <AppText variant="caption" style={toastStyles.matchSubtitle}>
              {text2}
            </AppText>
          )}
        </View>
      </View>

      {props?.onPress ? (
        <Pressable
          onPress={props.onPress as () => void}
          style={toastStyles.contractCta}
        >
          <AppText variant="smallSemibold" style={toastStyles.contractCtaText}>
            {props.ctaLabel ?? 'Ir a chats'}
          </AppText>
        </Pressable>
      ) : null}
    </Animated.View>
  ),
} as const;

// Convenience helpers
export function showMatchToast(opts: {
  name: string;
  type: 'gymbro' | 'gymcrush';
  onOpenChat?: () => void;
}) {
  const name = opts?.name?.trim();
  Toast.show({
    type: 'match',
    text1:
      opts.type === 'gymbro'
        ? '¡Match de GymBro! 💪'
        : '¡Match en GymCrush! ❤️',
    text2:
      opts.type === 'gymbro'
        ? `Tú y ${name} hicieron match. Armen hora y rutina.`
        : `Tú y ${name} se gustaron. Rompan el hielo con un plan.`,
    props: { onPress: opts?.onOpenChat },
    position: 'top',
    topOffset: 60,
    visibilityTime: 6000,
  });
}

export function showContractToast(opts: {
  title: string;
  message: string;
  ctaLabel: string;
  onOpenChats?: () => void;
}) {
  Toast.show({
    type: 'contract',
    text1: opts.title,
    text2: opts.message,
    props: {
      ctaLabel: opts.ctaLabel,
      onPress: () => {
        Toast.hide();
        opts.onOpenChats?.();
      },
    },
    position: 'top',
    topOffset: 60,
    visibilityTime: 8000,
  });
}

export function showInfoToast(text1: string, text2?: string) {
  Toast.show({
    type: 'success',
    text1,
    text2,
    position: 'top',
    topOffset: 56,
    visibilityTime: 4000,
  });
}
