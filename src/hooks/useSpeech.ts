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
  const pendingSpeakTimeoutRef = useRef<number | null>(null);

  const clearPendingSpeak = useCallback(() => {
    if (pendingSpeakTimeoutRef.current !== null) {
      window.clearTimeout(pendingSpeakTimeoutRef.current);
      pendingSpeakTimeoutRef.current = null;
    }
  }, []);

  const speakNow = useCallback(
    (text: string) => {
      const synthesis = getSpeechSynthesis();
      if (!synthesis || muted || !unlockedRef.current) return;

      clearPendingSpeak();
      synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.lang = voiceRef.current?.lang || "en-GB";
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      pendingSpeakTimeoutRef.current = window.setTimeout(() => {
        synthesis.speak(utterance);
        pendingSpeakTimeoutRef.current = null;
      }, 40);
    },
    [clearPendingSpeak, muted],
  );

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
    // within the gesture handler — this is the only reliable way to satisfy
    // Chrome's speech synthesis permission requirement.
    //
    // We intentionally do NOT go through speakNow() here because:
    //   1. speakNow calls synthesis.cancel() which revokes Chrome's permission
    //      grant before the 40 ms timeout fires.
    //   2. The 40 ms setTimeout itself exits the user-gesture activation window,
    //      causing Chrome to block the speak() call silently.
    const unlockSpeech = () => {
      unlockedRef.current = true;

      const pendingText = pendingTextRef.current;
      pendingTextRef.current = null;

      if (!pendingText || muted) return;

      // Speak synchronously within the gesture — no cancel, no timeout.
      const utterance = new SpeechSynthesisUtterance(pendingText);
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.lang = voiceRef.current?.lang || "en-GB";
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      synthesis.speak(utterance);
    };

    // Do NOT pre-unlock based on navigator.userActivation.hasBeenActive.
    // Even when true, calling synthesis.speak() from a useEffect or setTimeout
    // (not a gesture handler) is silently blocked by Chrome. Always wait for
    // a real gesture so unlockSpeech can speak synchronously.

    pickVoice();
    synthesis.addEventListener("voiceschanged", pickVoice);
    window.addEventListener("pointerdown", unlockSpeech, { passive: true });
    window.addEventListener("keydown", unlockSpeech);
    window.addEventListener("touchend", unlockSpeech, { passive: true });

    return () => {
      clearPendingSpeak();
      synthesis.removeEventListener("voiceschanged", pickVoice);
      window.removeEventListener("pointerdown", unlockSpeech);
      window.removeEventListener("keydown", unlockSpeech);
      window.removeEventListener("touchend", unlockSpeech);
    };
  }, [clearPendingSpeak, muted, speakNow]);

  const speak = useCallback(
    (text: string) => {
      const synthesis = getSpeechSynthesis();
      if (!synthesis || muted) return;

      if (!unlockedRef.current) {
        // Store for playback on first user gesture
        pendingTextRef.current = text;
        return;
      }

      speakNow(text);
    },
    [muted, speakNow],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const synthesis = getSpeechSynthesis();
      if (!m && synthesis) {
        clearPendingSpeak();
        pendingTextRef.current = null;
        synthesis.cancel();
      }

      return !m;
    });
  }, [clearPendingSpeak]);

  return { speak, muted, toggleMute, supported };
}
