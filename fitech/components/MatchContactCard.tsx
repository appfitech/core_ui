import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  GymBroCandidateResponseDto,
  GymCrushCandidateResponseDto,
} from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { getCandidateProfileImageUrl } from '@/utils/user';

import { AppText } from './AppText';
import { AvatarPhoto } from './AvatarPhoto';
import { Button } from './Button';
import { Tag } from './Tag';

type CandidateWithChatId = (
  | GymBroCandidateResponseDto
  | GymCrushCandidateResponseDto
) & {
  chatId?: number;
};

type CandidateWithBioPref = CandidateWithChatId & {
  gymBroShowBioInProfile?: boolean;
  gymCrushShowBioInProfile?: boolean;
};

type Props = {
  candidate: CandidateWithChatId;
  onDiscard: () => void;
};

export function MatchContactCard({ candidate, onDiscard }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const profileImageUrl = getCandidateProfileImageUrl(
    candidate?.profilePhotoUrl,
  );

  const handleContact = () => {
    if (!!candidate?.chatId) {
      router.push(`/chats/${candidate.chatId}`);
    }
  };

  const handleDiscardPress = () => {
    Alert.alert(
      'Quitar match',
      '¿Estás seguro de que quieres quitar este match? Ya no podrás ver su perfil ni enviar mensajes.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Quitar', style: 'destructive', onPress: onDiscard },
      ],
    );
  };

  const showBio =
    !!candidate?.bio &&
    (!!(candidate as CandidateWithBioPref).gymBroShowBioInProfile ||
      !!(candidate as CandidateWithBioPref).gymCrushShowBioInProfile);
  const canChat = candidate?.chatId != null;

  return (
    <View style={styles.card}>
      <View style={styles.dataContainer}>
        <AvatarPhoto url={profileImageUrl ?? ''} />

        <View style={styles.nameBlock}>
          <AppText style={styles.nameText}>
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
          {showBio && (
            <AppText style={styles.bioText} numberOfLines={3}>
              {candidate.bio}
            </AppText>
          )}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          style={styles.buttonFlex}
          buttonStyle={styles.buttonPadding}
          label="Contactar"
          type="secondary"
          onPress={handleContact}
          disabled={!canChat}
        />
        <TouchableOpacity
          style={[styles.discardButton, !canChat && styles.buttonFlex]}
          onPress={handleDiscardPress}
          activeOpacity={0.8}
        >
          <AppText style={styles.discardButtonText}>Quitar</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const headings = textStyles(theme);
  return StyleSheet.create({
    card: {
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      padding: 16,
      rowGap: 14,
    },
    dataContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
    },
    nameBlock: {
      flex: 1,
      minWidth: 0,
      rowGap: 4,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    buttonFlex: {
      flex: 1,
    },
    buttonPadding: {
      paddingVertical: 11,
    },
    discardButton: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 14,
      backgroundColor: theme.backgroundInput,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    discardButtonText: {
      ...headings.subtitle,
      color: theme.error,
      fontWeight: '700',
    },
    nameText: {
      ...headings.title,
      fontSize: 18,
      textAlign: 'left',
    },
    otherText: {
      ...headings.subtitle,
      textAlign: 'left',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: 6,
      rowGap: 4,
    },
    bioText: {
      ...headings.content,
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
  });
};
