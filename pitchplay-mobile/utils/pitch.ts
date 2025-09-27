import FFT from "fft.js";

// Convert frequency (Hz) to nearest musical note
export function freqToNote(freq: number): { note: string; cents: number } {
  if (freq <= 0) return { note: "?", cents: 0 };

  const A4 = 440;
  const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const noteNum = 12 * (Math.log2(freq / A4)) + 69; // MIDI note formula
  const noteIndex = Math.round(noteNum) % 12;
  const note = NOTES[(noteIndex + 12) % 12];
  const cents = Math.round((noteNum - Math.round(noteNum)) * 100);
  return { note, cents };
}

// Detect fundamental frequency from PCM audio buffer
export function detectPitch(buffer: Float32Array, sampleRate: number): number {
  const fftSize = 2048;
  const fft = new FFT(fftSize);
  const input = new Array(fftSize).fill(0);
  const out = fft.createComplexArray();

  // take first slice of buffer
  for (let i = 0; i < fftSize && i < buffer.length; i++) {
    input[i] = buffer[i];
  }

  fft.realTransform(out, input);
  fft.completeSpectrum(out);

  // magnitude spectrum
  const mags = [];
  for (let i = 0; i < fftSize / 2; i++) {
    const re = out[2 * i];
    const im = out[2 * i + 1];
    mags[i] = Math.sqrt(re * re + im * im);
  }

  // find peak
  let maxIndex = 0;
  for (let i = 1; i < mags.length; i++) {
    if (mags[i] > mags[maxIndex]) {
      maxIndex = i;
    }
  }

  const freq = (maxIndex * sampleRate) / fftSize;
  return freq;
}
