import { useCallback, useEffect, useRef, useState } from "react";

function getSpeechSynthesis(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  return window.speechSynthesis;
}

// Build and configure an utterance. voiceRef may be null on first call
// (voices not yet loaded); Chrome will use its default voice in that case.
function makeUtterance(
  text: string,
  voice: SpeechSynthesisVoice | null,
): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text);
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  }
  u.rate = 0.92;
  u.pitch = 1.0;
  u.volume = 1.0;
  return u;
}

// Pick the best available English voice. Prefer non-local (browser-built-in)
// voices first because macOS "enhanced quality" system voices (Daniel, Alex)
// are silently ignored by Chrome's speech-synthesis layer even though
// getVoices() lists them. Chrome's own voices (Google …) and compact system
// voices work reliably across all browsers.
function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  return (
    // Chrome built-in voices (localService = false) — always work in Chrome
    voices.find((v) => !v.localService && v.name.includes("Google UK English Male")) ||
    voices.find((v) => !v.localService && v.name.includes("Google UK English")) ||
    voices.find((v) => !v.localService && v.lang === "en-GB") ||
    voices.find((v) => !v.localService && v.lang.startsWith("en-")) ||
    voices.find((v) => !v.localService && v.lang.startsWith("en")) ||
    // System voices — work in Firefox / VS Code / Safari; may fail silently
    // in Chrome on macOS with enhanced-quality voices
    voices.find((v) => v.name === "Daniel") ||
    voices.find((v) => v.name === "Alex") ||
    voices.find((v) => v.name.includes("Microsoft David")) ||
    voices.find((v) => v.lang === "en-GB" && !v.name.toLowerCase().includes("female")) ||
    voices.find((v) => v.lang.startsWith("en-") && !v.name.toLowerCase().includes("female")) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    null
  );
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

    const updateVoice = () => {
      voiceRef.current = pickVoice(synthesis.getVoices());
    };

    // Called on first user gesture. Speaks the pending text synchronously
    // within the gesture window — required by Chrome's speech synthesis policy.
    //
    // Uses 'click' (not 'pointerdown') because Chrome's speech-synthesis
    // permission check recognises 'click' more reliably as a user gesture.
    //
    // No synthesis.cancel() call here: the queue is empty on first interaction
    // so cancel is unnecessary, and calling it can delay audio start.
    const unlockSpeech = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;

      const pendingText = pendingTextRef.current;
      pendingTextRef.current = null;

      if (!pendingText || muted) return;

      synthesis.speak(makeUtterance(pendingText, voiceRef.current));
    };

    updateVoice();
    synthesis.addEventListener("voiceschanged", updateVoice);
    // 'click' covers mouse clicks AND touch taps (the browser fires a
    // synthetic click after touchend). 'keydown' covers keyboard users.
    window.addEventListener("click", unlockSpeech);
    window.addEventListener("keydown", unlockSpeech);

    return () => {
      synthesis.removeEventListener("voiceschanged", updateVoice);
      window.removeEventListener("click", unlockSpeech);
      window.removeEventListener("keydown", unlockSpeech);
    };
  }, [muted]);

  const speak = useCallback(
    (text: string) => {
      const synthesis = getSpeechSynthesis();
      if (!synthesis || muted) return;

      if (!unlockedRef.current) {
        pendingTextRef.current = text;
        return;
      }

      // Skip rather than cancel — cancelling kills utterances before they
      // produce audio (high-quality voices have significant startup latency).
      // Let the current utterance finish; only queue the next one when idle.
      if (synthesis.speaking || synthesis.pending) return;

      synthesis.speak(makeUtterance(text, voiceRef.current));
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
