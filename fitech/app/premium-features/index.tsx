import { router } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetUserMatchPreferences } from '../api/queries/use-get-user-match-preferences';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

export default function PremiumFeaturesScreen() {
  const { theme } = useTheme();
  const { data: matchPreferences } = useGetUserMatchPreferences();

  const styles = getStyles(theme);

  return (
    <PageContainer hasBackButton={false} style={{ paddingHorizontal: 16 }}>
      <View style={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={{ paddingVertical: 16, rowGap: 8 }}>
          <AppText style={styles.title}>
            {'Bienvenido a FITECH Premium'}
          </AppText>
          <AppText style={styles.subtitle}>
            {
              'Accede a funciones exclusivas para llevar tu entrenamiento al siguiente nivel'
            }
          </AppText>
        </View>

        <View style={styles.bannerList}>
          <TouchableOpacity
            style={[
              styles.banner,
              { backgroundColor: theme.successBackground },
            ]}
          >
            <Image
              source={require('../../assets/images/vectors/gym_library.png')}
              style={styles.image}
              resizeMode={'contain'}
            />

            <View style={styles.bannerContent}>
              <AppText style={styles.bannerTitle}>{'Biblioteca'}</AppText>
              <AppText style={styles.bannerDescription}>
                {
                  'Accede a una colección épica de rutinas y movimientos para entrenar como un pro. Desde básicos hasta avanzados, todo en un solo lugar.'
                }
              </AppText>
            </View>
          </TouchableOpacity>

          {matchPreferences?.showInGymBro && (
            <TouchableOpacity
              onPress={() => router.push('/gymbro')}
              style={[styles.banner, { backgroundColor: theme.infoBackground }]}
            >
              <View style={styles.bannerContent}>
                <AppText style={styles.bannerTitle}>{'GymBro'}</AppText>
                <AppText style={styles.bannerDescription}>
                  {
                    'Porque entrenar acompañado siempre es mejor. Conecta con alguien que entrene a tu ritmo y comparte la motivación.'
                  }
                </AppText>
              </View>
              <Image
                source={require('../../assets/images/vectors/gym_bro.png')}
                style={styles.image}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          )}

          {matchPreferences?.showInGymCrush && (
            <TouchableOpacity
              style={[
                styles.banner,
                { backgroundColor: theme.orangeBackground },
              ]}
              onPress={() => router.push('/gymcrush')}
            >
              <Image
                source={require('../../assets/images/vectors/gym_crush.png')}
                style={styles.image}
                resizeMode={'contain'}
              />
              <View style={styles.bannerContent}>
                <AppText style={styles.bannerTitle}>{'GymCrush'}</AppText>
                <AppText style={styles.bannerDescription}>
                  {
                    'Descubre entrenadores que se alinean con tus metas, estilo de vida y forma de entrenar. Swipea, conecta y empieza a trabajar con el coach perfecto para ti.'
                  }
                </AppText>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...HEADING_STYLES(theme),
    bannerList: {
      rowGap: 20,
      marginTop: 20,
    },
    banner: {
      borderRadius: 16,
      padding: 16,
      display: 'flex',
      flexDirection: 'row',
      columnGap: 8,
      alignItems: 'center',
    },
    bannerContent: {
      flex: 1,
      rowGap: 6,
    },
    bannerTitle: {
      fontSize: 19,
      fontWeight: '600',
      color: theme.backgroundInverted,
    },
    bannerDescription: {
      fontSize: 16,
      color: theme.backgroundInverted,
    },
    image: {
      width: 120,
      height: '100%',
    },
  });
