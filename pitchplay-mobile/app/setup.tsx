import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function SetupScreen() {
  const router = useRouter();
  const [players, setPlayers] = useState(1);

  const increase = () => setPlayers((p) => Math.min(4, p + 1));
  const decrease = () => setPlayers((p) => Math.max(1, p - 1));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Player Setup</Text>
      <Text style={styles.subtitle}>Choose number of players</Text>

      <View style={styles.counter}>
        <Pressable style={styles.counterButton} onPress={decrease}>
          <Text style={styles.counterText}>-</Text>
        </Pressable>
        <Text style={styles.players}>{players}</Text>
        <Pressable style={styles.counterButton} onPress={increase}>
          <Text style={styles.counterText}>+</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.startButton}
        onPress={() => router.push({ pathname: "/game", params: { players } })}
      >
        <Text style={styles.startText}>Start Game</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#6C63FF" },
  subtitle: { fontSize: 16, marginBottom: 20, color: "#444" },
  counter: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  counterButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  counterText: { fontSize: 20, fontWeight: "bold" },
  players: { fontSize: 24, fontWeight: "bold", color: "#333" },
  startButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  startText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
