import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';

import { useDeletePhoto } from '../api/mutations/useDeletePhoto';
import { useSetProfilePhoto } from '../api/mutations/useSetProfilePhoto';
import { useUploadPhoto } from '../api/mutations/useUploadPhoto';
import { useGetUserPhotos } from '../api/queries/useGetUserPhotos';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import PageContainer from '../components/PageContainer';

const MAX_PHOTOS = 10;

export default function ImageGalleryScreen() {
  const { theme } = useTheme();
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
        Alert.alert('Límite alcanzado', 'Solo puedes subir hasta 10 fotos.');
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
          Alert.alert('Error', 'No se pudo subir la foto.');
        },
      });
    }
  };

  const removePhoto = (index: number) => {
    const photo = photos[index];
    deletePhoto(photo.id, {
      onSuccess: () => refetch(),
      onError: () => {
        Alert.alert('Error', 'No se pudo eliminar la foto.');
      },
    });
  };

  const confirmSetAsProfile = (photoId: number) => {
    Alert.alert(
      'Confirmar',
      '¿Quieres usar esta foto como tu nueva foto de perfil?',
      [
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
    );
  };

  return (
    <PageContainer header={'Gestiona tus fotos'} style={{ rowGap: 10 }}>
      <Card style={{ backgroundColor: theme.primary, rowGap: 4 }}>
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
      </Card>

      <Card
        style={{ flexDirection: 'row', columnGap: 12, alignItems: 'center' }}
      >
        <AppText style={styles.tipTitle}>💡 Tip</AppText>
        <AppText style={styles.tipText}>
          Las fotos de buena calidad generan más confianza con los clientes
        </AppText>
      </Card>

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
                  borderColor: theme.primary,
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
                <View style={styles.avatarBadge}>
                  <Feather name="check-circle" size={16} color="#fff" />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.starBadge}
                  onPress={() => confirmSetAsProfile(item.id)}
                >
                  <Feather name="star" size={16} color="#fff" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removePhoto(index)}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          {photos.length < MAX_PHOTOS && (
            <TouchableOpacity
              onPress={pickImage}
              style={[styles.thumbnailWrapper, styles.uploadBtn]}
            >
              <Feather name="plus" size={24} color="#0F4C81" />
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
    tipBanner: {
      backgroundColor: '#D6EDFF',
      padding: 12,
      borderRadius: 12,
      marginBottom: 10,
    },
    tipTitle: {
      fontWeight: '700',
      color: theme.dark100,
      fontSize: 16,
    },
    tipText: {
      fontSize: 14,
      color: theme.dark200,
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
      borderColor: '#0F4C81',
      borderWidth: 2,
    },
    avatarLabel: {
      marginTop: 8,
      fontSize: 16,
      fontWeight: '500',
      color: '#0F4C81',
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
      backgroundColor: '#0F4C81',
      padding: 4,
      borderRadius: 8,
    },
    starBadge: {
      position: 'absolute',
      bottom: 4,
      left: 4,
      backgroundColor: '#FF8C42',
      padding: 4,
      borderRadius: 8,
      zIndex: 10,
    },
    deleteBtn: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: '#ff5a5f',
      padding: 4,
      borderRadius: 8,
    },

    uploadBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E4E6EB',
      borderRadius: 10,
    },
    uploadText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#0F4C81',
      marginTop: 4,
    },

    trainerBannerTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.dark900,
    },
    trainerBannerText: {
      fontSize: 14,
      color: theme.dark700,
    },
  });
