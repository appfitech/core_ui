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

function InfoSuccessToast({ text1, text2 }: BaseToastProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      style={toastStyles.card}
    >
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
});

export const toastConfig = {
  success: InfoSuccessToast,
  info: InfoSuccessToast,
  match: ({ text1, text2, props }: MatchToastProps) => (
    <Animated.View
      entering={FadeInDown.duration(220)}
      style={{
        backgroundColor: '#111827', // near-black (cool look)
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
        marginTop: 60,
        gap: 10,
      }}
    >
      <AppText style={{ fontSize: 22, lineHeight: 22 }}>❤️</AppText>
      <View style={{ flex: 1 }}>
        <AppText variant="bodySemibold" style={{ color: 'white' }}>
          {text1}
        </AppText>
        {!!text2 && (
          <AppText style={{ color: 'rgba(255,255,255,0.8)' }}>{text2}</AppText>
        )}
      </View>

      {props?.onPress && (
        <Pressable
          onPress={props.onPress as () => void}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
          }}
        >
          <AppText variant="smallSemibold" style={{ color: '#111827' }}>
            Abrir chat
          </AppText>
        </Pressable>
      )}
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
