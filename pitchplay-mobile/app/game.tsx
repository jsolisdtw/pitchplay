import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Audio } from "expo-av";

const NOTES = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

export default function GameScreen() {
  const { players } = useLocalSearchParams<{ players: string }>();
  const totalPlayers = Number(players) || 1;

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "reference" | "challenge" | "done">("idle");
  const router = useRouter();

  // Helper: play an A tone (440 Hz) for 3 seconds
  const playReferenceTone = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/a4_note.wav") // we’ll add this file in Step 3
      );
      await sound.playAsync();

      // Stop after 3 seconds
      setTimeout(async () => {
        await sound.stopAsync();
        await sound.unloadAsync();
      }, 3000);
    } catch (err) {
      console.error("Error playing tone", err);
    }
  };

  useEffect(() => {
    if (phase === "reference") {
      playReferenceTone(); // 🔊 Play A note
      // After 3s, show random note
      setTimeout(() => {
        const random = NOTES[Math.floor(Math.random() * NOTES.length)];
        setCurrentNote(random);
        setPhase("challenge");
      }, 3000);
    } else if (phase === "challenge") {
      // After 5s, go to next player or finish
      setTimeout(() => {
        if (currentPlayer < totalPlayers) {
          setCurrentPlayer((p) => p + 1);
          setPhase("reference");
        } else {
          setPhase("done");
        }
      }, 5000);
    }
  }, [phase, currentPlayer]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 PitchPlay 🎵</Text>

      {phase === "idle" && (
        <Pressable
          style={styles.button}
          onPress={() => setPhase("reference")}
        >
          <Text style={styles.buttonText}>Start Player {currentPlayer}</Text>
        </Pressable>
      )}

      {phase === "reference" && (
        <Text style={styles.info}>
          🎹 Playing reference A note for Player {currentPlayer}...
        </Text>
      )}

      {phase === "challenge" && (
        <Text style={styles.info}>
          🎤 Player {currentPlayer}, sing: {currentNote}
        </Text>
      )}

      {phase === "done" && (
        <Pressable
          style={styles.button}
          onPress={() => router.push("/results")}
        >
          <Text style={styles.buttonText}>See Results</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#6C63FF" },
  info: { fontSize: 20, textAlign: "center", marginBottom: 20 },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
