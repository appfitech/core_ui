import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CalendarList } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(getTodayString());
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 12 }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Hola, Cesar 👋</Text>
      <Text style={styles.subtext}>Entrena. Mejora. Repite.</Text>

      {/* Centered calendar */}
      <View style={styles.calendarWrapper}>
        <CalendarList
          current={selectedDay}
          horizontal
          pastScrollRange={1}
          futureScrollRange={1}
          pagingEnabled
          calendarWidth={width - 40}
          hideArrows
          hideExtraDays
          markingType='custom'
          markedDates={{
            [selectedDay]: {
              customStyles: {
                container: {
                  backgroundColor: "#00C2FF",
                  borderRadius: 10
                },
                text: {
                  color: "#fff",
                  fontWeight: "600"
                }
              }
            }
          }}
          theme={{
            backgroundColor: "#F2F6FF",
            calendarBackground: "#F2F6FF",
            textSectionTitleColor: "#0F4C81",
            dayTextColor: "#222",
            textDisabledColor: "#ccc",
            todayTextColor: "#00C2FF",
            selectedDayBackgroundColor: "#00C2FF",
            selectedDayTextColor: "#ffffff",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayFontSize: 14,
            textMonthFontSize: 14
          }}
          onDayPress={(day) => setSelectedDay(day.dateString)}
        />
      </View>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Resumen del día</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricNumber}>325</Text>
            <Text style={styles.metricLabel}>calorías</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricNumber}>42</Text>
            <Text style={styles.metricLabel}>minutos</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricNumber}>2</Text>
            <Text style={styles.metricLabel}>rutinas</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name='add-circle-outline' size={24} color='#00C2FF' />
          <Text style={styles.actionText}>Añadir rutina</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/coach-swipe")}
        >
          <Ionicons name='person-circle-outline' size={24} color='#00C2FF' />
          <Text style={styles.actionText}>Buscar coach</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F2F6FF"
  },
  calendarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    flex: 1
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F4C81"
  },
  subtext: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#0F4C81"
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  metricBox: {
    alignItems: "center",
    flex: 1
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F4C81"
  },
  metricLabel: {
    fontSize: 12,
    color: "#666"
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 80
  },
  actionButton: {
    alignItems: "center"
  },
  actionText: {
    marginTop: 4,
    color: "#00C2FF",
    fontSize: 12,
    fontWeight: "500"
  }
});
