import React, { useRef, useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';

import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  GymBroCandidateResponseDto,
  GymCrushCandidateResponseDto,
} from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { getCandidateProfileImageUrl } from '@/utils/user';

import { AppText } from './AppText';
import { Tag } from './Tag';

type CandidateWithBioPref = (
  | GymBroCandidateResponseDto
  | GymCrushCandidateResponseDto
) & {
  gymBroShowBioInProfile?: boolean;
  gymCrushShowBioInProfile?: boolean;
};

type Props = {
  candidate: GymBroCandidateResponseDto | GymCrushCandidateResponseDto;
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CARD_W = SCREEN_W * 0.9;
const CARD_H = Math.min(420, SCREEN_H * 0.45);
const IMAGE_H = Math.round(CARD_H * 0.42);

export function MatchProfileCard({ candidate }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [imageLoaded, setImageLoaded] = useState(false);
  const loadedForUserIdRef = useRef<number | undefined>(undefined);

  const imageUri = getCandidateProfileImageUrl(candidate?.profilePhotoUrl);
  const isImageReadyForCurrentCandidate =
    imageLoaded && loadedForUserIdRef.current === candidate?.userId;
  const showPlaceholderOverlay = !isImageReadyForCurrentCandidate;

  const handleImageLoadEnd = () => {
    loadedForUserIdRef.current = candidate?.userId;
    setImageLoaded(true);
  };

  return (
    <View style={[styles.card, styles.cardSize]}>
      <View style={[styles.imageHeight, styles.imagePlaceholder]}>
        {imageUri ? (
          <>
            <ImageBackground
              key={imageUri}
              source={{ uri: imageUri }}
              style={styles.imageFill}
              imageStyle={styles.imageContainer}
              resizeMode="cover"
              onLoadEnd={handleImageLoadEnd}
            />
            <View
              style={[
                styles.imagePlaceholderOverlay,
                !showPlaceholderOverlay && styles.imagePlaceholderOverlayHidden,
              ]}
              pointerEvents="none"
            />
          </>
        ) : null}
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.footerContent}>
          <AppText style={styles.nameText} numberOfLines={1}>
            {`${candidate?.firstName} ${candidate?.lastName}`}
            {candidate.age ? `, ${candidate.age}` : ''}
          </AppText>
          {candidate?.age ? (
            <AppText
              style={styles.otherText}
            >{`${candidate.age} años`}</AppText>
          ) : null}
          <View style={styles.tagsContainer}>
            {candidate.city && (
              <Tag
                backgroundColor={theme.primary}
                textColor={theme.background}
                label={candidate.city}
              />
            )}
            {candidate.fitnessLevel && (
              <Tag
                backgroundColor={theme.primary}
                textColor={theme.background}
                label={candidate.fitnessLevel}
              />
            )}
          </View>
          {!!candidate.bio &&
            (!!(candidate as CandidateWithBioPref).gymBroShowBioInProfile ||
              !!(candidate as CandidateWithBioPref)
                .gymCrushShowBioInProfile) && (
              <AppText style={styles.bioText}>{candidate.bio}</AppText>
            )}
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    card: {
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardSize: {
      width: CARD_W,
      height: CARD_H,
    },
    imageHeight: {
      height: IMAGE_H,
      width: '100%',
      overflow: 'hidden',
    },
    imagePlaceholder: {
      backgroundColor: theme.backgroundInput,
    },
    imagePlaceholderOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.backgroundInput,
    },
    imagePlaceholderOverlayHidden: {
      opacity: 0,
    },
    imageFill: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    cardFooter: {
      flex: 1,
      minHeight: 140,
      backgroundColor: theme.card,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 24,
    },
    footerContent: {
      flex: 1,
    },
    imageContainer: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    nameText: {
      ...text.title,
      textAlign: 'left',
    },
    otherText: {
      ...text.subtitle,
      textAlign: 'left',
      marginTop: 4,
    },
    tagsContainer: {
      marginTop: 8,
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: 6,
      rowGap: 4,
    },
    bioText: {
      ...text.body,
      marginTop: 10,
      lineHeight: 22,
      paddingBottom: 16,
    },
  });
};
