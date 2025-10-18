import { StyleSheet, View } from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { GymBroCandidateResponseDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';
import { AvatarPhoto } from './AvatarPhoto';
import { Button } from './Button';
import { Tag } from './Tag';

type Props = {
  candidate: GymBroCandidateResponseDto;
  onContact: () => void;
  onDiscard: () => void;
};

export function MatchContactCard({ candidate, onDiscard, onContact }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.dataContainer}>
        <AvatarPhoto
          url={
            candidate?.profilePhotoUrl
              ? `https://appfitech.com${candidate?.profilePhotoUrl}`
              : ''
          }
        />

        <View style={{ gap: 2, flex: 1 }}>
          <AppText style={styles.nameText}>
            {`${candidate?.firstName} ${candidate?.lastName}`}
            {candidate.age ? `, ${candidate.age}` : ''}
          </AppText>
          {candidate?.age && (
            <AppText
              style={styles.otherText}
            >{`${candidate.age} años`}</AppText>
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
      <View style={styles.buttonsContainer}>
        <Button
          style={{ flex: 1 }}
          buttonStyle={{ paddingVertical: 11 }}
          label={'Contactar'}
          type="tertiary"
          onPress={onContact}
        />
        <Button
          type="destructive"
          style={{ flex: 1 }}
          buttonStyle={{ paddingVertical: 11 }}
          label={'Quitar'}
          onPress={onDiscard}
        />
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
      borderColor: theme.dark300,
      backgroundColor: theme.dark100,
      gap: 12,
      padding: 12,
    },
    dataContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    buttonsContainer: {
      gap: 8,
      flexDirection: 'row',
      flex: 1,
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
      ...HEADING_STYLES(theme).subtitle,
      fontWeight: 800,
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
