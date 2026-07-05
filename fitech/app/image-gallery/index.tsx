import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChangeAvatarModal } from '@/components/gallery/ChangeAvatarModal';
import PageContainer from '@/components/PageContainer';
import { PullToRefreshControl } from '@/components/PullToRefreshControl';
import { withRefreshFeedback } from '@/components/RefreshFeedbackBar';
import { TRANSLATIONS } from '@/constants/strings';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDeletePhoto } from '@/lib/api/mutations/useDeletePhoto';
import { useSetProfilePhoto } from '@/lib/api/mutations/useSetProfilePhoto';
import { useUploadPhoto } from '@/lib/api/mutations/useUploadPhoto';
import { useGetUserPhotos } from '@/lib/api/queries/useGetUserPhotos';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { useUserStore } from '@/stores/user';
import { AppTheme } from '@/types/theme';
import { extractErrorMessage } from '@/utils/errors';
import { getFileUploadViewUrl } from '@/utils/files';
import {
  createImageUploadFormData,
  prepareImageForUpload,
} from '@/utils/prepare-image-for-upload';
import { requestMediaLibraryPermission } from '@/utils/request-media-library-permission';

const MAX_PHOTOS = 10;
const GRID_COLUMNS = 2;

type Photo = { id: number };

type GridCell = { kind: 'photo'; photo: Photo } | { kind: 'upload' };

type UploadIntent = 'gallery' | 'avatar';

function ActiveAvatarBadge({
  styles,
}: {
  styles: ReturnType<typeof getStyles>;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.activeAvatarBadge}>
      <Ionicons name="shield-checkmark" size={12} color={theme.text.inverse} />
      <AppText style={styles.activeAvatarBadgeText}>
        {TRANSLATIONS.imageGalleryScreen.profilePhotoBadge}
      </AppText>
    </View>
  );
}

