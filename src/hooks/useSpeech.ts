import { useCallback, useEffect, useRef, useState } from "react";

function getSpeechSynthesis(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  return window.speechSynthesis;
}

export function useSpeech() {
  const [muted, setMuted] = useState(false);
  const [supported, setSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const unlockedRef = useRef(false);
  const pendingTextRef = useRef<string | null>(null);

  useEffect(() => {
    const synthesis = getSpeechSynthesis();
    if (!synthesis) return;

    setSupported(true);

    const pickVoice = () => {
      const voices = synthesis.getVoices();
      voiceRef.current =
        voices.find((v) => v.name === "Daniel") || // macOS UK male
        voices.find((v) => v.name === "Alex") || // macOS US male
        voices.find((v) => v.name.includes("Google UK English Male")) ||
        voices.find((v) => v.name.includes("Microsoft David")) ||
        voices.find(
          (v) => v.lang === "en-GB" && !v.name.toLowerCase().includes("female"),
        ) ||
        voices.find(
          (v) =>
            v.lang.startsWith("en-") &&
            !v.name.toLowerCase().includes("female"),
        ) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        null;
    };

    // Called on first user gesture. Speaks any pending text synchronously
    // within the gesture handler — the only reliable way to satisfy Chrome's
    // speech synthesis permission requirement.
    //
    // We do NOT call synthesis.cancel() here because the queue is empty on
    // first interaction, and cancel() would delay the utterance from starting.
    // We also do NOT use a setTimeout — that exits the user-gesture window.
    const unlockSpeech = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;

      const pendingText = pendingTextRef.current;
      pendingTextRef.current = null;

      if (!pendingText || muted) return;

      const utterance = new SpeechSynthesisUtterance(pendingText);
      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
        utterance.lang = voiceRef.current.lang;
      }
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      synthesis.speak(utterance);
    };

    pickVoice();
    synthesis.addEventListener("voiceschanged", pickVoice);
    window.addEventListener("pointerdown", unlockSpeech, { passive: true });
    window.addEventListener("keydown", unlockSpeech);
    window.addEventListener("touchend", unlockSpeech, { passive: true });

    return () => {
      synthesis.removeEventListener("voiceschanged", pickVoice);
      window.removeEventListener("pointerdown", unlockSpeech);
      window.removeEventListener("keydown", unlockSpeech);
      window.removeEventListener("touchend", unlockSpeech);
    };
  }, [muted]);

  const speak = useCallback(
    (text: string) => {
      const synthesis = getSpeechSynthesis();
      if (!synthesis || muted) return;

      if (!unlockedRef.current) {
        // Store for playback on first user gesture
        pendingTextRef.current = text;
        return;
      }

      // Skip rather than cancel — the Daniel voice (and other high-quality
      // voices) has significant startup latency. Calling synthesis.cancel()
      // to make way for a new utterance causes the previous one to be killed
      // before it produces a single audio frame, resulting in silence.
      // Instead, let the current utterance finish and only queue the next one
      // when the synthesis engine is idle.
      if (synthesis.speaking || synthesis.pending) return;

      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
        utterance.lang = voiceRef.current.lang;
      }
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      synthesis.speak(utterance);
    },
    [muted],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const synthesis = getSpeechSynthesis();
      if (!m && synthesis) {
        pendingTextRef.current = null;
        synthesis.cancel();
      }

      return !m;
    });
  }, []);

  return { speak, muted, toggleMute, supported };
}
