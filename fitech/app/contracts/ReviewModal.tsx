import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetReviews } from '../api/queries/use-get-reviews';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

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
        setRating(existing.rating);
        setComment(existing.comment);
        setAnonymous(existing.isAnonymous);
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
            backgroundColor: theme.background,
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
              style={{
                textAlign: 'center',
                fontWeight: 600,
                fontSize: 16,
                color: theme.warningText,
              }}
            >
              {EMOJIS_LABEL[rating - 1]}
            </AppText>
          )}

          <TextInput
            style={[styles.input, { minHeight: 150, textAlignVertical: 'top' }]}
            placeholder="¿Quieres contarnos más?"
            placeholderTextColor={theme.dark300}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAnonymous((prev) => !prev)}
          >
            <Feather
              name={anonymous ? 'check-square' : 'square'}
              size={20}
              color={theme.primary}
            />
            <AppText
              style={[
                styles.checkboxText,
                { color: theme.dark700, fontSize: 16 },
              ]}
            >
              Publicar de forma anónima (tu nombre no será visible)
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                backgroundColor: theme.dark200,
                padding: 16,
                borderRadius: 12,
                marginTop: 16,
              },
            ]}
            onPress={handleClose}
            disabled={!rating}
          >
            <AppText
              style={{
                fontSize: 16,
                color: theme.dark800,
                textAlign: 'center',
              }}
            >
              Cancelar
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                backgroundColor: theme.infoText,
                padding: 16,
                borderRadius: 12,
              },
            ]}
            onPress={handleSubmit}
            disabled={!rating}
          >
            <AppText
              style={{
                fontSize: 16,
                color: theme.infoBackground,
                textAlign: 'center',
              }}
            >
              Enviar Reseña
            </AppText>
          </TouchableOpacity>
        </View>
      </PageContainer>
    </Modal>
  );
};

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 8,
      color: theme.dark900,
      borderBottomColor: theme.infoText,
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
      fontSize: 32,
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
      fontSize: 14,
      flex: 1,
    },
    ...SHARED_STYLES(theme),
  });
