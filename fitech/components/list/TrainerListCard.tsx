import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
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
  onPress: () => void;
};

const PHOTO_SIZE = 112;

const { trainersScreen: copy } = TRANSLATIONS;

function TrainerListCardComponent({ trainer, onPress }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const avatarUri = getUserAvatarURL(trainer.person);
  const name =
    [trainer.person?.firstName, trainer.person?.lastName]
      .filter(Boolean)
      .join(' ') || copy.defaultName;
  const bio = trainer.person?.bio?.trim() || copy.noBio;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <AvatarPhoto
        url={avatarUri}
        gender={trainer.person?.gender}
        size={PHOTO_SIZE}
        containerStyle={styles.photo}
        style={styles.photoImage}
      />

      <View style={styles.body}>
        <AppText style={styles.name} numberOfLines={2}>
          {name}
        </AppText>

        <AppText style={styles.bio} numberOfLines={2}>
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
      </View>
    </Pressable>
  );
}

export const TrainerListCard = memo(TrainerListCardComponent);

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: PHOTO_SIZE,
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      overflow: 'hidden',
    },
    cardPressed: {
      opacity: 0.9,
      backgroundColor: theme.background.input,
    },
    photo: {
      width: PHOTO_SIZE,
      height: PHOTO_SIZE,
      borderRadius: 0,
      flexShrink: 0,
    },
    photoImage: {
      width: PHOTO_SIZE,
      height: PHOTO_SIZE,
    },
    body: {
      flex: 1,
      minWidth: 0,
      paddingVertical: 12,
      paddingLeft: 12,
      paddingRight: 14,
      rowGap: 6,
      justifyContent: 'center',
    },
    name: {
      ...text.linkSemibold,
      color: theme.text.primary,
    },
    bio: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 20,
    },
    detailLink: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      columnGap: 2,
      marginTop: 2,
    },
    detailText: {
      ...text.smallSemibold,
      color: theme.brand.primary,
    },
  });
};
