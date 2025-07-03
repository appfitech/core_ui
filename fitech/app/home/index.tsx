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
import { SearchBar } from '../components/SearchBar';
import { SupportButton } from '../components/SupportButton';
import { Tag } from '../components/Tag';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useUserStore((s) => s.user);
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [trainers, setTrainers] = useState<PublicTrainerDtoReadable[]>([]);

  const { data: routines } = useGetRoutines();
  const { data: diets } = useGetDiets();
  const { mutate: searchTrainers } = useSearchTrainers();

  console.log('[K] trainers', trainers);

  useEffect(() => {
    searchTrainers(
      { query: '' },
      {
        onSuccess: (data) => {
          setTrainers(data);
        },
      },
    );
  }, []);

  const userAvatarURL = getUserAvatarURL(user?.user?.person);

  const handleTrainersClick = useCallback(
    () => router.push(ROUTES.trainers),
    [],
  );
  const handleProfileClick = useCallback(() => router.push(ROUTES.profile), []);
  const handleActivityViewAll = useCallback(
    () => router.push(ROUTES.workouts),
    [],
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 12,
            }}
          >
            {userAvatarURL && (
              <Image source={{ uri: userAvatarURL }} style={styles.avatar} />
            )}
            <TouchableOpacity onPress={handleProfileClick}>
              <AppText style={styles.greeting}>
                {`Hola ${user?.user?.person?.firstName}`}
              </AppText>
              <AppText style={styles.subtext}>{'Buen día'}</AppText>
            </TouchableOpacity>
          </View>
          <SupportButton />
        </View>

        <TouchableOpacity
          style={{ paddingHorizontal: 16 }}
          onPress={handleTrainersClick}
        >
          <SearchBar
            placeholder={'Buscar trainers…'}
            readOnly
            onPress={handleTrainersClick}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrapper}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <AppText
            style={{ color: theme.textPrimary, fontWeight: 700, fontSize: 16 }}
          >
            {'Mis actividades'}
          </AppText>
          <TouchableOpacity
            onPress={handleActivityViewAll}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <AppText
              style={{
                color: theme.successText,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {'Ver todo'}
            </AppText>
            <Feather
              color={theme.successText}
              size={16}
              name="chevrons-right"
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', columnGap: 6 }}>
          {!!routines?.length && routines?.[0] && (
            <Animated.View
              entering={FadeInUp.delay(100).duration(500)}
              style={[styles.card, { backgroundColor: theme.dark300, flex: 1 }]}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <RoutineSVG width={75} height={75} />
              </View>
              <View style={{ rowGap: 4, flex: 1 }}>
                <AppText
                  style={{
                    fontWeight: '600',
                    fontSize: 15,
                    color: theme.textPrimary,
                  }}
                >
                  {routines[0].resourceName?.split('-')?.[0]}
                </AppText>
                <AppText style={{ color: theme.textSecondary }}>
                  {routines[0].resourceDetails}
                </AppText>

                <AppText
                  style={{ color: theme.textSecondary, fontWeight: '700' }}
                >
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
          {!!diets?.length && diets?.[0] && (
            <Animated.View
              entering={FadeInUp.delay(100).duration(500)}
              style={[styles.card, { backgroundColor: theme.dark700, flex: 1 }]}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <DietSVG width={75} height={75} />
              </View>
              <View style={{ rowGap: 4, flex: 1 }}>
                <AppText
                  style={{
                    fontWeight: '600',
                    fontSize: 15,
                    color: theme.dark100,
                  }}
                >
                  {diets[0].resourceName?.split('-')?.[0]}
                </AppText>
                <AppText style={{ color: theme.dark300 }}>
                  {diets[0].resourceDetails}
                </AppText>
                <AppText style={{ color: theme.dark300, fontWeight: '700' }}>
                  {`Entrenador: ${routines[0]?.trainerName}`}
                </AppText>
              </View>
              <View style={{ alignSelf: 'flex-end' }}>
                <Tag
                  label={diets[0].resourceType}
                  textColor={theme.backgroundInverted}
                  backgroundColor={theme.background}
                />
              </View>
            </Animated.View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <AppText
            style={{ color: theme.textPrimary, fontWeight: 700, fontSize: 16 }}
          >
            {'Entrenadores destacados'}
          </AppText>
          <TouchableOpacity
            onPress={handleTrainersClick}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <AppText
              style={{
                color: theme.successText,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {'Ver todos'}
            </AppText>
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
                  backgroundColor: theme.dark100,
                  maxWidth: 200,
                  alignSelf: 'flex-start',
                },
              ]}
            >
              <View style={{ rowGap: 4 }}>
                <AppText
                  style={{
                    fontWeight: '600',
                    fontSize: 15,
                    color: theme.dark900,
                  }}
                >
                  {`${trainer?.person?.firstName} ${trainer?.person?.lastName}`}
                </AppText>
                <AppText style={{ color: theme.textSecondary }}>
                  {truncateWords(trainer?.person?.bio ?? '', 30)}
                </AppText>
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundHeader,
    },
    headerWrapper: {
      backgroundColor: theme.backgroundHeader,
      paddingVertical: 16,
      rowGap: 16,
    },
    headerRow: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    contentWrapper: {
      backgroundColor: theme.background,
      flex: 1,
      minHeight: '100%',
      padding: 16,
      rowGap: 20,
      paddingBottom: 200,
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
  });
