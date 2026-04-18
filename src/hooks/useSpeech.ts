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

  const primeSpeech = useCallback(() => {
    const synthesis = getSpeechSynthesis();
    if (!synthesis) return;

    try {
      const primer = new SpeechSynthesisUtterance(" ");
      primer.volume = 0;
      primer.rate = 1;
      primer.pitch = 1;
      synthesis.speak(primer);
      synthesis.cancel();
      synthesis.resume();
    } catch {
      // Ignore priming failures and keep normal speech available.
    }
  }, []);

  const speakNow = useCallback(
    (text: string) => {
      const synthesis = getSpeechSynthesis();
      if (!synthesis || muted || !unlockedRef.current) return;

      clearPendingSpeak();
      synthesis.cancel();
      synthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.lang = voiceRef.current?.lang || "en-GB";
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      pendingSpeakTimeoutRef.current = window.setTimeout(() => {
        synthesis.resume();
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

    const unlockSpeech = () => {
      unlockedRef.current = true;
      primeSpeech();

      if (pendingTextRef.current) {
        const text = pendingTextRef.current;
        pendingTextRef.current = null;
        speakNow(text);
      }
    };

    if (navigator.userActivation?.hasBeenActive) {
      unlockedRef.current = true;
    }

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
  }, [clearPendingSpeak, primeSpeech, speakNow]);

  const speak = useCallback(
    (text: string) => {
      const synthesis = getSpeechSynthesis();
      if (!synthesis || muted) return;

      if (!unlockedRef.current) {
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
