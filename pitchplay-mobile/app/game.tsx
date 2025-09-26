import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function GameScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎤 Game Screen (to be built)</Text>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/results")}
      >
        <Text style={styles.buttonText}>Finish Game</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, marginBottom: 20 },
  button: {
    backgroundColor: "#06D6A0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
