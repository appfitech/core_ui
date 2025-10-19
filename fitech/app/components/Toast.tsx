import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast, { BaseToastProps } from 'react-native-toast-message';

import { AppText } from '@/app/components/AppText';

export const toastConfig = {
  match: ({ text1, text2, props }: BaseToastProps) => (
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
        <AppText style={{ color: 'white', fontWeight: '800' }}>{text1}</AppText>
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
            backgroundColor: 'white',
          }}
        >
          <AppText style={{ fontWeight: '800' }}>Abrir chat</AppText>
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
    topOffset: 60,
  });
}
