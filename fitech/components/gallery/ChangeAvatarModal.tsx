import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { getFileUploadViewUrl } from '@/utils/files';

type Photo = { id: number };

type Props = {
  visible: boolean;
  photos: Photo[];
  profilePhotoId?: number | null;
  onClose: () => void;
  onSelectPhoto: (photoId: number) => void;
};

export function ChangeAvatarModal({
  visible,
  photos,
  profilePhotoId,
  onClose,
  onSelectPhoto,
}: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 8 },
          ]}
        >
          <View style={styles.sheetHeader}>
            <AppText variant="sectionTitle" style={styles.sheetTitle}>
              Elige tu avatar
            </AppText>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={theme.text.secondary} />
            </Pressable>
          </View>

          <AppText style={styles.sheetSubtitle}>
            Toca una foto de tu galería para usarla como foto de perfil
          </AppText>

          <FlatList
            data={photos}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.photoRow}
            contentContainerStyle={styles.photoList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isActive = profilePhotoId === item.id;

              return (
                <Pressable
                  style={[styles.photoCell, isActive && styles.photoCellActive]}
                  onPress={() => onSelectPhoto(item.id)}
                >
                  <Image
                    source={{ uri: getFileUploadViewUrl(item.id) }}
                    style={styles.photoImage}
                  />
                  {isActive ? (
                    <View style={styles.activeBadge}>
                      <Ionicons
                        name="shield-checkmark"
                        size={11}
                        color={theme.text.inverse}
                      />
                      <AppText style={styles.activeBadgeText}>
                        Foto de perfil
                      </AppText>
                    </View>
                  ) : null}
                </Pressable>
              );
            }}
          />

          <Button label="Cancelar" type="tertiary" onPress={onClose} animated={false} />
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.background.overlay,
    },
    sheet: {
      maxHeight: '78%',
      backgroundColor: theme.background.modal,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 16,
      paddingTop: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderBottomWidth: 0,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    sheetTitle: {
      color: theme.text.primary,
      flex: 1,
    },
    sheetSubtitle: {
      fontSize: 14,
      color: theme.text.secondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    photoList: {
      paddingBottom: 12,
      rowGap: 10,
    },
    photoRow: {
      gap: 10,
      marginBottom: 10,
    },
    photoCell: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
      maxWidth: '48%',
    },
    photoCellActive: {
      borderWidth: 2,
      borderColor: theme.brand.primary,
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    activeBadge: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 4,
      backgroundColor: theme.brand.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    activeBadgeText: {
      fontSize: 9,
      fontWeight: '700',
      color: theme.text.inverse,
    },
  });
