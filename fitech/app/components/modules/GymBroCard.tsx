// import { Pressable, View } from "react-native";

// import { FullTheme } from "@/types/theme";

// import { AppText } from "../AppText";

// export function GymBroCard() {
//   return (
//     <View>
//       <SectionTitle theme={theme} label="Horarios de entrenamiento" />
//       <RowWrap>
//         <ChipToggle
//           label="Mañana"
//           active={
//             matchPreferences?.gymBroWorkoutTimes?.includes('MORNING') || false
//           }
//           onPress={() => {
//             setMatchPreferences((prev) => {
//               const set = new Set(
//                 (prev?.gymBroWorkoutTimes || []) as TimePref[],
//               );
//               set.has('MORNING') ? set.delete('MORNING') : set.add('MORNING');
//               return {
//                 ...(prev || {}),
//                 gymBroWorkoutTimes: Array.from(set),
//               };
//             });
//           }}
//           theme={theme}
//         />
//         <ChipToggle
//           label="Tarde"
//           active={
//             matchPreferences?.gymBroWorkoutTimes?.includes('AFTERNOON') || false
//           }
//           onPress={() =>
//             setMatchPreferences((prev) => {
//               const set = new Set(
//                 (prev?.gymBroWorkoutTimes || []) as TimePref[],
//               );
//               set.has('AFTERNOON')
//                 ? set.delete('AFTERNOON')
//                 : set.add('AFTERNOON');
//               return {
//                 ...(prev || {}),
//                 gymBroWorkoutTimes: Array.from(set),
//               };
//             })
//           }
//           theme={theme}
//         />
//         <ChipToggle
//           label="Noche"
//           active={
//             matchPreferences?.gymBroWorkoutTimes?.includes('NIGHT') || false
//           }
//           onPress={() =>
//             setMatchPreferences((prev) => {
//               const set = new Set(
//                 (prev?.gymBroWorkoutTimes || []) as TimePref[],
//               );
//               set.has('NIGHT') ? set.delete('NIGHT') : set.add('NIGHT');
//               return {
//                 ...(prev || {}),
//                 gymBroWorkoutTimes: Array.from(set),
//               };
//             })
//           }
//           theme={theme}
//         />
//         <ChipToggle
//           label="Fin de semana"
//           active={
//             matchPreferences?.gymBroWorkoutTimes?.includes('WEEKEND') || false
//           }
//           onPress={() =>
//             setMatchPreferences((prev) => {
//               const set = new Set(
//                 (prev?.gymBroWorkoutTimes || []) as TimePref[],
//               );
//               set.has('WEEKEND') ? set.delete('WEEKEND') : set.add('WEEKEND');
//               return {
//                 ...(prev || {}),
//                 gymBroWorkoutTimes: Array.from(set),
//               };
//             })
//           }
//           theme={theme}
//         />
//       </RowWrap>

//       <SectionTitle theme={theme} label="Nivel de intensidad" />
//       <RowWrap>
//         {(
//           [
//             ['Cualquiera', 'ANY'],
//             ['Principiante', 'BEGINNER'],
//             ['Intermedio', 'INTERMEDIATE'],
//             ['Avanzado', 'ADVANCED'],
//           ] as const
//         ).map(([label, val]) => (
//           <RadioChip
//             key={val}
//             label={label}
//             selected={matchPreferences?.gymBroIntensity === val}
//             onPress={() =>
//               setMatchPreferences((prev) => ({
//                 ...(prev || {}),
//                 gymBroIntensity: val as Intensity,
//               }))
//             }
//             theme={theme}
//           />
//         ))}
//       </RowWrap>

//       <SectionTitle theme={theme} label="Ubicaciones de interés" />
//       <Pressable
//         onPress={() => setLocModalOpen('GYMBRO')}
//         style={styles.locationPicker}
//       >
//         <AppText style={{ opacity: 0.7 }}>Agregar ubicación</AppText>
//       </Pressable>
//       <ChipsList
//         items={(matchPreferences?.gymBroLocations || []) as LocationDto[]}
//         onRemove={(id) =>
//           setMatchPreferences((prev) => ({
//             ...(prev || {}),
//             gymBroLocations: (prev?.gymBroLocations || []).filter(
//               (x) => x?.id !== id,
//             ),
//           }))
//         }
//         theme={theme}
//       />

//       <SectionTitle theme={theme} label="Preferencias Generales" />
//       <AppText style={styles.smallLabel}>Buscando</AppText>
//       <RowWrap>
//         {(
//           [
//             ['Hombres', 'MALE'],
//             ['Mujeres', 'FEMALE'],
//             ['Ambos', 'BOTH'],
//           ] as const
//         ).map(([label, val]) => (
//           <RadioChip
//             key={val}
//             label={label}
//             selected={
//               matchPreferences?.gymBroLookingForGender === (val as Gender)
//             }
//             onPress={() =>
//               setMatchPreferences((prev) => ({
//                 ...(prev || {}),
//                 gymBroLookingForGender: val as Gender,
//               }))
//             }
//             theme={theme}
//           />
//         ))}
//       </RowWrap>

//       <AppText style={styles.smallLabel}>Rango de edad</AppText>
//       <Row>
//         {ageInput(
//           matchPreferences?.gymBroAgeRangeMin,
//           (n) =>
//             setMatchPreferences((g) => ({
//               ...(g || {}),
//               gymBroAgeRangeMin: n,
//             })),
//           'Desde',
//         )}
//         <AppText style={{ marginHorizontal: 8 }}>—</AppText>
//         {ageInput(
//           matchPreferences?.gymBroAgeRangeMax,
//           (n) =>
//             setMatchPreferences((g) => ({
//               ...(g || {}),
//               gymBroAgeRangeMax: n,
//             })),
//           'Hasta',
//         )}
//       </Row>
//     </View>;
//   );
// }

// function SectionTitle({ label, theme }: { label: string; theme: FullTheme }) {
//   const styles = getStyles(theme);
//   return <AppText style={styles.sectionTitle}>{label}</AppText>;
// }

// function Row({ children, style }: { children: React.ReactNode; style?: any }) {
//   return (
//     <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
//       {children}
//     </View>
//   );
// }

// function RowWrap({ children }: { children: React.ReactNode }) {
//   return (
//     <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
//       {children}
//     </View>
//   );
// }

// function ChipToggle({
//   label,
//   active,
//   onPress,
//   theme,
// }: {
//   label: string;
//   active: boolean;
//   onPress: () => void;
//   theme: FullTheme;
// }) {
//   const styles = getStyles(theme);
//   return (
//     <Pressable
//       onPress={onPress}
//       style={[
//         styles.chip,
//         active && { backgroundColor: theme.backgroundInverted },
//       ]}
//     >
//       <AppText
//         style={[
//           styles.chipText,
//           active && { color: theme.dark100, fontWeight: '700' },
//         ]}
//       >
//         {label}
//       </AppText>
//     </Pressable>
//   );
// }
