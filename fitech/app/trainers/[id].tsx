import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { AvatarPhoto } from '@/components/AvatarPhoto';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { TrainerReviewsSection } from '@/components/trainers/TrainerReviewsSection';
import { TrainerServiceCard } from '@/components/trainers/TrainerServiceCard';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCheckContractAvailability } from '@/lib/api/queries/use-check-contract-availability';
import { useGetTrainer } from '@/lib/api/queries/use-get-trainer';
import { useGetTrainerPhotos } from '@/lib/api/queries/use-get-trainer-photos';
import { useGetTrainerServices } from '@/lib/api/queries/use-get-trainer-services';
import { useUserStore } from '@/stores/user';
import { AppTheme } from '@/types/theme';
import { TrainerService } from '@/types/trainer';
import { getFileUploadViewUrl } from '@/utils/files';
import { getUserAvatarURL } from '@/utils/user';

export default function TrainerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = useUserStore((s) => s?.user?.user?.id);
  const router = useRouter();
  const { theme } = useTheme();
  const { showAlert } = useAlert();
  const styles = getStyles(theme);
  const { trainerProfileScreen: copy } = TRANSLATIONS;

  const { data: trainer } = useGetTrainer(Number(id));
  const { data: photos } = useGetTrainerPhotos(Number(id));
  const { data: services } = useGetTrainerServices(Number(id));
  const { mutateAsync: checkContract } = useCheckContractAvailability();

  const trainerName = trainer
    ? `${trainer.person.firstName} ${trainer.person.lastName}`.trim()
    : copy.defaultTitle;

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
        title: copy.contractBlockedTitle,
        message: res?.message || copy.contractBlockedDefault,
      });
    }
  };

  return (
    <PageContainer title={trainerName} style={styles.page}>
      {trainer ? (
        <View style={styles.profileCard}>
          <AvatarPhoto
            url={getUserAvatarURL(trainer.person)}
            gender={trainer.person?.gender}
            size={88}
          />
          <AppText style={styles.role}>{copy.role}</AppText>
          {trainer.premium ? (
            <Tag
              backgroundColor={theme.status.warning.bg}
              textColor={theme.status.warning.text}
              label={copy.certified}
            />
          ) : null}
        </View>
      ) : null}

      {services && services.length > 0 ? (
        <View style={styles.section}>
          <AppText style={styles.sectionLabel}>{copy.servicesTitle}</AppText>
          <View style={styles.serviceList}>
            {services.map((service) => (
              <TrainerServiceCard
                key={service.id}
                service={service}
                onHire={() => handleContract(service)}
              />
            ))}
          </View>
        </View>
      ) : null}

      {photos && photos.length > 0 ? (
        <View style={styles.section}>
          <AppText style={styles.sectionLabel}>{copy.galleryTitle}</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryScroll}
          >
            {photos.map((photo) => (
              <Image
                key={photo.id}
                source={{ uri: getFileUploadViewUrl(photo.id) }}
                style={styles.galleryImage}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      {trainer?.person?.bio ? (
        <View style={styles.section}>
          <View style={styles.aboutCard}>
            <AppText style={styles.sectionLabel}>{copy.aboutTitle}</AppText>
            <AppText style={styles.aboutText}>{trainer.person.bio}</AppText>
          </View>
        </View>
      ) : null}

      <TrainerReviewsSection trainerId={Number(id)} />
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    page: { paddingBottom: 180 },
    profileCard: {
      alignItems: 'center',
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 20,
      marginTop: 12,
      rowGap: 10,
    },
    role: {
      ...text.small,
      color: theme.text.secondary,
      textAlign: 'center',
    },
    section: {
      marginTop: 20,
      rowGap: 10,
    },
    sectionLabel: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    serviceList: {
      rowGap: 8,
    },
    galleryScroll: {
      gap: 8,
      paddingRight: 16,
    },
    galleryImage: {
      width: 112,
      height: 112,
      borderRadius: 12,
      backgroundColor: theme.background.input,
    },
    aboutCard: {
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 16,
      rowGap: 8,
    },
    aboutText: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 20,
    },
  });
};
