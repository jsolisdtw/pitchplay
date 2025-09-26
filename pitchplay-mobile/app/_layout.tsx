import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#6C63FF" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "PitchPlay" }} />
      <Stack.Screen name="game" options={{ title: "Game" }} />
      <Stack.Screen name="results" options={{ title: "Results" }} />
    </Stack>
  );
}
