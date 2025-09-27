import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import WavDecoder from "wav-decoder";
import { detectPitch } from "pitchy";

export default function GameScreen() {
  const [phase, setPhase] = useState<"tone" | "sing" | "stop">("tone");
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  // 🔊 Play reference tone (A4)
  const playTone = async () => {
    try {
      setIsPlayingTone(true);
      setCountdown(3);

      // Simple countdown
      let timer = 3;
      const interval = setInterval(() => {
        timer -= 1;
        if (timer > 0) {
          setCountdown(timer);
        } else {
          clearInterval(interval);
          setCountdown(null);
        }
      }, 1000);

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/a4_note.wav"),
        { shouldPlay: true, volume: 1.0 }
      );

      await sound.playAsync();
      setTimeout(async () => {
        await sound.stopAsync();
        await sound.unloadAsync();
        setIsPlayingTone(false);
        setPhase("sing");
      }, 3000);
    } catch (e) {
      console.error("Error playing tone", e);
      setIsPlayingTone(false);
    }
  };

  // 🎙 Start recording (force WAV format)
  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        alert("Microphone permission required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync({
        android: {
          extension: ".wav",
          outputFormat:
            Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_LINEAR_PCM,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      await rec.startAsync();
      setRecording(rec);
      setPhase("stop");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  // 🛑 Stop recording and detect pitch
  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        // 1. Read as Base64
        const fileBuffer = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // 2. Convert Base64 → Uint8Array
        const byteArray = Uint8Array.from(atob(fileBuffer), (c) =>
          c.charCodeAt(0)
        );

        // 3. Decode WAV
        const audioData = await WavDecoder.decode(Buffer.from(byteArray.buffer));

        // 4. Take first channel
        const channelData = audioData.channelData[0];

        // 5. Detect pitch
        const [pitch, clarity] = detectPitch(channelData, audioData.sampleRate);

        console.log("Detected pitch:", pitch, "Hz — Clarity:", clarity);

        const score = Math.round(clarity * 100);
        setScores((prev) => [...prev, score]);
      }

      setPhase("tone"); // next round
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎤 PitchPlay</Text>

      {countdown !== null && (
        <Text style={styles.countdown}>{countdown}</Text>
      )}

      {phase === "tone" && (
        <Button
          title={isPlayingTone ? "Playing..." : "Play Tone"}
          onPress={playTone}
          disabled={isPlayingTone}
        />
      )}
      {phase === "sing" && (
        <Button title="Start Singing" onPress={startRecording} />
      )}
      {phase === "stop" && (
        <Button title="Stop & Score" onPress={stopRecording} />
      )}

      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        <Text style={styles.subtitle}>🏆 Scoreboard</Text>
        {scores.map((s, i) => (
          <Text key={i}>Player {i + 1}: {s}%</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 24, marginBottom: 16, fontWeight: "bold" },
  subtitle: { fontSize: 18, marginTop: 20, fontWeight: "600" },
  countdown: { fontSize: 48, fontWeight: "bold", marginVertical: 20 },
  scoreboard: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: "center",
  },
});
