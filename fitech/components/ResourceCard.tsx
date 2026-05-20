import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { getClientResourceValidityValue } from '@/components/list/client-resource-dates';
import { RESOURCE_LIST_BACKGROUNDS } from '@/constants/activity-backgrounds';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { isDietResourceType } from '@/utils/resources';

const CARD_MIN_HEIGHT = 108;

type Props = {
  resource: ClientResourceResponseDtoReadable;
  onClick: (resourceId: number) => void;
};

const { clientResourceScreen: copy } = TRANSLATIONS;

export function ResourceCard({ onClick, resource }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const isDiet = isDietResourceType(resource.resourceType);
  const background = isDiet
    ? RESOURCE_LIST_BACKGROUNDS.diet
    : RESOURCE_LIST_BACKGROUNDS.routine;

  const handlePress = useCallback(() => {
    if (!resource?.id) return;
    onClick(resource.id);
  }, [resource?.id, onClick]);

  const hasDates = !!(resource?.startDate || resource?.endDate);
  const validityValue = hasDates
    ? getClientResourceValidityValue(resource)
    : null;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <ImageBackground
        source={background}
        style={styles.imageBackground}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <AppText style={styles.title} numberOfLines={2}>
            {resource.resourceName}
          </AppText>

          {resource.trainerName ? (
            <InfoRow
              icon="person-outline"
              text={resource.trainerName}
              styles={styles}
              theme={theme}
            />
          ) : null}

          {validityValue ? (
            <InfoRow
              icon="calendar-outline"
              text={validityValue}
              styles={styles}
              theme={theme}
            />
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
      </ImageBackground>
    </Pressable>
  );
}

function InfoRow({
  icon,
  text,
  styles,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  styles: ReturnType<typeof getStyles>;
  theme: FullTheme;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={15} color={theme.text.tertiary} />
      <AppText style={styles.rowText} numberOfLines={1}>
        {text}
      </AppText>
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    card: {
      minHeight: CARD_MIN_HEIGHT,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    cardPressed: {
      opacity: 0.92,
    },
    imageBackground: {
      minHeight: CARD_MIN_HEIGHT,
      justifyContent: 'center',
    },
    image: {
      borderRadius: 12,
    },
    content: {
      maxWidth: '58%',
      paddingVertical: 14,
      paddingLeft: 14,
      paddingRight: 8,
      rowGap: 6,
    },
    title: {
      ...text.linkSemibold,
      color: theme.text.primary,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
    },
    rowText: {
      ...text.small,
      flex: 1,
      color: theme.text.secondary,
    },
    detailLink: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      columnGap: 2,
      marginTop: 4,
    },
    detailText: {
      ...text.smallSemibold,
      color: theme.brand.primary,
    },
  });
};
