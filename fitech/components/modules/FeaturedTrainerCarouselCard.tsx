import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { AvatarPhoto } from '@/components/AvatarPhoto';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { PublicTrainerDtoReadable } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { getUserAvatarURL } from '@/utils/user';

type Props = {
  trainer: PublicTrainerDtoReadable;
  width: number;
  onPress: () => void;
};

const { featuredTrainersSection: copy } = TRANSLATIONS;

export function FeaturedTrainerCarouselCard({
  trainer,
  width,
  onPress,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const name =
    [trainer.person?.firstName, trainer.person?.lastName]
      .filter(Boolean)
      .join(' ') || copy.defaultName;
  const bio = trainer.person?.bio?.trim() || copy.noBio;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && styles.cardPressed,
      ]}
    >
      <AvatarPhoto
        url={getUserAvatarURL(trainer.person)}
        gender={trainer.person?.gender}
        size={72}
      />

      <AppText style={styles.name} numberOfLines={2}>
        {name}
      </AppText>

      <AppText style={styles.bio} numberOfLines={4}>
        {bio}
      </AppText>

      <View style={styles.detailLink}>
        <AppText style={styles.detailText}>{copy.viewProfile}</AppText>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={theme.brand.primary}
        />
      </View>
    </Pressable>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 16,
      alignItems: 'center',
      rowGap: 10,
      minHeight: 220,
    },
    cardPressed: {
      opacity: 0.9,
      backgroundColor: theme.background.input,
    },
    name: {
      ...text.linkSemibold,
      color: theme.text.primary,
      textAlign: 'center',
    },
    bio: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 20,
      textAlign: 'center',
      alignSelf: 'stretch',
    },
    detailLink: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 2,
      marginTop: 4,
    },
    detailText: {
      ...text.smallSemibold,
      color: theme.brand.primary,
    },
  });
};
