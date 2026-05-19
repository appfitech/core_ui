import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDeletePhoto } from '@/lib/api/mutations/useDeletePhoto';
import { useSetProfilePhoto } from '@/lib/api/mutations/useSetProfilePhoto';
import { useUploadPhoto } from '@/lib/api/mutations/useUploadPhoto';
import { useGetUserPhotos } from '@/lib/api/queries/useGetUserPhotos';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';

const MAX_PHOTOS = 10;

export default function ImageGalleryScreen() {
  const { theme } = useTheme();
  const { showAlert } = useAlert();
  const styles = getStyles(theme);
  const profilePhotoId = useUserStore(
    (s) => s?.user?.user?.person?.profilePhotoId,
  );
  const updateProfilePhotoId = useUserStore((s) => s.updateProfilePhotoId);

  const { mutate: uploadPhoto } = useUploadPhoto();
  const { mutate: deletePhoto } = useDeletePhoto();
  const { mutate: setProfilePhoto } = useSetProfilePhoto();

  const { data: photos = [], isLoading, refetch } = useGetUserPhotos();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const file = result.assets[0];

      if (photos.length >= MAX_PHOTOS) {
        showAlert({
          title: 'Límite alcanzado',
          message: 'Solo puedes subir hasta 10 fotos.',
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.fileName ?? `photo.jpg`,
        type: file.type ?? 'image/jpeg',
      } as any);

      uploadPhoto(formData, {
        onSuccess: () => refetch(),
        onError: () => {
          showAlert({
            title: 'Error',
            message: 'No se pudo subir la foto.',
          });
        },
      });
    }
  };

  const removePhoto = (index: number) => {
    const photo = photos[index];
    deletePhoto(photo.id, {
      onSuccess: () => refetch(),
      onError: () => {
        showAlert({
          title: 'Error',
          message: 'No se pudo eliminar la foto.',
        });
      },
    });
  };

  const confirmSetAsProfile = (photoId: number) => {
    showAlert({
      title: 'Confirmar',
      message: '¿Quieres usar esta foto como tu nueva foto de perfil?',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, usar',
          onPress: () => {
            setProfilePhoto(
              { photoId },
              {
                onSuccess: async () => {
                  await updateProfilePhotoId(photoId);
                },
                onError: (err) => {
                  console.error('[K] profile photo set failed', err);
                },
              },
            );
          },
        },
      ],
    });
  };

  return (
    <PageContainer
      title="Gestiona tus fotos"
      style={styles.pageContent}
      contentPaddingBottom={120}
    >
      <View style={styles.bannerCard}>
        <AppText style={styles.trainerBannerTitle}>
          🎯 ¡Haz que tu perfil destaque!
        </AppText>
        <AppText style={styles.trainerBannerText}>
          Sube hasta 10 fotos que muestren tu estilo, resultados y experiencia
          como trainer.
        </AppText>
        <AppText style={styles.trainerBannerText}>
          Tienes {photos.length} de {MAX_PHOTOS} fotos subidas.
        </AppText>
      </View>

      <View style={styles.tipCard}>
        <AppText style={styles.tipTitle}>💡 Tip</AppText>
        <AppText style={styles.tipText}>
          Las fotos de buena calidad generan más confianza con los clientes
        </AppText>
      </View>

      {!!profilePhotoId && (
        <View style={styles.mainPhotoWrapper}>
          <Image
            source={{
              uri: `https://appfitech.com/v1/app/file-upload/view/${profilePhotoId}`,
            }}
            style={styles.mainPhoto}
          />
          <AppText style={styles.avatarLabel}>Foto de perfil</AppText>
        </View>
      )}

      {!isLoading && (
        <View style={styles.galleryGrid}>
          {photos.map((item, index) => (
            <View
              key={item.id.toString()}
              style={[
                styles.thumbnailWrapper,
                profilePhotoId === item.id && {
                  borderWidth: 4,
                  borderRadius: 15,
                  borderColor: theme.brand.primary,
                },
              ]}
            >
              <Image
                source={{
                  uri: `https://appfitech.com/v1/app/file-upload/view/${item.id}`,
                }}
                style={styles.thumbnail}
              />

              {profilePhotoId === item.id ? (
                <View
                  style={[
                    styles.avatarBadge,
                    { backgroundColor: theme.brand.primary },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={theme.background.app}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.starBadge, { backgroundColor: theme.brand.primary }]}
                  onPress={() => confirmSetAsProfile(item.id)}
                >
                  <Ionicons name="star" size={16} color={theme.background.app} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.deleteBtn, { backgroundColor: theme.status.error.icon }]}
                onPress={() => removePhoto(index)}
              >
                <Ionicons name="close" size={16} color={theme.background.app} />
              </TouchableOpacity>
            </View>
          ))}

          {photos.length < MAX_PHOTOS && (
            <TouchableOpacity
              onPress={pickImage}
              style={[styles.thumbnailWrapper, styles.uploadBtn]}
            >
              <Ionicons name="add" size={24} color={theme.brand.primary} />
              <AppText style={styles.uploadText}>Agregar</AppText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageContent: {
      rowGap: 16,
    },
    bannerCard: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderLeftWidth: 4,
      borderLeftColor: theme.brand.primary,
      padding: 16,
      rowGap: 6,
    },
    tipCard: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
      backgroundColor: theme.background.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 16,
    },
    tipTitle: {
      fontWeight: '700',
      color: theme.text.primary,
      fontSize: 16,
    },
    tipText: {
      fontSize: 14,
      color: theme.text.secondary,
      flex: 1,
    },
    mainPhotoWrapper: {
      alignItems: 'center',
      marginBottom: 20,
    },
    mainPhoto: {
      width: 200,
      height: 200,
      borderRadius: 12,
      borderColor: theme.brand.primary,
      borderWidth: 2,
    },
    avatarLabel: {
      marginTop: 8,
      fontSize: 16,
      fontWeight: '600',
      color: theme.brand.primary,
    },
    galleryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    thumbnailWrapper: {
      position: 'relative',
      width: '32%',
      aspectRatio: 1,
      marginBottom: 10,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    avatarBadge: {
      position: 'absolute',
      top: 4,
      left: 4,
      padding: 4,
      borderRadius: 8,
    },
    starBadge: {
      position: 'absolute',
      bottom: 4,
      left: 4,
      padding: 4,
      borderRadius: 8,
      zIndex: 10,
    },
    deleteBtn: {
      position: 'absolute',
      top: 4,
      right: 4,
      padding: 4,
      borderRadius: 8,
    },
    uploadBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background.input,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    uploadText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.brand.primary,
      marginTop: 4,
    },
    trainerBannerTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text.primary,
    },
    trainerBannerText: {
      fontSize: 14,
      color: theme.text.secondary,
      lineHeight: 20,
    },
  });
