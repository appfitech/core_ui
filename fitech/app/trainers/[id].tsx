import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { TrainerService } from '@/types/trainer';

import { useCheckContractAvailability } from '../api/queries/use-check-contract-availability';
import { useGetTrainer } from '../api/queries/use-get-trainer';
import { useGetTrainerPhotos } from '../api/queries/use-get-trainer-photos';
import { useGetTrainerServices } from '../api/queries/use-get-trainer-services';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import PageContainer from '../components/PageContainer';
import { useUserStore } from '@/stores/user';

export default function TrainerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = useUserStore((s) => s?.user?.user?.id);
  const router = useRouter();
  const { theme } = useTheme();
  const { showAlert } = useAlert();

  const { data: trainer } = useGetTrainer(Number(id));
  const { data: photos } = useGetTrainerPhotos(Number(id));
  const { data: services } = useGetTrainerServices(Number(id));
  const { mutateAsync: checkContract } = useCheckContractAvailability();

  const styles = getStyles(theme);

  const handleContract = async (service: TrainerService) => {
    const res = await checkContract({ clientId, serviceId: service?.id });

    if (res?.canContract) {
      router.push({
        pathname: `/trainers/${id}/contract`,
        params: { service: JSON.stringify(service) },
      });
    } else {
      showAlert({
        title: 'Aviso',
        message:
          res?.message ||
          'Ya tienes un servicio contratado y no puedes volver a contratarlo',
      });
    }
  };

  return (
    <PageContainer
      title={trainer ? `${trainer.person.firstName} ${trainer.person.lastName}` : 'Entrenador'}
      style={styles.pageStyle}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {trainer && (
          <View style={styles.profileCard}>
            <Image
              source={{
                uri: `https://appfitech.com/v1/app/file-upload/view/${trainer.person.profilePhotoId}`,
              }}
              style={styles.avatar}
            />
            <AppText style={styles.role}>Entrenador personal</AppText>
            {trainer.premium && (
              <View style={styles.premiumTag}>
                <Ionicons name="star" size={14} color={theme.warning} />
                <AppText style={styles.premiumText}>
                  Entrenador certificado
                </AppText>
              </View>
            )}
          </View>
        )}

        {services && services.length > 0 && (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Servicios disponibles</AppText>
            <View style={styles.serviceList}>
              {services.map((service) => (
                <View key={service.id} style={styles.serviceCard}>
                  <AppText style={styles.serviceName}>{service.name}</AppText>
                  <AppText style={styles.serviceDesc} numberOfLines={2}>
                    {service.description}
                  </AppText>
                  <AppText style={styles.servicePrice}>
                    S/ {service.totalPrice.toFixed(2)}
                  </AppText>
                  <View style={styles.serviceCta}>
                    <Button
                      label="Contratar servicio"
                      onPress={() => handleContract(service)}
                      type="primary"
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {photos && photos.length > 0 && (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Galería</AppText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryScroll}
            >
              {photos.map((photo) => (
                <Image
                  key={photo.id}
                  source={{
                    uri: `https://appfitech.com/v1/app/file-upload/view/${photo.id}`,
                  }}
                  style={styles.galleryImage}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {trainer?.person?.bio && (
          <View style={styles.section}>
            <View style={styles.aboutCard}>
              <AppText style={styles.rowLabel}>Acerca de</AppText>
              <AppText style={styles.aboutText}>
                {trainer.person.bio}
              </AppText>
            </View>
          </View>
        )}
      </ScrollView>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 180 },
    profileCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 24,
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 8,
    },
    role: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    premiumTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.warningBackground,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      marginTop: 10,
      gap: 6,
    },
    premiumText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.warningText,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 12,
    },
    serviceList: {
      rowGap: 12,
    },
    serviceCard: {
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 18,
    },
    serviceName: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    serviceDesc: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 6,
      lineHeight: 20,
    },
    servicePrice: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.primaryText,
      marginTop: 8,
    },
    serviceCta: {
      marginTop: 14,
    },
    galleryScroll: {
      gap: 10,
      paddingRight: 16,
    },
    galleryImage: {
      width: 120,
      height: 120,
      borderRadius: 12,
    },
    aboutCard: {
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 18,
    },
    rowLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    aboutText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.textPrimary,
      lineHeight: 22,
    },
  });
