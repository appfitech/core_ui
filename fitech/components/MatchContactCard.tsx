import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Tag } from '@/components/Tag';
import { ROUTES } from '@/constants/routes';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  GymBroCandidateResponseDto,
  GymCrushCandidateResponseDto,
} from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { getCandidateProfileImageUrl } from '@/utils/user';

const PHOTO_WIDTH = 96;
const PHOTO_HEIGHT = 120;

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
  const { showAlert } = useAlert();
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
    (!!(candidate as CandidateWithBioPref).gymBroShowBioInProfile ||
      !!(candidate as CandidateWithBioPref).gymCrushShowBioInProfile);

  const handleContact = () => {
    if (candidate.chatId != null) {
      router.push({
        pathname: '/chats/[id]',
        params: {
          id: String(candidate.chatId),
          title: displayName || undefined,
        },
      });
      return;
    }

    router.push(ROUTES.chats);
  };

  const handleDiscardPress = () => {
    showAlert({
      title: 'Quitar match',
      message:
        '¿Seguro que quieres quitar este match? Ya no podrás ver su perfil ni enviar mensajes.',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Quitar', style: 'destructive', onPress: onDiscard },
      ],
    });
  };

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
              onPress={handleContact}
              accessibilityRole="button"
              accessibilityLabel={
                candidate.chatId != null ? 'Abrir chat' : 'Ir a chats'
              }
              style={({ pressed }) => [
                styles.actionButton,
                styles.chatButton,
                pressed && styles.actionPressed,
              ]}
            >
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={theme.background.app}
              />
            </Pressable>

            <Pressable
              onPress={handleDiscardPress}
              accessibilityRole="button"
              accessibilityLabel="Quitar match"
              style={({ pressed }) => [
                styles.actionButton,
                styles.removeButton,
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
    chatButton: {
      backgroundColor: theme.brand.primary,
    },
    removeButton: {
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
