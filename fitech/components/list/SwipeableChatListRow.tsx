import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

import { ChatListRow, type ChatListRowItem } from './ChatListRow';

const DELETE_ACTION_WIDTH = 96;

type DeleteSwipeActionProps = {
  progress: SharedValue<number>;
  onDelete: () => void;
  deleteLabel: string;
  theme: AppTheme;
};

function DeleteSwipeAction({
  progress,
  onDelete,
  deleteLabel,
  theme,
}: DeleteSwipeActionProps) {
  const styles = getStyles(theme);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.35, 1],
      [0, 0.4, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Pressable
      onPress={onDelete}
      style={styles.deleteAction}
      accessibilityRole="button"
      accessibilityLabel={deleteLabel}
    >
      <Animated.View style={[styles.deleteContent, contentStyle]}>
        <Ionicons
          name="trash-outline"
          size={18}
          color={theme.button.dangerText}
        />
        <AppText style={styles.deleteLabel}>{deleteLabel}</AppText>
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  chat: ChatListRowItem;
  isTrainer: boolean;
  onPress: () => void;
  onDelete: () => void;
};

function SwipeableChatListRowComponent({
  chat,
  isTrainer,
  onPress,
  onDelete,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { common } = TRANSLATIONS;
  const hasUnread = chat.unread > 0;

  const renderRightActions = useCallback(
    (progress: SharedValue<number>) => (
      <DeleteSwipeAction
        progress={progress}
        onDelete={onDelete}
        deleteLabel={common.delete}
        theme={theme}
      />
    ),
    [common.delete, onDelete, theme],
  );

  return (
    <ReanimatedSwipeable
      friction={1}
      rightThreshold={40}
      overshootRight={false}
      containerStyle={styles.container}
      childrenContainerStyle={
        hasUnread ? styles.childrenUnread : styles.children
      }
      renderRightActions={renderRightActions}
    >
      <ChatListRow chat={chat} isTrainer={isTrainer} onPress={onPress} />
    </ReanimatedSwipeable>
  );
}

export const SwipeableChatListRow = memo(SwipeableChatListRowComponent);

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    container: {
      overflow: 'hidden',
    },
    children: {
      backgroundColor: theme.background.app,
    },
    childrenUnread: {
      backgroundColor: theme.brand.primaryMuted,
    },
    deleteAction: {
      width: DELETE_ACTION_WIDTH,
      alignSelf: 'stretch',
      backgroundColor: theme.button.dangerBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteContent: {
      alignItems: 'center',
      justifyContent: 'center',
      rowGap: 4,
      paddingHorizontal: 8,
    },
    deleteLabel: {
      ...text.captionSemibold,
      color: theme.button.dangerText,
      textAlign: 'center',
    },
  });
};
