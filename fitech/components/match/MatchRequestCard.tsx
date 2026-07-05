import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Tag } from '@/components/Tag';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { MatchRequestCandidate } from '@/lib/api/queries/matches/use-get-match-requests';
import { MatchScreenType } from '@/types/forms';
import { AppTheme } from '@/types/theme';
import { getCandidateProfileImageUrl } from '@/utils/user';

const PHOTO_WIDTH = 96;
const PHOTO_HEIGHT = 120;

type CandidateWithBioPref = MatchRequestCandidate & {
  gymBroShowBioInProfile?: boolean;
  gymCrushShowBioInProfile?: boolean;
};

type Props = {
  candidate: MatchRequestCandidate;
  type: MatchScreenType;
  onMatch: () => void;
  onPass: () => void;
};

export function MatchRequestCard({
  candidate,
  type,
  onMatch,
  onPass,
}: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const imageUri = getCandidateProfileImageUrl(candidate?.profilePhotoUrl);

  const displayName = [candidate?.firstName, candidate?.lastName]
    .filter(Boolean)
    .join(' ');

  const nameLine = displayName
    ? candidate.age != null
      ? `${displayName}, ${candidate.age}`
      : displayName
    : '';

  const showBio =
    !!candidate?.bio &&
    (type === 'gymbro'
      ? !!(candidate as CandidateWithBioPref).gymBroShowBioInProfile
      : !!(candidate as CandidateWithBioPref).gymCrushShowBioInProfile);

  const matchIcon =
    type === 'gymbro' ? ('barbell' as const) : ('heart' as const);
  const matchLabel =
    type === 'gymbro' ? 'Aceptar solicitud GymBro' : 'Aceptar solicitud GymCrush';

  return (
    <View style={styles.card}>
      <View style={styles.photoWrap}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.photo}
            contentFit="cover"
            transition={0}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="person" size={36} color={theme.text.tertiary} />
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          {nameLine ? (
            <AppText style={styles.nameText} numberOfLines={2}>
              {nameLine}
            </AppText>
          ) : (
            <View style={styles.nameSpacer} />
          )}

          <View style={styles.actions}>
            <Pressable
              onPress={onMatch}
              accessibilityRole="button"
              accessibilityLabel={matchLabel}
              style={({ pressed }) => [
                styles.actionButton,
                type === 'gymbro' ? styles.matchButtonGymBro : styles.matchButtonGymCrush,
                pressed && styles.actionPressed,
              ]}
            >
              <Ionicons
                name={matchIcon}
                size={20}
                color={theme.background.app}
              />
            </Pressable>

            <Pressable
              onPress={onPass}
              accessibilityRole="button"
              accessibilityLabel="Rechazar solicitud"
              style={({ pressed }) => [
                styles.actionButton,
                styles.passButton,
                pressed && styles.actionPressed,
              ]}
            >
              <Ionicons
                name="close"
                size={20}
                color={theme.status.error.icon}
              />
            </Pressable>
          </View>
        </View>

        {(candidate.city || candidate.fitnessLevel) && (
          <View style={styles.tagsContainer}>
            {candidate.city ? (
              <Tag
                backgroundColor={theme.brand.primarySoft}
                textColor={theme.brand.primary}
                label={candidate.city}
              />
            ) : null}
            {candidate.fitnessLevel ? (
              <Tag
                backgroundColor={theme.background.input}
                textColor={theme.text.secondary}
                label={candidate.fitnessLevel}
              />
            ) : null}
          </View>
        )}

        {showBio ? (
          <AppText style={styles.bioText} numberOfLines={2}>
            {candidate.bio}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'stretch',
      columnGap: 12,
      padding: 12,
      minHeight: PHOTO_HEIGHT + 24,
      backgroundColor: theme.background.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    photoWrap: {
      width: PHOTO_WIDTH,
      height: PHOTO_HEIGHT,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: theme.background.input,
    },
    photo: {
      width: '100%',
      height: '100%',
    },
    photoPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background.input,
    },
    body: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
      rowGap: 8,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: 8,
    },
    nameText: {
      ...text.leadSemibold,
      flex: 1,
      color: theme.text.primary,
    },
    nameSpacer: {
      flex: 1,
    },
    actions: {
      flexDirection: 'row',
      columnGap: 6,
      flexShrink: 0,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    matchButtonGymBro: {
      backgroundColor: theme.brand.primary,
    },
    matchButtonGymCrush: {
      backgroundColor: '#ff3b30',
    },
    passButton: {
      backgroundColor: theme.status.error.bg,
      borderWidth: 1,
      borderColor: theme.status.error.border,
    },
    actionPressed: {
      opacity: 0.88,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: 6,
      rowGap: 4,
    },
    bioText: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 18,
    },
  });
};
