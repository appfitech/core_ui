import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { TrainerService } from '@/types/trainer';

import { useCheckContractAvailability } from '@/lib/api/queries/use-check-contract-availability';
import { useGetTrainer } from '@/lib/api/queries/use-get-trainer';
import { useGetTrainerPhotos } from '@/lib/api/queries/use-get-trainer-photos';
import { useGetTrainerServices } from '@/lib/api/queries/use-get-trainer-services';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';

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
    if (clientId == null) {
      return;
    }
    const res = await checkContract({ clientId, serviceId: service?.id });

    if (res?.canContract) {
      router.push({
        pathname: '/trainers/[id]/contract',
        params: { id: id ?? '', service: JSON.stringify(service) },
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
      title={
        trainer
          ? `${trainer.person.firstName} ${trainer.person.lastName}`
          : 'Entrenador'
      }
      style={styles.pageStyle}
      contentPaddingBottom={100}
    >
      {trainer && (
        <View style={styles.profileBlock}>
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
          <AppText style={styles.sectionTitle}>SERVICIOS DISPONIBLES</AppText>
          <View style={styles.serviceList}>
            {services.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <AppText style={styles.serviceName}>{service.name}</AppText>
                <AppText style={styles.serviceDesc} numberOfLines={2}>
                  {service.description}
                </AppText>
                <View style={styles.servicePriceRow}>
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={theme.primary}
                  />
                  <AppText style={styles.servicePrice}>
                    S/ {service.totalPrice.toFixed(2)}
                  </AppText>
                </View>
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
          <AppText style={styles.sectionTitle}>GALERÍA</AppText>
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
            <AppText style={styles.sectionTitle}>ACERCA DE</AppText>
            <AppText style={styles.aboutText}>{trainer.person.bio}</AppText>
          </View>
        </View>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {},
    profileBlock: {
      alignItems: 'center',
      marginTop: 8,
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
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
      marginBottom: 10,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
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
    servicePriceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    servicePrice: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.primary,
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
    aboutText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.textPrimary,
      lineHeight: 22,
    },
  });
