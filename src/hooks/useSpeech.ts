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

  // Speaks a truly silent utterance to satisfy Chrome's autoplay policy.
  // Must be called synchronously within a user-gesture handler.
  // Do NOT cancel it immediately — let it finish on its own (it's instant at
  // rate=10). Canceling before it starts may prevent Chrome from registering
  // the unlock.
  const primeSpeech = useCallback(() => {
    const synthesis = getSpeechSynthesis();
    if (!synthesis) return;

    try {
      const primer = new SpeechSynthesisUtterance("​"); // zero-width space
      primer.volume = 0;
      primer.rate = 10; // finish as fast as possible
      synthesis.speak(primer);
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

      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
        utterance.lang = voiceRef.current.lang;
      }
      // Do NOT set utterance.lang as a fallback when no voice is matched —
      // specifying a lang Chrome cannot fulfill causes a silent failure.
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      pendingSpeakTimeoutRef.current = window.setTimeout(() => {
        const syn = getSpeechSynthesis();
        if (!syn || muted) return;
        // Resume synthesis if it ended up in a paused state (e.g. page blur).
        if (syn.paused) syn.resume();
        syn.speak(utterance);
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

    // Called on first user gesture. primeSpeech() unlocks Chrome's synthesis
    // permission within the gesture window. speakNow() then cancels the silent
    // primer and queues the real text with a 40 ms delay. By that point
    // synthesis is already unlocked, so the delayed speak() succeeds.
    //
    // We do NOT call synthesis.speak(realText) directly here because:
    //   synthesis.cancel() (inside speakNow) + 40 ms timeout is the reliable
    //   pattern for clearing any stale queue before the real utterance.
    //   The primer ensures synthesis is unlocked before that timeout fires.
    //
    // Do NOT pre-unlock based on navigator.userActivation.hasBeenActive.
    // Even when true, calling synthesis.speak() from a useEffect or setTimeout
    // (not a gesture handler) is silently blocked by Chrome. Always wait for
    // a real gesture so primeSpeech can unlock synthesis synchronously.
    const unlockSpeech = () => {
      if (unlockedRef.current) return; // already unlocked — skip primer
      unlockedRef.current = true;

      // Unlock synthesis within the gesture, regardless of pending text.
      primeSpeech();

      if (pendingTextRef.current) {
        const text = pendingTextRef.current;
        pendingTextRef.current = null;
        // speakNow cancels the primer and speaks after 40 ms; synthesis is
        // already unlocked by the primeSpeech() call above.
        speakNow(text);
      }
    };

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
