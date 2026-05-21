import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Tag } from '@/components/Tag';
import { MATCH_CARD_HEIGHT, MATCH_CARD_WIDTH } from '@/constants/match-layout';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  GymBroCandidateResponseDto,
  GymCrushCandidateResponseDto,
} from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { markMatchProfileImageReady } from '@/utils/match-profile-image-cache';
import { getCandidateProfileImageUrl } from '@/utils/user';

type CandidateWithBioPref = (
  | GymBroCandidateResponseDto
  | GymCrushCandidateResponseDto
) & {
  gymBroShowBioInProfile?: boolean;
  gymCrushShowBioInProfile?: boolean;
};

type Props = {
  /** Stable slot id — card instance never remounts on promote (a | b). */
  slotId: 'a' | 'b';
  candidate: GymBroCandidateResponseDto | GymCrushCandidateResponseDto;
};

function MatchProfileCardInner({ candidate }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const imageUri = getCandidateProfileImageUrl(candidate?.profilePhotoUrl);

  const showBio =
    !!candidate.bio &&
    (!!(candidate as CandidateWithBioPref).gymBroShowBioInProfile ||
      !!(candidate as CandidateWithBioPref).gymCrushShowBioInProfile);

  const handleImageLoad = () => {
    if (imageUri) markMatchProfileImageReady(imageUri);
  };

  const displayName = [candidate?.firstName, candidate?.lastName]
    .filter(Boolean)
    .join(' ');
  const nameLine = candidate.age
    ? `${displayName}, ${candidate.age}`
    : displayName;

  return (
    <View style={styles.card}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.photo}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
          onLoad={handleImageLoad}
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.placeholderBg]} />
      )}
      <LinearGradient
        colors={[
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.1)',
          'rgba(0,0,0,0.55)',
          'rgba(0,0,0,0.88)',
        ]}
        locations={[0, 0.35, 0.65, 1]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      <View style={styles.overlayContent}>
        <AppText style={styles.nameText} numberOfLines={2}>
          {nameLine}
        </AppText>
        {(candidate.city || candidate.fitnessLevel) && (
          <View style={styles.tagsContainer}>
            {candidate.city ? (
              <Tag
                backgroundColor="rgba(255,255,255,0.18)"
                textColor="#fff"
                label={candidate.city}
              />
            ) : null}
            {candidate.fitnessLevel ? (
              <Tag
                backgroundColor="rgba(255,255,255,0.18)"
                textColor="#fff"
                label={candidate.fitnessLevel}
              />
            ) : null}
          </View>
        )}
        {showBio ? (
          <AppText style={styles.bioText} numberOfLines={4}>
            {candidate.bio}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

function propsAreEqual(prev: Props, next: Props) {
  return (
    prev.slotId === next.slotId &&
    prev.candidate?.userId === next.candidate?.userId &&
    prev.candidate?.profilePhotoUrl === next.candidate?.profilePhotoUrl &&
    prev.candidate?.firstName === next.candidate?.firstName &&
    prev.candidate?.lastName === next.candidate?.lastName &&
    prev.candidate?.age === next.candidate?.age &&
    prev.candidate?.bio === next.candidate?.bio &&
    prev.candidate?.city === next.candidate?.city &&
    prev.candidate?.fitnessLevel === next.candidate?.fitnessLevel &&
    (prev.candidate as CandidateWithBioPref).gymBroShowBioInProfile ===
      (next.candidate as CandidateWithBioPref).gymBroShowBioInProfile &&
    (prev.candidate as CandidateWithBioPref).gymCrushShowBioInProfile ===
      (next.candidate as CandidateWithBioPref).gymCrushShowBioInProfile
  );
}

export const MatchProfileCard = memo(MatchProfileCardInner, propsAreEqual);

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    card: {
      width: MATCH_CARD_WIDTH,
      height: MATCH_CARD_HEIGHT,
      borderRadius: 28,
      overflow: 'hidden',
      backgroundColor: theme.background.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border.default,
    },
    photo: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    placeholderBg: {
      backgroundColor: theme.background.input,
    },
    overlayContent: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 20,
      paddingBottom: 22,
      paddingTop: 48,
    },
    nameText: {
      ...text.title,
      color: '#fff',
      textAlign: 'left',
    },
    tagsContainer: {
      marginTop: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: 8,
      rowGap: 6,
    },
    bioText: {
      ...text.body,
      color: 'rgba(255,255,255,0.92)',
      marginTop: 10,
      lineHeight: 22,
    },
  });
};
