import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { TrainerService } from '@/types/trainer';
import { AppTheme } from '@/types/theme';

type Props = {
  service: TrainerService;
  isPending?: boolean;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
};

export function ServiceActionBar({
  service,
  isPending = false,
  onEdit,
  onToggleStatus,
  onDelete,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onEdit}
        disabled={isPending}
        activeOpacity={0.7}
      >
        <Ionicons name="pencil" size={15} color={theme.text.secondary} />
        <AppText style={styles.editText}>Editar</AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onToggleStatus}
        disabled={isPending}
        activeOpacity={0.7}
      >
        {isPending ? (
          <ActivityIndicator size="small" color={theme.text.secondary} />
        ) : (
          <AppText style={styles.toggleText}>
            {service.isActive ? 'Desactivar' : 'Activar'}
          </AppText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onDelete}
        disabled={isPending}
        activeOpacity={0.7}
      >
        <AppText style={styles.deleteText}>Eliminar</AppText>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
      gap: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border.default,
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 2,
    },
    editText: {
      ...text.captionSemibold,
      color: theme.text.secondary,
    },
    toggleText: {
      ...text.captionSemibold,
      color: theme.text.primary,
    },
    deleteText: {
      ...text.captionSemibold,
      color: theme.status.error.text,
    },
  });
};
