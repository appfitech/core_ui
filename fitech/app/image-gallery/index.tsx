import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "../components/BackButton";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useGetUserPhotos } from "../api/queries/useGetUserPhotos";
import { useUploadPhoto } from "../api/mutations/useUploadPhoto";
import { useDeletePhoto } from "../api/mutations/useDeletePhoto";
import { Photo } from "../types/photos";
import { useUserStore } from "../stores/user";

const MAX_PHOTOS = 10;
const MAX_SIZE = 500 * 1024; // 500 KB

export default function ImageGalleryScreen() {
  const insets = useSafeAreaInsets();
  const profilePhotoId = useUserStore(
    (s) => s?.user?.user?.person?.profilePhotoId
  );
  const { mutate: uploadPhoto } = useUploadPhoto();

  const { data: photos, isLoading, refetch } = useGetUserPhotos();
  const { mutate: deletePhoto } = useDeletePhoto();

  console.log("[K] data", photos);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true
    });

    if (!result.canceled) {
      const file = result.assets[0];

      if (file.fileSize && file.fileSize > MAX_SIZE) {
        Alert.alert("Imagen demasiado grande", "Debe ser menor a 500kb.");
        return;
      }

      if (photos.length >= MAX_PHOTOS) {
        Alert.alert("Límite alcanzado", "Solo puedes subir hasta 10 fotos.");
        return;
      }

      // ✅ Create FormData
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.fileName ?? `photo.jpg`,
        type: file.type ?? "image/jpeg"
      } as any); // 👈 required for React Native FormData

      // ✅ Call mutation
      uploadPhoto(formData, {
        onSuccess: (data) => {
          console.log("✅ Upload success", data);
          refetch();
        },
        onError: (err) => {
          console.error("❌ Upload failed", err);
          Alert.alert("Error", "No se pudo subir la foto.");
        }
      });
    }
  };

  const removePhoto = (index: number) => {
    const photo = photos[index];

    // Call backend delete mutation
    deletePhoto(photo.id, {
      onSuccess: () => {
        const newPhotos = photos.filter((_, i) => i !== index);
        // setPhotos(newPhotos);

        refetch();

        // if (profileIndex === index) setProfileIndex(null);
        // else if (profileIndex !== null && profileIndex > index)
        //   setProfileIndex(profileIndex - 1);
      },
      onError: (err) => {
        console.error("❌ Error deleting photo", err);
        Alert.alert("Error", "No se pudo eliminar la foto.");
      }
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 60,
          minHeight: "100%"
        }
      ]}
    >
      <View style={{ marginBottom: 60 }}>
        <BackButton />
      </View>
      <Animated.Text
        entering={FadeInDown.duration(500)}
        style={styles.sectionTitle}
      >
        Gestiona tus fotos
      </Animated.Text>

      <View style={styles.trainerBanner}>
        <Text style={styles.trainerBannerTitle}>
          🎯 ¡Haz que tu perfil destaque!
        </Text>
        <Text style={styles.trainerBannerText}>
          Sube hasta 10 fotos que muestren tu estilo, resultados y experiencia
          como trainer.
        </Text>
        <Text style={styles.trainerBannerText}>
          Tienes {photos.length} de {MAX_PHOTOS} fotos subidas.
        </Text>
      </View>

      {/* Photo Count */}
      <Text style={styles.counter}>{`${photos.length}/10 fotos subidas`}</Text>

      {/* Main Profile Photo */}
      {!!profilePhotoId && (
        <View style={styles.mainPhotoWrapper}>
          <Image
            source={{
              uri: `https://appfitech.com/v1/app/file-upload/view/${profilePhotoId}`
            }}
            style={styles.mainPhoto}
          />
          <Text style={styles.avatarLabel}>Foto de perfil</Text>
        </View>
      )}

      <View style={styles.tipBanner}>
        <Text style={styles.tipTitle}>💡 Tip</Text>
        <Text style={styles.tipText}>
          Las fotos de buena calidad generan más confianza con los clientes
        </Text>
      </View>

      {/* Photo Grid */}
      {!isLoading && (
        <FlatList
          data={photos}
          keyExtractor={(photo, index) => photo?.id + index}
          horizontal
          contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
          renderItem={({ item, index }) => (
            <View style={styles.thumbnailWrapper}>
              <TouchableOpacity>
                <Image
                  source={{
                    uri: `https://appfitech.com/v1/app/file-upload/view/${photos[index]?.id}`
                  }}
                  style={styles.thumbnail}
                />
                {profilePhotoId === photos[index]?.id && (
                  <View style={styles.avatarBadge}>
                    <Ionicons name='star' size={16} color='#fff' />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removePhoto(index)}
              >
                <Ionicons name='close' size={16} color='#fff' />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            photos.length < MAX_PHOTOS && (
              <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
                <Ionicons name='add' size={24} color='#0F4C81' />
                <Text style={styles.uploadText}>Agregar</Text>
              </TouchableOpacity>
            )
          }
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F4C81",
    marginBottom: 16
  },
  tipBanner: {
    backgroundColor: "#D6EDFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  tipTitle: {
    fontWeight: "700",
    color: "#0F4C81"
  },
  tipText: {
    fontSize: 13,
    color: "#333",
    marginTop: 4
  },
  counter: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F4C81",
    marginBottom: 12
  },
  mainPhotoWrapper: {
    alignItems: "center",
    marginBottom: 20
  },
  mainPhoto: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderColor: "#0F4C81",
    borderWidth: 2
  },
  avatarLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    color: "#0F4C81"
  },
  thumbnailWrapper: {
    position: "relative"
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10
  },
  avatarBadge: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "#0F4C81",
    padding: 4,
    borderRadius: 8
  },
  deleteBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#ff5a5f",
    padding: 4,
    borderRadius: 8
  },
  uploadBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    backgroundColor: "#E4E6EB",
    borderRadius: 10
  },
  uploadText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#0F4C81",
    marginTop: 4
  },
  banner: {
    backgroundColor: "#E8F4FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F4C81",
    marginBottom: 4
  },
  bannerText: {
    fontSize: 13,
    color: "#333"
  },
  trainerBanner: {
    backgroundColor: "#FFE9D6", // Soft orange/peach
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF8C42"
  },
  trainerBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C15800",
    marginBottom: 4
  },
  trainerBannerText: {
    fontSize: 13,
    marginTop: 10,
    color: "#663C00"
  }
});
