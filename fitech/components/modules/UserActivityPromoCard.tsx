import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { getClientResourceValidityValue } from '@/components/list/client-resource-dates';
import { Tag } from '@/components/Tag';
import { ACTIVITY_BACKGROUNDS } from '@/constants/activity-backgrounds';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { isDietResourceType } from '@/utils/resources';

const CARD_MIN_HEIGHT = 228;

type Props = {
  item: ClientResourceResponseDtoReadable;
  width: number;
  onPress: () => void;
};

const { userActivitiesSection: copy } = TRANSLATIONS;

export function UserActivityPromoCard({ item, width, onPress }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const isDiet = isDietResourceType(item.resourceType);
  const background = isDiet
    ? ACTIVITY_BACKGROUNDS.diet
    : ACTIVITY_BACKGROUNDS.routine;

  const hasDates = !!(item.startDate || item.endDate);
  const subtitle = item.trainerName
    ? copy.trainerSubtitle.replace('{name}', item.trainerName)
    : hasDates
      ? copy.validitySubtitle.replace(
          '{range}',
          getClientResourceValidityValue(item),
        )
      : '';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && styles.cardPressed,
      ]}
    >
      <ImageBackground
        source={background}
        style={styles.imageBackground}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)']}
          locations={[0.45, 1]}
          style={styles.bottomGradient}
        />

        <View style={styles.content}>
          <View style={styles.bottomBlock}>
            <Tag
              label={isDiet ? copy.dietBadge : copy.routineBadge}
              backgroundColor={theme.brand.primaryDark}
              textColor={theme.background.app}
            />

            <AppText
              variant="bodySemibold"
              style={styles.title}
              numberOfLines={2}
            >
              {item.resourceName ?? copy.defaultTitle}
            </AppText>

            {subtitle ? (
              <AppText
                variant="small"
                style={styles.subtitle}
                numberOfLines={2}
              >
                {subtitle}
              </AppText>
            ) : null}

            <View style={styles.detailLink}>
              <AppText style={styles.detailText}>{copy.viewDetail}</AppText>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.brand.primary}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    card: {
      minHeight: CARD_MIN_HEIGHT,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    cardPressed: {
      opacity: 0.92,
    },
    imageBackground: {
      flex: 1,
      minHeight: CARD_MIN_HEIGHT,
      justifyContent: 'flex-end',
    },
    image: {
      borderRadius: 16,
    },
    bottomGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '52%',
    },
    content: {
      flex: 1,
      minHeight: CARD_MIN_HEIGHT,
      justifyContent: 'flex-end',
      paddingHorizontal: 12,
      paddingBottom: 14,
    },
    bottomBlock: {
      rowGap: 6,
    },
    title: {
      color: theme.text.primary,
    },
    subtitle: {
      color: theme.text.primary,
      opacity: 0.88,
    },
    detailLink: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      columnGap: 2,
      marginTop: 4,
    },
    detailText: {
      ...text.smallSemibold,
      color: theme.brand.primary,
    },
  });
};
