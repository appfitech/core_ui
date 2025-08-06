import { Feather } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';
import { Tag } from './Tag';

type Props = {
  resource: ClientResourceResponseDtoReadable;
  onClick: (resourceId: number) => void;
};

export function ResourceCard({ onClick, resource }: Props) {
  const { theme } = useTheme();

  const styles = getStyles(theme);

  const handleClick = useCallback(() => {
    if (!resource?.id) {
      return;
    }

    onClick(resource.id);
  }, [resource]);

  return (
    <TouchableOpacity key={resource.id} onPress={handleClick}>
      <View style={styles.card}>
        <View style={{ padding: 16, rowGap: 10 }}>
          <AppText
            style={{ fontSize: 18, color: theme.dark600, fontWeight: 600 }}
          >
            {resource.resourceName}
          </AppText>
          <AppText
            style={{ fontSize: 16, color: theme.dark600, fontWeight: 500 }}
          >
            {`Entrenador: ${resource.trainerName}`}
          </AppText>
          <View style={{ flexDirection: 'row', columnGap: 10 }}>
            <Tag
              backgroundColor={theme.successBackground}
              textColor={theme.successText}
              label={resource.isActive ? 'Activa' : 'Inactiva'}
            />
            <Tag
              backgroundColor={theme.infoBackground}
              textColor={theme.infoText}
              label={resource?.serviceName}
            />
          </View>
        </View>
        <View
          style={{
            borderTopColor: theme.dark200,
            borderTopWidth: 1,
            paddingHorizontal: 16,
            paddingVertical: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <AppText style={{ color: theme.dark600 }}>
            {'Ver detalle'}&nbsp;
          </AppText>
          <Feather name="chevrons-right" size={20} color={theme.dark600} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    tabRow: {
      flexDirection: 'row',
      marginVertical: 20,
      overflow: 'hidden',
      columnGap: 16,
    },
    tabButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      borderRadius: 20,
    },
    tabButtonActive: {
      backgroundColor: theme.backgroundInverted,
    },
    tabText: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: '600',
    },
    tabTextActive: {
      color: theme.dark100,
    },
    card: {
      backgroundColor: theme.dark100,
      borderRadius: 12,
      borderColor: theme.dark200,
      borderWidth: 1,
      marginBottom: 12,
    },
  });
