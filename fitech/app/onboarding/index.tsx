import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated as RNAnimated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Entrena a tu ritmo',
    description: 'Lleva un control de tus rutinas y avanza a tu manera.',
    image: require('../../assets/images/onboarding/slide_1.png'),
    background: ['#00C2FF', '#0F4C81'],
    blobColor: '#ffffff30',
  },
  {
    key: '2',
    title: 'Sigue tu progreso',
    description: 'Visualiza tu evolución y mantente motivado.',
    image: require('../../assets/images/onboarding/slide_2.png'),
    background: ['#3E75AA', '#0A365E'],
    blobColor: '#ffffff20',
  },
  {
    key: '3',
    title: 'Crea el hábito',
    description: 'Establece metas, sé constante y hazlo parte de tu vida.',
    image: require('../../assets/images/onboarding/slide_3.png'),
    background: ['#1BA9FF', '#004B75'],
    blobColor: '#ffffff15',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new RNAnimated.Value(0)).current;
  const flatListRef = useRef();
  const router = useRouter();

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const startColor = scrollX.interpolate({
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map((s) => s.background[0]),
  });

  const endColor = scrollX.interpolate({
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map((s) => s.background[1]),
  });

  return (
    <View style={styles.container}>
      {/* Animated gradient background */}
      <RNAnimated.View style={StyleSheet.absoluteFill}>
        <RNAnimatedGradient startColor={startColor} endColor={endColor} />
      </RNAnimated.View>

      <FlatList
        data={slides}
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View
              style={[
                styles.blobContainer,
                { backgroundColor: item.blobColor },
              ]}
            >
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* ⬇️ Floating dot indicators */}
      <View
        style={[
          styles.indicatorContainer,
          {
            position: 'absolute',
            bottom: height * 0.22,
            alignSelf: 'center',
          },
        ]}
      >
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const widthAnim = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <RNAnimated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: widthAnim,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Empezar' : 'Saltar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Animated LinearGradient background
const RNAnimatedGradient = ({ startColor, endColor }) => {
  const AnimatedLinearGradient =
    RNAnimated.createAnimatedComponent(LinearGradient);
  return (
    <AnimatedLinearGradient
      colors={[startColor, endColor]}
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 80,
  },
  blobContainer: {
    borderRadius: 150,
    padding: 20,
    marginBottom: 30,
    maxHeight: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.55,
    height: undefined,
    aspectRatio: 1,
    maxHeight: height * 0.25,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#E5F0FF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 6,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
  },
  buttonText: {
    color: '#0F4C81',
    fontWeight: '700',
    fontSize: 16,
  },
});
