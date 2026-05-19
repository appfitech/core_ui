import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { formStyles, textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetReviews } from '@/lib/api/queries/use-get-reviews';
import { FullTheme } from '@/types/theme';

const EMOJIS = ['😠', '😕', '😐', '🙂', '😄'];
const EMOJIS_LABEL = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Muy bueno'];

type Props = {
  isOpen: boolean;
  onSubmit: (
    rating: number,
    comment: string,
    anonymous: boolean,
    contractId: number,
    existingReviewId?: number | null,
  ) => void;
  onCloseModal: () => void;
  contractId?: number | null;
  existingReviewId?: number | null;
};

export const ReviewModal: React.FC<Props> = ({
  isOpen,
  onCloseModal,
  onSubmit,
  contractId = null,
  existingReviewId = null,
}) => {
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const { theme } = useTheme();

  const { data: reviews } = useGetReviews();

  useEffect(() => {
    if (existingReviewId) {
      const existing = reviews?.find(
        (review) => review.id === existingReviewId,
      );

      if (existing) {
        setRating(existing.rating ?? null);
        setComment(existing.comment ?? '');
        setAnonymous(existing.isAnonymous ?? false);
      }
    }
  }, [reviews, existingReviewId]);

  const styles = getStyles(theme);

  const handleSubmit = () => {
    if (rating && contractId) {
      onSubmit(rating, comment, anonymous, contractId, existingReviewId);
      handleClose();
    }
  };

  const handleClose = () => {
    onCloseModal();
    setComment('');
    setAnonymous(false);
    setRating(5);
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <PageContainer
        hasBackButton={false}
        styleContainer={{ backgroundColor: 'transparent' }}
        style={{
          width: '100%',
          backgroundColor: '#00000088',
        }}
      >
        <View
          style={{
            backgroundColor: theme.background.app,
            padding: 16,
            borderRadius: 12,
            rowGap: 12,
            marginTop: 100,
          }}
        >
          <AppText style={styles.title}>¿Cómo fue tu experiencia?</AppText>
          <View style={styles.emojiRow}>
            {EMOJIS.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setRating(index + 1)}
              >
                <Text
                  style={[
                    styles.emoji,
                    rating === index + 1 && styles.emojiSelected,
                  ]}
                >
                  {emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {rating && (
            <AppText
              style={[styles.ratingLabel, { color: theme.status.warning.text }]}
            >
              {EMOJIS_LABEL[rating - 1]}
            </AppText>
          )}

          <TextInput
            style={[styles.input, { minHeight: 150, textAlignVertical: 'top' }]}
            placeholder="¿Quieres contarnos más?"
            placeholderTextColor={theme.background.elevated}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAnonymous((prev) => !prev)}
          >
            <Ionicons
              name={anonymous ? 'checkbox' : 'square-outline'}
              size={20}
              color={theme.brand.primary}
            />
            <AppText style={[styles.checkboxText, { color: theme.icon.muted }]}>
              Publicar de forma anónima (tu nombre no será visible)
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                backgroundColor: theme.background.card,
                padding: 16,
                borderRadius: 12,
                marginTop: 16,
              },
            ]}
            onPress={handleClose}
            disabled={!rating}
          >
            <AppText
              style={[styles.modalActionText, { color: theme.icon.secondary }]}
            >
              Cancelar
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                backgroundColor: theme.status.info.text,
                padding: 16,
                borderRadius: 12,
              },
            ]}
            onPress={handleSubmit}
            disabled={!rating}
          >
            <AppText
              style={[styles.modalActionText, { color: theme.status.info.bg }]}
            >
              Enviar Reseña
            </AppText>
          </TouchableOpacity>
        </View>
      </PageContainer>
    </Modal>
  );
};

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    title: {
      ...text.sectionTitle,
      marginBottom: 8,
      color: theme.text.primary,
      borderBottomColor: theme.status.info.text,
      borderBottomWidth: 2,
      paddingBottom: 16,
    },
    emojiRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      columnGap: 12,
      marginBottom: 0,
    },
    emoji: {
      ...text.statLarge,
      opacity: 0.5,
    },
    emojiSelected: {
      opacity: 1,
      transform: [{ scale: 1.2 }],
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
    },
    checkboxText: {
      ...text.body,
      flex: 1,
    },
    ratingLabel: {
      ...text.body,
      textAlign: 'center',
    },
    modalActionText: {
      ...text.body,
      textAlign: 'center',
    },
    ...formStyles(theme),
  });
};
