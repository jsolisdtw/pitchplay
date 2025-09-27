import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 PitchPlay 🎵</Text>
      <Text style={styles.subtitle}>Sing the note. Beat your friends!</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/setup")}
      >
        <Text style={styles.buttonText}>Start Game</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6C63FF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
