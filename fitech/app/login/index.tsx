import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeInUp,
  SlideInDown,
  ZoomIn
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import Vector1 from "../../assets/images/vectors/vector_1.svg";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [showCard, setShowCard] = useState(false);

  const logoY = useSharedValue(height / 2 - 100);
  const logoScale = useSharedValue(1);

  useEffect(() => {
    setTimeout(() => {
      logoY.value = withTiming(80, {
        duration: 800,
        easing: Easing.out(Easing.exp)
      });
      logoScale.value = withTiming(0.7, {
        duration: 800,
        easing: Easing.out(Easing.exp)
      });
      setShowCard(true);
    }, 1200);
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoY.value }, { scale: logoScale.value }],
    opacity: withTiming(1, { duration: 200 })
  }));

  return (
    <LinearGradient
      colors={[COLORS.dark.background, COLORS.dark.background]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
          <Image
            source={require("../../assets/images/logos/logo.png")}
            style={styles.logo}
          />
          <Animated.Text entering={FadeIn.delay(300)} style={styles.title}>
            {"Fitech"}
          </Animated.Text>
        </Animated.View>

        {showCard && (
          <>
            <Vector1 width={200} height={200} />
            <Animated.View
              entering={SlideInDown.springify().damping(15)}
              style={styles.card}
            >
              <Animated.View entering={FadeInUp.delay(200)}>
                <View style={styles.inputGroup}>
                  <Ionicons
                    name='mail-outline'
                    size={20}
                    color='#888'
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder='Email'
                    placeholderTextColor='#888'
                    style={styles.input}
                    keyboardType='email-address'
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(400)}>
                <View style={styles.inputGroup}>
                  <Ionicons
                    name='lock-closed-outline'
                    size={20}
                    color='#888'
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder='Password'
                    placeholderTextColor='#888'
                    secureTextEntry
                    style={styles.input}
                  />
                </View>
              </Animated.View>

              <Animated.View entering={ZoomIn.delay(600)}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center"
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    flexDirection: "row",
    columnGap: 10,
    width,
    top: 10,
    zIndex: 10
  },
  logo: {
    width: 60,
    height: 60
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 1,
    color: COLORS.light.blue
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginTop: height * 0.35,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 10
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#1B1F23"
  },
  button: {
    backgroundColor: "#0F4C81",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16
  }
});
