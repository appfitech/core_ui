import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { GymBroCandidateResponseDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';
import { Tag } from './Tag';

type Props = {
  candidate: GymBroCandidateResponseDto;
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CARD_W = SCREEN_W * 0.9;
const CARD_H = Math.min(320, SCREEN_H * 0.45);
const IMAGE_H = Math.round(CARD_H * 0.52);

export function MatchProfileCard({ candidate }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.card, { width: CARD_W, height: CARD_H }]}>
      <ImageBackground
        source={{ uri: `https://appfitech.com${candidate?.profilePhotoUrl}` }}
        style={{ height: IMAGE_H }}
        imageStyle={styles.imageContainer}
        resizeMode="cover"
      />
      <View style={styles.cardFooter}>
        <View style={{ gap: 6 }}>
          <AppText style={styles.nameText}>
            {`${candidate?.firstName} ${candidate?.lastName}`}
            {candidate.age ? `, ${candidate.age}` : ''}
          </AppText>
          {candidate?.age && (
            <AppText style={styles.otherText}>
              {`${candidate.age} años`}
            </AppText>
          )}
          <View style={styles.tagsContainer}>
            {candidate.city && (
              <Tag
                backgroundColor={theme.warning}
                textColor={theme.warningText}
                label={candidate.city}
              />
            )}
            {candidate.fitnessLevel && (
              <Tag
                backgroundColor={theme.warning}
                textColor={theme.warningText}
                label={candidate.fitnessLevel}
              />
            )}
          </View>

          {!!candidate.bio && (
            <AppText style={styles.bioText}>{candidate.bio}</AppText>
          )}
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: {
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.warningBorder,
    },
    cardFooter: {
      padding: 16,
      gap: 10,
      backgroundColor: theme.warningBackground,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      flex: 1,
    },
    imageContainer: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    nameText: {
      ...HEADING_STYLES(theme).title,
      textAlign: 'left',
    },
    otherText: {
      ...HEADING_STYLES(theme).subtitle,
      textAlign: 'left',
    },
    tagsContainer: {
      flex: 1,
      flexDirection: 'row',
      columnGap: 6,
    },
    bioText: {
      ...HEADING_STYLES(theme).content,
    },
  });
