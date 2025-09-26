import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function ResultsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏆 Results Screen (to be built)</Text>
      <Pressable
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, marginBottom: 20 },
  button: {
    backgroundColor: "#118AB2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
