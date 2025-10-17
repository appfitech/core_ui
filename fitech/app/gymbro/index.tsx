// app/gymbro/index.tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeInUp,
  FadeOutUp,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/app/components/AppText';
import PageContainer from '@/app/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { Profile, useGymBroStore } from '@/stores/gymBroStore';
import type { FullTheme } from '@/types/theme';

import { useGetGymBroList } from '../api/queries/matches/use-get-gymbro-list';
import { MOCK_PROFILES } from './mockProfiles';

type Preferences = {
  goals: string[];
  minAge?: number;
  maxAge?: number;
  maxDistanceKm?: number;
  levels?: Profile['level'][];
};

const MOCK_PREFS: Preferences = {
  goals: ['Fuerza', 'Pérdida de peso', 'Resistencia'],
  minAge: 22,
  maxAge: 36,
  maxDistanceKm: 12,
  levels: ['Beginner', 'Intermediate', 'Advanced'],
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CARD_W = SCREEN_W * 0.9;
// Shorter card so sticky actions are clear
const CARD_H = Math.min(320, SCREEN_H * 0.45);
const IMAGE_H = Math.round(CARD_H * 0.52);
const SWIPE_THRESHOLD = CARD_W * 0.35;

function filterByPreferences(list: Profile[], prefs: Preferences) {
  return list.filter((p) => {
    if (prefs.minAge && (p.age ?? 0) < prefs.minAge) return false;
    if (prefs.maxAge && (p.age ?? 0) > prefs.maxAge) return false;
    if (prefs.maxDistanceKm && (p.distanceKm ?? Infinity) > prefs.maxDistanceKm)
      return false;
    if (prefs.levels && !prefs.levels.includes(p.level)) return false;
    if (prefs.goals?.length && !p.goals.some((g) => prefs.goals.includes(g)))
      return false;
    return true;
  });
}

function Pill({
  children,
  bg,
  color,
}: {
  children: React.ReactNode;
  bg: string;
  color: string;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <AppText style={{ fontSize: 12, color, fontWeight: '600' }}>
        {children}
      </AppText>
    </View>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CircleButton({
  onPress,
  children,
  bg,
  border,
  size = 68, // bigger buttons
}: {
  onPress: () => void;
  children: React.ReactNode;
  bg: string;
  border?: string;
  size?: number;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Animate on press in/out so it feels responsive immediately
  const handlePressIn = () => {
    scale.value = withTiming(0.94, { duration: 80 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };
  const handlePress = () => {
    // fire action immediately so user doesn't need to hold
    onPress();
    // quick pulse that plays even if state changes
    scale.value = withSequence(
      withTiming(1.08, { duration: 100, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 14, stiffness: 180 }),
    );
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      hitSlop={12}
      style={[
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderColor: border ?? 'transparent',
          borderWidth: border ? 1 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

function ProfileCard({ p, theme }: { p: Profile; theme: FullTheme }) {
  const [useFallback, setUseFallback] = useState(false);
  const uri = useFallback
    ? `https://picsum.photos/seed/gymbro-${p.id}/1200/900`
    : p.photo;

  return (
    <View style={[styles.card, { width: CARD_W, height: CARD_H }]}>
      <ImageBackground
        source={{ uri }}
        style={{ height: IMAGE_H }}
        imageStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        resizeMode="cover"
        onError={() => setUseFallback(true)}
      />
      <View
        style={[
          styles.cardFooter,
          {
            backgroundColor: theme.card,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            flex: 1,
          },
        ]}
      >
        <View style={{ gap: 6 }}>
          <AppText
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: theme.textPrimary,
            }}
          >
            {p.name}
            {p.age ? `, ${p.age}` : ''}
          </AppText>
          <AppText style={{ fontSize: 14, color: theme.textSecondary }}>
            {p.distanceKm != null ? `${p.distanceKm.toFixed(1)} km cerca` : ''}
          </AppText>
        </View>

        <View style={styles.pillsRow}>
          {p.goals.map((g) => (
            <Pill key={g} bg={theme.backgroundHeader} color={theme.textPrimary}>
              {g}
            </Pill>
          ))}
          <Pill bg={theme.backgroundHeader} color={theme.textPrimary}>
            {p.level}
          </Pill>
        </View>

        {!!p.bio && (
          <AppText
            style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18 }}
            numberOfLines={3}
          >
            {p.bio}
          </AppText>
        )}
      </View>
    </View>
  );
}

type Mode = 'discover' | 'saved';

export default function GymBroScreen() {
  const theme = useTheme() as FullTheme;
  const { saved, discarded, markSaved, markDiscarded } = useGymBroStore();

  const { data: candidates } = useGetGymBroList();
  console.log('[K] data', candidates?.data);

  const available = useMemo(() => {
    const filtered = filterByPreferences(MOCK_PROFILES, MOCK_PREFS);
    return filtered.filter((p) => !(p.id in saved) && !(p.id in discarded));
  }, [saved, discarded]);

  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('discover');
  const current = available[index];

  // Local removed IDs to **guarantee** Guardados updates instantly
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const resetCard = () => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotation.value = withSpring(0);
  };

  const onSwiped = useCallback(
    (dir: 'left' | 'right') => {
      if (!current) return;
      if (dir === 'right') markSaved(current);
      else markDiscarded(current);
      setIndex((prev) => Math.min(prev + 1, Math.max(available.length - 1, 0)));
      resetCard();
    },
    [current, available.length, markSaved, markDiscarded],
  );

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      rotation.value = e.translationX / 18;
    },
    onEnd: (e) => {
      const shouldLeft = e.translationX < -SWIPE_THRESHOLD;
      const shouldRight = e.translationX > SWIPE_THRESHOLD;

      if (shouldLeft || shouldRight) {
        const toX = (shouldRight ? SCREEN_W : -SCREEN_W) * 1.2;
        translateX.value = withTiming(
          toX,
          { duration: 220, easing: Easing.out(Easing.quad) },
          () => runOnJS(onSwiped)(shouldRight ? 'right' : 'left'),
        );
        translateY.value = withTiming(e.translationY, { duration: 220 });
        rotation.value = withTiming((shouldRight ? 1 : -1) * 20, {
          duration: 220,
        });
      } else {
        resetCard();
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(Math.max(0, translateX.value / SWIPE_THRESHOLD), {
      duration: 50,
    }),
  }));
  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(Math.max(0, -translateX.value / SWIPE_THRESHOLD), {
      duration: 50,
    }),
  }));

  const handlePass = () => onSwiped('left');
  const handleSave = () => onSwiped('right');

  // Saved list filters out locally removed and store-discarded items
  const savedList = useMemo(
    () =>
      Object.values(saved).filter(
        (it) =>
          !removedIds.has(String(it.id)) &&
          !(String(it.id) in (discarded as any)),
      ),
    [saved, removedIds, discarded],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PageContainer>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Banner */}
          <View
            style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6 }}
          >
            <AppText
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: theme.textPrimary,
              }}
            >
              GymBro
            </AppText>
            <AppText
              style={{
                fontSize: 14,
                lineHeight: 20,
                color: theme.textSecondary,
              }}
            >
              {
                'Porque entrenar acompañado siempre es mejor. Conecta con alguien que entrene a tu ritmo y comparte la motivación.'
              }
            </AppText>
          </View>

          {/* Segmented Control */}
          <View
            style={[
              styles.segmentWrap,
              { borderColor: theme.border, backgroundColor: theme.background },
            ]}
          >
            <Pressable
              style={[
                styles.segmentBtn,
                {
                  backgroundColor:
                    mode === 'discover' ? theme.primaryBg : 'transparent',
                  borderColor:
                    mode === 'discover' ? theme.primary : 'transparent',
                },
              ]}
              onPress={() => setMode('discover')}
            >
              <AppText
                style={{
                  fontWeight: '700',
                  color:
                    mode === 'discover'
                      ? theme.primaryText
                      : theme.textSecondary,
                }}
              >
                Descubre
              </AppText>
            </Pressable>

            <Pressable
              style={[
                styles.segmentBtn,
                {
                  backgroundColor:
                    mode === 'saved' ? theme.primaryBg : 'transparent',
                  borderColor: mode === 'saved' ? theme.primary : 'transparent',
                },
              ]}
              onPress={() => setMode('saved')}
            >
              <AppText
                style={{
                  fontWeight: '700',
                  color:
                    mode === 'saved' ? theme.primaryText : theme.textSecondary,
                }}
              >
                Guardados ({savedList.length})
              </AppText>
            </Pressable>
          </View>

          {/* Content + sticky actions */}
          <View style={{ flex: 1 }}>
            {mode === 'discover' ? (
              <View
                style={[
                  styles.center,
                  {
                    // extra room so sticky buttons don't overlap
                    paddingBottom: 140,
                  },
                ]}
              >
                {current ? (
                  <PanGestureHandler onGestureEvent={gestureHandler}>
                    <Animated.View style={[cardStyle]}>
                      <ProfileCard p={current} theme={theme} />
                      <Animated.View
                        style={[styles.badge, styles.badgeRight, likeOpacity]}
                      >
                        <AppText
                          style={[
                            styles.badgeText,
                            { color: theme.successText },
                          ]}
                        >
                          CONTACTAR
                        </AppText>
                      </Animated.View>
                      <Animated.View
                        style={[styles.badge, styles.badgeLeft, nopeOpacity]}
                      >
                        <AppText
                          style={[styles.badgeText, { color: theme.errorText }]}
                        >
                          DESCARTAR
                        </AppText>
                      </Animated.View>
                    </Animated.View>
                  </PanGestureHandler>
                ) : (
                  <View
                    style={[
                      styles.empty,
                      {
                        width: CARD_W,
                        height: CARD_H,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <AppText style={{ color: theme.textSecondary }}>
                      No hay más perfiles por ahora ✨
                    </AppText>
                  </View>
                )}
              </View>
            ) : (
              <FlatList
                data={savedList}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{
                  padding: 16,
                  gap: 12,
                  paddingBottom: 24,
                }}
                renderItem={({ item }) => (
                  <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
                    <View
                      style={{
                        borderRadius: 16,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: theme.border,
                        backgroundColor: theme.card,
                      }}
                    >
                      <ImageBackground
                        source={{ uri: item.photo }}
                        style={{ height: 140, justifyContent: 'flex-end' }}
                        imageStyle={{
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                        }}
                        resizeMode="cover"
                      >
                        <View
                          style={{
                            backgroundColor: theme.isDark
                              ? 'rgba(0,0,0,0.35)'
                              : 'rgba(0,0,0,0.2)',
                            padding: 12,
                          }}
                        >
                          <AppText
                            style={{
                              color: theme.backgroundInverted || '#fff',
                              fontWeight: '800',
                            }}
                          >
                            {item.name}
                            {item.age ? `, ${item.age}` : ''} • {item.level}
                          </AppText>
                          <AppText
                            style={{
                              color: theme.backgroundInverted || '#fff',
                            }}
                          >
                            {item.distanceKm != null
                              ? `${item.distanceKm.toFixed(1)} km cerca`
                              : ''}
                          </AppText>
                        </View>
                      </ImageBackground>

                      <View style={{ padding: 12, gap: 8 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 8,
                          }}
                        >
                          {item.goals.map((g) => (
                            <Pill
                              key={g}
                              bg={theme.backgroundHeader}
                              color={theme.textPrimary}
                            >
                              {g}
                            </Pill>
                          ))}
                        </View>

                        {!!item.bio && (
                          <AppText
                            style={{
                              color: theme.textSecondary,
                              lineHeight: 18,
                            }}
                          >
                            {item.bio}
                          </AppText>
                        )}

                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 12,
                            marginTop: 4,
                          }}
                        >
                          <CircleButton
                            onPress={() => {}}
                            bg={theme.primary}
                            size={56}
                          >
                            <AppText
                              style={{
                                fontWeight: '700',
                                color: theme.primaryText,
                              }}
                            >
                              Contactar
                            </AppText>
                          </CircleButton>

                          <CircleButton
                            onPress={() => {
                              // Store update
                              markDiscarded(item);
                              // Local instant removal (works even if store batching delays)
                              setRemovedIds((prev) => {
                                const next = new Set(prev);
                                next.add(String(item.id));
                                return next;
                              });
                            }}
                            bg={theme.background}
                            border={theme.border}
                            size={56}
                          >
                            <AppText
                              style={{
                                fontWeight: '700',
                                color: theme.textPrimary,
                              }}
                            >
                              Quitar
                            </AppText>
                          </CircleButton>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                )}
                ListEmptyComponent={
                  <View style={{ padding: 24, alignItems: 'center' }}>
                    <AppText style={{ color: theme.textSecondary }}>
                      Aún no guardas a nadie. Ve a “Descubre” y desliza a la
                      derecha para guardar.
                    </AppText>
                  </View>
                }
              />
            )}

            {/* Sticky actions */}
            {mode === 'discover' && !!current && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 22,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  zIndex: 20,
                }}
                pointerEvents="box-none"
              >
                {/* ✕ */}
                <CircleButton
                  onPress={handlePass}
                  bg={theme.backgroundHeader}
                  size={68}
                >
                  <Ionicons name="close" size={34} color={theme.textPrimary} />
                </CircleButton>

                {/* Reset */}
                <CircleButton onPress={resetCard} bg={theme.card} size={56}>
                  <Ionicons
                    name="refresh"
                    size={28}
                    color={theme.textPrimary}
                  />
                </CircleButton>

                {/* Dumbbell */}
                <CircleButton onPress={handleSave} bg={theme.primary} size={68}>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={34}
                    color={theme.primaryText}
                  />
                </CircleButton>
              </View>
            )}
          </View>
        </SafeAreaView>
      </PageContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  segmentWrap: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 999,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 24, overflow: 'hidden' },
  cardFooter: { padding: 16, gap: 10 },
  cardOverlay: { ...StyleSheet.absoluteFillObject },
  cardContent: { gap: 10, padding: 16 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  empty: {
    borderWidth: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  badgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  badgeLeft: { left: 16 },
  badgeRight: { right: 16 },
});