export default function ImageGalleryScreen() {
  const { theme } = useTheme();
  const { showAlert } = useAlert();
  const styles = getStyles(theme);
  const { imageGalleryScreen: copy, common } = TRANSLATIONS;
  const [isPicking, setIsPicking] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [uploadIntent, setUploadIntent] = useState<UploadIntent>('gallery');

  const profilePhotoId = useUserStore(
    (s) => s?.user?.user?.person?.profilePhotoId,
  );
  const updateProfilePhotoId = useUserStore((s) => s.updateProfilePhotoId);

  const { mutate: uploadPhoto, isPending: isUploading } = useUploadPhoto();
  const { mutate: deletePhoto } = useDeletePhoto();
  const { mutate: setProfilePhoto, isPending: isSettingProfile } =
    useSetProfilePhoto();

  const { data: photos = [], isLoading, refetch } = useGetUserPhotos();
  const { refreshing, onRefresh } = usePullToRefresh(refetch);

  const gridData = useMemo((): GridCell[] => {
    const cells: GridCell[] = [];
    if (photos.length < MAX_PHOTOS) {
      cells.push({ kind: 'upload' });
    }
    cells.push(
      ...photos.map((photo) => ({
        kind: 'photo' as const,
        photo,
      })),
    );
    return cells;
  }, [photos]);

  const applyProfilePhoto = useCallback(
    (photoId: number) => {
      setProfilePhoto(
        { photoId },
        {
          onSuccess: async () => {
            await updateProfilePhotoId(photoId);
            setShowAvatarPicker(false);
          },
          onError: (err) => {
            console.warn('[Gallery] profile photo set failed', err);
            showAlert({
              title: common.errorTitle,
              message: copy.profilePhotoError,
            });
          },
        },
      );
    },
    [
      common.errorTitle,
      copy.profilePhotoError,
      setProfilePhoto,
      showAlert,
      updateProfilePhotoId,
    ],
  );

  const confirmSetAsProfile = useCallback(
    (photoId: number, options?: { isFirstUpload?: boolean }) => {
      showAlert({
        title: options?.isFirstUpload
          ? copy.confirmProfileTitle
          : common.confirm,
        message: options?.isFirstUpload
          ? copy.confirmProfileFirstMessage
          : copy.confirmProfileMessage,
        buttons: [
          {
            text: options?.isFirstUpload ? common.notNow : common.cancel,
            style: 'cancel',
          },
          {
            text: common.yesUse,
            onPress: () => applyProfilePhoto(photoId),
          },
        ],
      });
    },
    [applyProfilePhoto, common, copy, showAlert],
  );

  const pickImage = useCallback(
    async (intent: UploadIntent = 'gallery') => {
      if (photos.length >= MAX_PHOTOS) {
        showAlert({
          title: copy.limitReachedTitle,
          message: copy.limitReachedMessage,
        });
        return;
      }

      const permission = await requestMediaLibraryPermission();
      if (!permission.granted) {
        showAlert({
          title: copy.permissionRequiredTitle,
          message: permission.message,
        });
        return;
      }

      setUploadIntent(intent);
      setIsPicking(true);

      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
          exif: false,
        });

        if (result.canceled || !result.assets[0]) return;

        const prepared = await prepareImageForUpload(result.assets[0]);
        const formData = createImageUploadFormData(prepared);
        const isFirstPhoto = photos.length === 0;

        uploadPhoto(formData, {
          onSuccess: async (data) => {
            const { data: updatedPhotos } = await refetch();
            const uploadedPhotoId =
              (data as { id?: number })?.id ?? updatedPhotos?.[0]?.id;

            if (intent === 'avatar' && uploadedPhotoId != null) {
              applyProfilePhoto(uploadedPhotoId);
              return;
            }

            if (isFirstPhoto && uploadedPhotoId != null) {
              confirmSetAsProfile(uploadedPhotoId, { isFirstUpload: true });
            }
          },
          onError: (error) => {
            showAlert({
              title: common.errorTitle,
              message: extractErrorMessage(error, copy.uploadErrorFallback),
            });
          },
        });
      } catch (error) {
        console.warn('[Gallery] pick/upload failed', error);
        showAlert({
          title: common.errorTitle,
          message: extractErrorMessage(error, copy.processImageErrorFallback),
        });
      } finally {
        setIsPicking(false);
      }
    },
    [
      applyProfilePhoto,
      common.errorTitle,
      confirmSetAsProfile,
      copy,
      photos.length,
      refetch,
      showAlert,
      uploadPhoto,
    ],
  );

  const openChangeAvatar = useCallback(() => {
    const canUpload = photos.length < MAX_PHOTOS;
    const hasPhotos = photos.length > 0;

    if (!hasPhotos && canUpload) {
      void pickImage('avatar');
      return;
    }

    if (!hasPhotos) {
      showAlert({
        title: copy.noPhotosTitle,
        message: copy.noPhotosMessage,
      });
      return;
    }

    const buttons: {
      text: string;
      style?: 'cancel';
      onPress?: () => void;
    }[] = [
      {
        text: copy.pickExistingPhoto,
        onPress: () => setShowAvatarPicker(true),
      },
    ];

    if (canUpload) {
      buttons.push({
        text: copy.uploadNewPhoto,
        onPress: () => void pickImage('avatar'),
      });
    }

    buttons.push({ text: common.cancel, style: 'cancel' });

    showAlert({
      title: copy.changeAvatarTitle,
      message: canUpload
        ? copy.changeAvatarMessageUpload
        : copy.changeAvatarMessagePick,
      buttons,
    });
  }, [common.cancel, copy, photos.length, pickImage, showAlert]);

  const removePhoto = useCallback(
    (photoId: number) => {
      const isProfile = profilePhotoId === photoId;

      showAlert({
        title: isProfile ? copy.deleteProfilePhotoTitle : copy.deletePhotoTitle,
        message: isProfile
          ? copy.deleteProfilePhotoMessage
          : copy.deletePhotoMessage,
        buttons: [
          { text: common.cancel, style: 'cancel' },
          {
            text: common.delete,
            style: 'destructive',
            onPress: () => {
              deletePhoto(photoId, {
                onSuccess: () => refetch(),
                onError: () => {
                  showAlert({
                    title: common.errorTitle,
                    message: copy.deletePhotoError,
                  });
                },
              });
            },
          },
        ],
      });
    },
    [common, copy, deletePhoto, profilePhotoId, refetch, showAlert],
  );

  const isBusy = isPicking || isUploading || isSettingProfile;

  const photoProgress = useMemo(() => {
    const uploaded = photos.length;
    const remaining = Math.max(0, MAX_PHOTOS - uploaded);
    const percent = Math.round((uploaded / MAX_PHOTOS) * 100);
    const legend =
      uploaded >= MAX_PHOTOS
        ? copy.progressMaxReached
        : remaining === 1
          ? copy.progressOneRemaining
          : copy.progressManyRemaining.replace(
              '{remaining}',
              String(remaining),
            );

    return { uploaded, remaining, percent, legend };
  }, [copy, photos.length]);

  const listHeader = useMemo(
    () => (
      <View style={styles.headerBlock}>
        <View style={styles.bannerCard}>
          <AppText variant="sectionTitle" style={styles.bannerTitle}>
            {copy.bannerTitle}
          </AppText>
          <AppText style={styles.bannerText}>
            {copy.bannerText.replace('{max}', String(MAX_PHOTOS))}
          </AppText>

          <View style={styles.progressSection}>
            <View style={styles.progressLegendRow}>
              <AppText style={styles.progressLegend}>
                {photoProgress.legend}
              </AppText>
              <AppText style={styles.progressPercent}>
                {photoProgress.percent}%
              </AppText>
            </View>
            <View
              style={styles.progressTrack}
              accessibilityRole="progressbar"
              accessibilityValue={{
                min: 0,
                max: MAX_PHOTOS,
                now: photoProgress.uploaded,
              }}
            >
              <View
                style={[
                  styles.progressFill,
                  { width: `${photoProgress.percent}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarHero}>
            {profilePhotoId ? (
              <>
                <Image
                  source={{ uri: getFileUploadViewUrl(profilePhotoId) }}
                  style={styles.avatarHeroImage}
                />
                <ActiveAvatarBadge styles={styles} />
              </>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons
                  name="person-outline"
                  size={48}
                  color={theme.text.tertiary}
                />
                <AppText style={styles.avatarPlaceholderText}>
                  {copy.noProfilePhoto}
                </AppText>
              </View>
            )}
          </View>

          <Button
            label={copy.changeAvatarButton}
            type="secondary"
            onPress={openChangeAvatar}
            disabled={isBusy}
            loading={isSettingProfile}
            loadingLabel={copy.updatingAvatar}
            animated={false}
            style={styles.changeAvatarButton}
          />
        </View>
      </View>
    ),
    [
      copy,
      isBusy,
      isSettingProfile,
      openChangeAvatar,
      photoProgress,
      profilePhotoId,
      styles,
      theme.text.tertiary,
    ],
  );

  const renderGridCell = useCallback(
    ({ item }: { item: GridCell }) => {
      if (item.kind === 'upload') {
        return (
          <Pressable
            onPress={() => void pickImage('gallery')}
            disabled={isBusy}
            style={[styles.cell, styles.uploadCell]}
          >
            {isBusy && uploadIntent === 'gallery' ? (
              <ActivityIndicator color={theme.brand.primary} />
            ) : (
              <>
                <View style={styles.uploadIconBox}>
                  <Ionicons name="add" size={22} color={theme.text.inverse} />
                </View>
                <AppText style={styles.uploadLabel}>
                  {copy.addPhotoLabel}
                </AppText>
              </>
            )}
          </Pressable>
        );
      }

      const { photo } = item;
      const isProfile = profilePhotoId === photo.id;

      return (
        <View style={[styles.cell, isProfile && styles.cellProfileSelected]}>
          <Image
            source={{ uri: getFileUploadViewUrl(photo.id) }}
            style={styles.thumbnail}
          />

          {isProfile ? <ActiveAvatarBadge styles={styles} /> : null}

          <Pressable
            style={styles.badgeDelete}
            onPress={() => removePhoto(photo.id)}
            hitSlop={6}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color={theme.background.app}
            />
          </Pressable>
        </View>
      );
    },
    [
      copy.addPhotoLabel,
      isBusy,
      pickImage,
      profilePhotoId,
      removePhoto,
      styles,
      theme,
      uploadIntent,
    ],
  );

  return (
    <PageContainer
      title={copy.title}
      disableScroll
      style={styles.page}
      includeTabBarPadding={false}
      hasBottomPadding={false}
    >
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.brand.primary} />
        </View>
      ) : (
        <>
          <FlatList
            data={gridData}
            keyExtractor={(item) =>
              item.kind === 'upload' ? 'upload' : String(item.photo.id)
            }
            renderItem={renderGridCell}
            numColumns={GRID_COLUMNS}
            ListHeaderComponent={withRefreshFeedback(refreshing, listHeader)}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.gridRow}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews
            refreshControl={
              <PullToRefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />

          <ChangeAvatarModal
            visible={showAvatarPicker}
            photos={photos}
            profilePhotoId={profilePhotoId}
            onClose={() => setShowAvatarPicker(false)}
            onSelectPhoto={(photoId) => {
              if (photoId === profilePhotoId) {
                setShowAvatarPicker(false);
                return;
              }
              applyProfilePhoto(photoId);
            }}
          />
        </>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    page: { paddingBottom: 0 },
    headerBlock: { rowGap: 16, marginBottom: 16 },
    bannerCard: {
      backgroundColor: theme.background.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderLeftWidth: 4,
      borderLeftColor: theme.status.info.icon,
      padding: 16,
      rowGap: 8,
    },
    bannerTitle: { color: theme.status.info.text },
    bannerText: {
      fontSize: 14,
      color: theme.status.info.text,
      fontFamily: '400',
      lineHeight: 20,
    },
    progressSection: {
      marginTop: 8,
      rowGap: 8,
    },
    progressLegendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressPercent: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.status.info.icon,
    },
    progressTrack: {
      height: 10,
      backgroundColor: theme.status.info.bg,
      borderRadius: 6,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border.subtle,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.status.info.text,
      borderRadius: 6,
    },
    progressLegend: {
      fontSize: 12,
      color: theme.text.tertiary,
      lineHeight: 18,
    },
    avatarSection: {
      alignItems: 'center',
      rowGap: 12,
    },
    avatarHero: {
      width: '100%',
      aspectRatio: 1,
      maxHeight: 280,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    avatarHeroImage: {
      width: '100%',
      height: '100%',
    },
    avatarPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      rowGap: 10,
      padding: 24,
    },
    avatarPlaceholderText: {
      fontSize: 14,
      color: theme.text.secondary,
    },
    changeAvatarButton: {
      alignSelf: 'stretch',
    },
    activeAvatarBadge: {
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
      zIndex: 2,
    },
    activeAvatarBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.text.inverse,
    },
    gridContent: {
      paddingBottom: 180,
    },
    gridRow: {
      gap: 10,
      marginBottom: 10,
    },
    cell: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
      maxWidth: '48%',
    },
    cellProfileSelected: {
      borderWidth: 2,
      borderColor: theme.brand.primary,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
    },
    uploadCell: {
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'dashed',
      borderColor: theme.border.strong,
      backgroundColor: theme.background.card,
      rowGap: 10,
    },
    uploadIconBox: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: theme.brand.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.6,
      color: theme.brand.primaryLight,
    },
    badgeDelete: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: theme.status.error.icon,
      borderRadius: 10,
      padding: 4,
    },
    loadingWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 48,
    },
  });
