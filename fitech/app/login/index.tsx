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
import Animated, {
  FadeInUp,
  SlideInDown,
  ZoomIn
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [showUI, setShowUI] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setShowUI(true), 600);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.dark.accent, COLORS.dark.background]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Animated.Image
            entering={FadeInUp.duration(600)}
            source={require("../../assets/images/logos/logo.png")}
            style={styles.logo}
            resizeMode='contain'
          />
          <Animated.Text
            entering={FadeInUp.delay(200)}
            style={styles.headerTitle}
          >
            {"Inicia sesión en tu \ncuenta"}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(300)}
            style={styles.headerSubtitle}
          >
            {"Entrena. Mejora. Repite."}
          </Animated.Text>
        </View>

        {showUI && (
          <Animated.View
            entering={SlideInDown.springify().damping(15)}
            style={styles.card}
          >
            <TouchableOpacity style={styles.googleButton}>
              <Ionicons name='logo-google' size={20} color='#000' />
              <Text style={styles.googleButtonText}>
                {"Continuar con Google"}
              </Text>
            </TouchableOpacity>

            <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.separatorText}>{"O inicia sesión con"}</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name='mail-outline'
                size={20}
                color='#888'
                style={styles.iconLeft}
              />
              <TextInput
                placeholder='Email'
                placeholderTextColor='#888'
                keyboardType='email-address'
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name='lock-closed-outline'
                size={20}
                color='#888'
                style={styles.iconLeft}
              />
              <TextInput
                placeholder={"Contraseña"}
                placeholderTextColor='#888'
                secureTextEntry
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
              />
              <Ionicons name='eye-outline' size={20} color='#888' />
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity>
                <Text style={styles.rememberMe}>☐ {"Recuérdame"}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotText}>
                  {"¿Olvidaste tu contraseña?"}
                </Text>
              </TouchableOpacity>
            </View>

            <Animated.View entering={ZoomIn.delay(200)}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/onboarding")}
              >
                <Text style={styles.loginButtonText}>{"Iniciar sesión"}</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.footerText}>
              <Text style={{ color: "#999" }}>{"¿No tienes una cuenta?"}</Text>
              <TouchableOpacity>
                <Text style={styles.signUp}>{"Regístrate"}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F2F6FF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 24
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#fff"
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#DDE6FF",
    textAlign: "center",
    marginTop: 8
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center"
  },
  googleButtonText: {
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 14
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E4E6EB"
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#999",
    fontSize: 12
  },
  input: {
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 14,
    // marginBottom: 16,
    // overflow: "hidden",
    color: "#1B1F23"
  },
  passwordWrapper: {
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 0,
    marginBottom: 16
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },
  rememberMe: {
    fontSize: 12,
    color: "#666"
  },
  forgotText: {
    fontSize: 12,
    color: COLORS.light.primary,
    fontWeight: "500"
  },
  loginButton: {
    backgroundColor: COLORS.light.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center"
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  footerText: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center"
  },
  signUp: {
    color: COLORS.light.primary,
    fontWeight: "500"
  },
  gradient: {
    flex: 1
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16
  },
  iconLeft: {
    marginRight: 8
  }
});
