import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useCancelContract } from '@/app/api/mutations/use-cancel-contract';
import { useCompleteContract } from '@/app/api/mutations/use-complete-contract';
import { AppText } from '@/app/components/AppText';
import PageContainer from '@/app/components/PageContainer';
import { ROUTES } from '@/constants/routes';
import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import CancelModal from './CancelModal';
import CompleteModal from './CompleteModal';

export default function ContractDetailScreen() {
  const { theme } = useTheme();
  const { contract } = useLocalSearchParams();
  const { mutate: completeContract } = useCompleteContract();
  const { mutate: cancelContract } = useCancelContract();
  const router = useRouter();

  const [displayComplete, setDisplayComplete] = useState(false);
  const [displayCancel, setDisplayCancel] = useState(false);

  const parsedContract = useMemo(
    () => (contract ? JSON.parse(contract as string) : null),
    [contract],
  );

  const styles = getStyles(theme);

  const handleComplete = useCallback(() => {
    completeContract(parsedContract?.id, {
      onSuccess: () => {
        router.push(ROUTES.contracts);
      },
    });
  }, [parsedContract?.id]);

  const handleCancel = useCallback(() => {
    cancelContract(parsedContract?.id, {
      onSuccess: () => {
        router.push(ROUTES.contracts);
      },
    });
  }, [parsedContract?.id]);

  return (
    <PageContainer style={{ padding: 16 }}>
      <AppText
        style={[
          styles.title,
          { textAlign: 'left', marginTop: 16, marginRight: 50 },
        ]}
      >
        <Feather name="info" size={22} />
        &nbsp;{'Detalles del Contrato'}
      </AppText>
      <View style={{ marginVertical: 10, rowGap: 12, padding: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, rowGap: 12 }}>
            <View>
              <AppText style={styles.label}>{'Servicio'}</AppText>
              <AppText style={styles.info}>
                {parsedContract?.serviceName}
              </AppText>
            </View>
            <View>
              <AppText style={styles.label}>{'Estado'}</AppText>
              <AppText style={styles.info}>
                {parsedContract?.contractStatus === 'ACTIVE'
                  ? 'Activo'
                  : parsedContract?.contractStatus === 'CANCELLED'
                    ? 'Cancelado'
                    : 'Completado'}
              </AppText>
            </View>
            {parsedContract.totalAmount && (
              <View>
                <AppText style={styles.label}>{'Monto Total'}</AppText>
                <AppText
                  style={styles.info}
                >{`S/. ${parsedContract.totalAmount.toFixed(2)}`}</AppText>
              </View>
            )}
            <View>
              <AppText style={styles.label}>{'Estado de Pago'}</AppText>
              <AppText style={styles.info}>
                {parsedContract?.paymentStatus ?? '-'}
              </AppText>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', rowGap: 10 }}>
            <Image
              source={{
                uri: `https://appfitech.com/v1/app/file-upload/view/${parsedContract.trainerProfilePhotoId}`,
              }}
              style={[styles.avatar, { marginBottom: 4 }]}
            />
            {parsedContract?.contractStatus === 'ACTIVE' && (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.green400,
                    padding: 12,
                    borderRadius: 12,
                  }}
                  onPress={() => setDisplayComplete(true)}
                >
                  <AppText
                    style={{
                      fontSize: 16,
                      color: theme.green900,
                      fontWeight: 600,
                    }}
                  >
                    Completar
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.errorText,
                    padding: 12,
                    borderRadius: 12,
                  }}
                  onPress={() => setDisplayCancel(true)}
                >
                  <AppText
                    style={{
                      fontSize: 16,
                      color: theme.errorBackground,
                      fontWeight: 600,
                    }}
                  >
                    Cancelar
                  </AppText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View>
          <AppText style={styles.label}>{'Fecha creación'}</AppText>
          <AppText style={styles.info}>
            {parsedContract?.createdAt ?? '-'}
          </AppText>
        </View>
        <View>
          <AppText style={styles.label}>{'Fecha inicio del plan'}</AppText>
          <AppText style={styles.info}>
            {parsedContract?.startDate ?? '-'}
          </AppText>
        </View>
        <View>
          <AppText style={styles.label}>{'Descripción'}</AppText>
          <AppText style={styles.info}>
            {parsedContract?.serviceDescription}
          </AppText>
        </View>
      </View>
      <CompleteModal
        isOpen={displayComplete}
        onCloseModal={() => setDisplayComplete(false)}
        onComplete={handleComplete}
      />
      <CancelModal
        isOpen={displayCancel}
        onCloseModal={() => setDisplayCancel(false)}
        onCancel={handleCancel}
      />
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    label: {
      fontSize: 15,
      color: theme.dark500,
      fontWeight: 600,
      marginBottom: 4,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    info: { fontSize: 18, color: theme.dark700, fontWeight: 500 },
    ...HEADING_STYLES(theme),
  });
