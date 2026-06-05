import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { TextInput } from '@/components/TextInput';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  extractUploadedFileId,
  uploadFileAsset,
  type PickedUploadFile,
} from '@/lib/api/mutations/use-upload-file';
import { AppTheme } from '@/types/theme';
import { extractErrorMessage } from '@/utils/errors';

import { ContractConfirmSheet } from './ContractConfirmSheet';

export type CancelContractFormPayload = {
  reason: string;
  fileIds: number[];
};

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
  onCancel: (payload: CancelContractFormPayload) => void;
  confirmLoading?: boolean;
  confirmLoadingLabel?: string;
};

const { cancelContractModal: copy, common } = TRANSLATIONS;

const ATTACHMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

export default function CancelModal({
  isOpen,
  onCloseModal,
  onCancel,
  confirmLoading = false,
  confirmLoadingLabel = common.updating,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [pickedFile, setPickedFile] = useState<PickedUploadFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setReason('');
    setReasonError(null);
    setPickedFile(null);
    setIsUploading(false);
    setSubmitError(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handlePickAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [...ATTACHMENT_TYPES],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const asset = result.assets[0];
      setPickedFile({
        uri: asset.uri,
        name: asset.name ?? 'adjunto',
        mimeType: asset.mimeType,
      });
      setSubmitError(null);
    } catch (error) {
      setSubmitError(extractErrorMessage(error));
    }
  };

  const handleConfirm = async () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setReasonError(copy.reasonRequired);
      return;
    }

    setReasonError(null);
    setSubmitError(null);

    let fileIds: number[] = [];

    if (pickedFile) {
      try {
        setIsUploading(true);
        const uploaded = await uploadFileAsset(pickedFile);
        const fileId = extractUploadedFileId(uploaded);
        if (fileId == null) {
          setSubmitError(copy.attachmentUploadFailed);
          setIsUploading(false);
          return;
        }
        fileIds = [fileId];
      } catch (error) {
        setSubmitError(extractErrorMessage(error));
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    onCancel({ reason: trimmed, fileIds });
  };

  const busy = confirmLoading || isUploading;
  const canConfirm = reason.trim().length > 0 && !busy;

  return (
    <ContractConfirmSheet
      visible={isOpen}
      onClose={onCloseModal}
      onConfirm={() => void handleConfirm()}
      title={copy.title}
      intro={copy.intro}
      bullets={copy.bullets}
      warning={copy.warning}
      dismissLabel={copy.dismiss}
      confirmLabel={copy.confirm}
      confirmVariant="destructive"
      confirmLoading={busy}
      confirmLoadingLabel={
        isUploading ? common.sending : confirmLoadingLabel
      }
      dismissDisabled={busy}
      confirmDisabled={!canConfirm}
    >
      <View style={styles.form}>
        <TextInput
          label={copy.reasonLabel}
          required
          placeholder={copy.reasonPlaceholder}
          value={reason}
          onChangeText={(text) => {
            setReason(text);
            if (reasonError) setReasonError(null);
          }}
          multiline
          numberOfLines={4}
          style={styles.reasonInput}
        />
        {reasonError ? (
          <AppText style={styles.errorText}>{reasonError}</AppText>
        ) : null}

        <View style={styles.attachmentBlock}>
          <AppText style={styles.attachmentLabel}>{copy.attachmentLabel}</AppText>
          <AppText style={styles.attachmentHint}>{copy.attachmentHint}</AppText>

          {pickedFile ? (
            <View style={styles.pickedRow}>
              <Ionicons
                name="document-attach-outline"
                size={18}
                color={theme.brand.primary}
              />
              <AppText style={styles.pickedName} numberOfLines={1}>
                {pickedFile.name}
              </AppText>
              <Pressable
                onPress={() => setPickedFile(null)}
                disabled={busy}
                hitSlop={8}
              >
                <AppText style={styles.removeLink}>{copy.removeAttachment}</AppText>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.pickButton}
              onPress={() => void handlePickAttachment()}
              disabled={busy}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={theme.brand.primary}
              />
              <AppText style={styles.pickLabel}>{copy.pickAttachment}</AppText>
            </Pressable>
          )}
        </View>

        {submitError ? (
          <AppText style={styles.errorText}>{submitError}</AppText>
        ) : null}
      </View>
    </ContractConfirmSheet>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    form: {
      rowGap: 10,
      marginTop: 4,
    },
    reasonInput: {
      minHeight: 96,
      textAlignVertical: 'top',
    },
    errorText: {
      ...text.caption,
      color: theme.status.error.text,
    },
    attachmentBlock: {
      rowGap: 6,
    },
    attachmentLabel: {
      ...text.smallSemibold,
      color: theme.text.primary,
    },
    attachmentHint: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    pickButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border.default,
      backgroundColor: theme.background.input,
    },
    pickLabel: {
      ...text.smallMedium,
      color: theme.brand.primary,
    },
    pickedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    pickedName: {
      ...text.small,
      color: theme.text.primary,
      flex: 1,
    },
    removeLink: {
      ...text.captionSemibold,
      color: theme.status.error.text,
    },
  });
};
