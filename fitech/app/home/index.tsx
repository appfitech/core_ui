import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES } from '@/constants/routes';
import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { PublicTrainerDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { truncateWords } from '@/utils/strings';
import { getUserAvatarURL } from '@/utils/user';

import DietSVG from '../../assets/images/vectors/diet.svg';
import RoutineSVG from '../../assets/images/vectors/routine.svg';
import { useSearchTrainers } from '../api/mutations/use-search-trainers';
import { useGetDiets } from '../api/queries/use-get-diets';
import { useGetRoutines } from '../api/queries/use-get-routines';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';
import { SearchBar } from '../components/SearchBar';
import { SupportButton } from '../components/SupportButton';
import { Tag } from '../components/Tag';

export default function HomeScreen() {
  const token = useUserStore((s) => s.getToken());
  const user = useUserStore((s) => s.user);
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [trainers, setTrainers] = useState<PublicTrainerDtoReadable[]>([]);
  const insets = useSafeAreaInsets();

  const { data: routines } = useGetRoutines();
  const { data: diets } = useGetDiets();
  const { mutate: searchTrainers } = useSearchTrainers();

  useEffect(() => {
    if (!token) return;

    searchTrainers(
      { query: '' },
      {
        onSuccess: (data) => setTrainers(data),
      },
    );
  }, [token]);

  const userAvatarURL = getUserAvatarURL(user?.user?.person);

  const handleTrainersClick = useCallback(() => {
    router.push(ROUTES.trainers);
  }, []);

  const handleProfileClick = useCallback(() => {
    router.push(ROUTES.profile);
  }, []);

  const handleActivityViewAll = useCallback(() => {
    router.push(ROUTES.workouts);
  }, []);

  const handleMacrosNav = useCallback(() => {
    router.push(ROUTES.macrosCalculator);
  }, []);

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <View style={styles.avatarRow}>
            {userAvatarURL && (
              <Image source={{ uri: userAvatarURL }} style={styles.avatar} />
            )}
            <TouchableOpacity onPress={handleProfileClick}>
              <AppText style={styles.greeting}>
                {`Hola ${user?.user?.person?.firstName}`}
              </AppText>
              <AppText style={styles.subtext}>Buen día</AppText>
            </TouchableOpacity>
          </View>
          <SupportButton />
        </View>

        <TouchableOpacity
          style={{
            paddingHorizontal: 16,
            flexDirection: 'row',

            columnGap: 4,
            alignItems: 'center',
          }}
          onPress={handleTrainersClick}
        >
          <SearchBar
            placeholder="Buscar trainers…"
            readOnly
            onPress={handleTrainersClick}
          />
        </TouchableOpacity>
      </View>

      <PageContainer hasBackButton={false} hasNoTopPadding>
        <View style={styles.contentWrapper}>
          {/* Macros Section */}
          <TouchableOpacity onPress={handleMacrosNav}>
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                padding: 16,
                backgroundColor: theme.backgroundInverted,
                borderRadius: 20,
                columnGap: 10,
                alignItems: 'center',
              }}
            >
              <View style={{ width: 120 }}>
                <Image
                  source={require('../../assets/images/vectors/macro_icon.png')}
                  style={styles.image}
                  resizeMode={'contain'}
                />
              </View>
              <View style={{ flex: 1, rowGap: 8 }}>
                <AppText
                  style={{
                    color: theme.background,
                    fontSize: 19,
                    fontWeight: '800',
                  }}
                >
                  {'¿Este snack es fit o fat?'}
                </AppText>
                <AppText style={{ color: theme.dark100, fontSize: 16.5 }}>
                  {
                    'Busca tus alimentos favoritos y revisa sus macros sin juzgar 😌'
                  }
                </AppText>
              </View>
            </View>
          </TouchableOpacity>

          {/* My activity section */}
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>{'Mis actividades'}</AppText>
            <TouchableOpacity
              onPress={handleActivityViewAll}
              style={styles.sectionAction}
            >
              <AppText style={styles.sectionActionText}>{'Ver todo'}</AppText>
              <Feather
                color={theme.successText}
                size={16}
                name="chevrons-right"
              />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', columnGap: 10 }}>
            {!!routines?.[0] && (
              <Animated.View
                entering={FadeInUp.delay(100).duration(500)}
                style={[
                  styles.card,
                  { backgroundColor: theme.dark300, flex: 1 },
                ]}
              >
                <View style={styles.iconWrapper}>
                  <RoutineSVG width={75} height={75} />
                </View>
                <View style={{ rowGap: 6, flex: 1 }}>
                  <AppText style={styles.cardTitle}>
                    {routines[0].resourceName?.split('-')?.[0]}
                  </AppText>

                  <AppText style={styles.cardSubBold}>
                    {`Entrenador: ${routines[0]?.trainerName}`}
                  </AppText>
                </View>
                <View style={{ alignSelf: 'flex-end' }}>
                  <Tag
                    label={routines[0].resourceType}
                    textColor={theme.background}
                    backgroundColor={theme.backgroundInverted}
                  />
                </View>
              </Animated.View>
            )}
            {!!diets?.[0] && (
              <Animated.View
                entering={FadeInUp.delay(100).duration(500)}
                style={[
                  styles.card,
                  { backgroundColor: theme.dark600, flex: 1 },
                ]}
              >
                {' '}
                <TouchableOpacity
                  onPress={() =>
                    router.push(`${ROUTES.diets}/${diets?.[0].id}`)
                  }
                >
                  <View style={styles.iconWrapper}>
                    <DietSVG width={75} height={75} />
                  </View>
                  <View style={{ rowGap: 4, flex: 1 }}>
                    <AppText
                      style={[styles.cardTitle, { color: theme.dark100 }]}
                    >
                      {diets[0].resourceName?.split('-')?.[0]}
                    </AppText>

                    <AppText
                      style={[styles.cardSubBold, { color: theme.dark200 }]}
                    >
                      {`Entrenador: ${routines[0]?.trainerName}`}
                    </AppText>
                  </View>
                  <View style={{ alignSelf: 'flex-end' }}>
                    <Tag
                      label={diets[0].resourceType}
                      textColor={theme.backgroundInverted}
                      backgroundColor={theme.background}
                    />
                  </View>{' '}
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* Featured Trainers */}
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>
              {'Entrenadores destacados'}
            </AppText>
            <TouchableOpacity
              onPress={handleTrainersClick}
              style={styles.sectionAction}
            >
              <AppText style={styles.sectionActionText}>{'Ver todos'}</AppText>
              <Feather
                color={theme.successText}
                size={16}
                name="chevrons-right"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 8 }}
          >
            {trainers?.slice(0, 4)?.map((trainer) => (
              <Animated.View
                key={trainer?.id}
                entering={FadeInUp.delay(100).duration(500)}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.dark200,
                    maxWidth: 200,
                    alignSelf: 'flex-start',
                  },
                ]}
              >
                <View style={{ rowGap: 4 }}>
                  <Image
                    source={{ uri: getUserAvatarURL(trainer?.person) }}
                    style={[styles.avatar, { marginBottom: 4 }]}
                  />
                  <AppText
                    style={{
                      fontWeight: '600',
                      fontSize: 17,
                      color: theme.dark900,
                    }}
                  >
                    {`${trainer?.person?.firstName} ${trainer?.person?.lastName}`}
                  </AppText>
                  <AppText style={{ color: theme.textSecondary, fontSize: 16 }}>
                    {truncateWords(trainer?.person?.bio ?? '', 20)}
                  </AppText>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </PageContainer>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      position: 'relative',
      backgroundColor: theme.background,
    },
    headerWrapper: {
      paddingVertical: 16,
      rowGap: 16,
      backgroundColor: theme.background,
    },
    headerRow: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    avatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
    },
    contentWrapper: {
      backgroundColor: theme.dark100,
      padding: 16,
      rowGap: 20,
      paddingBottom: 100,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontWeight: '700',
      fontSize: 16,
    },
    sectionAction: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionActionText: {
      color: theme.successText,
      fontSize: 14,
      fontWeight: '700',
    },
    cardTitle: {
      fontWeight: '600',
      fontSize: 17,
      color: theme.textPrimary,
    },
    cardSub: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    cardSubBold: {
      color: theme.textSecondary,
      fontWeight: '700',
    },
    greeting: {
      ...HEADING_STYLES(theme).title,
      fontWeight: '700',
      color: theme.green800,
    },
    subtext: {
      ...HEADING_STYLES(theme).subtitle,
      textAlign: 'left',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    iconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    ...SHARED_STYLES(theme),
    card: {
      backgroundColor: theme.primaryBg,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.backgroundInverted,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 4,
      rowGap: 8,
    },
    image: {
      width: '100%',
      height: 100,
    },
  });
