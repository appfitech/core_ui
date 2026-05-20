import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { PublicTrainerDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { getUserAvatarURL } from '@/utils/user';

type Props = {
  trainer: PublicTrainerDtoReadable;
  onPress: () => void;
};

function TrainerListCardComponent({ trainer, onPress }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const avatarUri = getUserAvatarURL(trainer.person);
  const name = [trainer.person?.firstName, trainer.person?.lastName]
    .filter(Boolean)
    .join(' ');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <AppText style={styles.avatarInitial}>
            {name[0]?.toUpperCase() ?? '?'}
          </AppText>
        </View>
      )}
      <View style={styles.content}>
        <AppText style={styles.name} numberOfLines={1}>
          {name || 'Entrenador'}
        </AppText>
        <AppText style={styles.bio} numberOfLines={3}>
          {trainer.person?.bio || 'Sin descripción'}
        </AppText>
        <View style={styles.ctaRow}>
          <AppText style={styles.ctaText}>Ver perfil</AppText>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.brand.primaryLight}
          />
        </View>
      </View>
    </Pressable>
  );
}

export const TrainerListCard = memo(TrainerListCardComponent);

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 16,
      columnGap: 14,
    },
    cardPressed: {
      opacity: 0.88,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.background.input,
    },
    avatarPlaceholder: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.background.input,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitial: {
      ...text.stat,
      color: theme.brand.primaryLight,
    },
    content: {
      flex: 1,
      minWidth: 0,
    },
    name: {
      ...text.leadSemibold,
      color: theme.text.primary,
    },
    bio: {
      ...text.small,
      color: theme.text.secondary,
      marginTop: 4,
      lineHeight: 20,
    },
    ctaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
      marginTop: 10,
    },
    ctaText: {
      ...text.smallSemibold,
      color: theme.brand.primaryLight,
    },
  });
};
