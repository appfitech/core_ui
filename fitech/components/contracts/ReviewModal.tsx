import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { StarRating } from '@/components/StarRating';
import { TRANSLATIONS } from '@/constants/strings';
import { formStyles, textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetReviews } from '@/lib/api/queries/use-get-reviews';
import { FullTheme } from '@/types/theme';

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

const { reviewModal: copy, common } = TRANSLATIONS;

export function ReviewModal({
  isOpen,
  onCloseModal,
  onSubmit,
  contractId = null,
  existingReviewId = null,
}: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const { theme } = useTheme();
  const { data: reviews } = useGetReviews();

  useEffect(() => {
    if (!existingReviewId) return;

    const existing = reviews?.find((review) => review.id === existingReviewId);
    if (existing) {
      setRating(existing.rating ?? 5);
      setComment(existing.comment ?? '');
      setAnonymous(existing.isAnonymous ?? false);
    }
  }, [reviews, existingReviewId]);

  const styles = getStyles(theme);
  const ratingLabel =
    copy.ratingLabels[rating as keyof typeof copy.ratingLabels] ??
    copy.ratingLabels[5];

  const resetForm = () => {
    setComment('');
    setAnonymous(false);
    setRating(5);
  };

  const handleClose = () => {
    onCloseModal();
    resetForm();
  };

  const handleSubmit = () => {
    if (!contractId) return;
    onSubmit(rating, comment.trim(), anonymous, contractId, existingReviewId);
    handleClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />

            <AppText style={styles.title}>{copy.title}</AppText>

            <StarRating value={rating} onChange={setRating} size={32} />

            <AppText style={styles.ratingLabel}>{ratingLabel}</AppText>

            <TextInput
              style={styles.input}
              placeholder={copy.commentPlaceholder}
              placeholderTextColor={theme.text.tertiary}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Pressable
              style={styles.anonymousRow}
              onPress={() => setAnonymous((prev) => !prev)}
            >
              <Ionicons
                name={anonymous ? 'checkbox' : 'square-outline'}
                size={20}
                color={theme.brand.primary}
              />
              <View style={styles.anonymousTextWrap}>
                <AppText style={styles.anonymousLabel}>
                  {copy.anonymousLabel}
                </AppText>
                <AppText style={styles.anonymousHint}>
                  {copy.anonymousHint}
                </AppText>
              </View>
            </Pressable>

            <View style={styles.actions}>
              <Button
                type="secondary"
                label={common.cancel}
                onPress={handleClose}
                animated={false}
                style={styles.actionButton}
              />
              <Button
                type="primary"
                label={copy.submit}
                onPress={handleSubmit}
                animated={false}
                style={styles.actionButton}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  const form = formStyles(theme);

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    keyboardView: {
      width: '100%',
    },
    sheet: {
      backgroundColor: theme.background.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 28,
      rowGap: 14,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: theme.border.default,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.border.default,
      marginBottom: 4,
    },
    title: {
      ...text.linkSemibold,
      color: theme.text.primary,
      textAlign: 'center',
    },
    ratingLabel: {
      ...text.small,
      color: theme.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: 8,
    },
    input: {
      ...form.input,
      minHeight: 96,
      paddingTop: 12,
      fontSize: 14,
      lineHeight: 20,
    },
    anonymousRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: 10,
    },
    anonymousTextWrap: {
      flex: 1,
      rowGap: 2,
    },
    anonymousLabel: {
      ...text.smallMedium,
      color: theme.text.primary,
    },
    anonymousHint: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    actions: {
      flexDirection: 'row',
      columnGap: 10,
      marginTop: 4,
    },
    actionButton: {
      flex: 1,
    },
  });
};
