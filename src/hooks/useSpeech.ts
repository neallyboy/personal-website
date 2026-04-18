import { useCallback, useEffect, useRef, useState } from 'react';

export function useSpeech() {
  const [muted, setMuted]         = useState(false);
  const [supported, setSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setSupported(true);

    const pickVoice = () => {
      const voices = speechSynthesis.getVoices();
      voiceRef.current =
        voices.find(v => v.name === 'Daniel') ||             // macOS UK male
        voices.find(v => v.name === 'Alex') ||               // macOS US male
        voices.find(v => v.name.includes('Google UK English Male')) ||
        voices.find(v => v.name.includes('Microsoft David')) ||
        voices.find(v => v.lang === 'en-GB' && !v.name.toLowerCase().includes('female')) ||
        voices.find(v => v.lang.startsWith('en-') && !v.name.toLowerCase().includes('female')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        null;
    };

    pickVoice();
    speechSynthesis.addEventListener('voiceschanged', pickVoice);
    return () => speechSynthesis.removeEventListener('voiceschanged', pickVoice);
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported || muted) return;
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utt.voice = voiceRef.current;
    utt.rate   = 0.92;
    utt.pitch  = 1.0;
    utt.volume = 1.0;
    speechSynthesis.speak(utt);
  }, [supported, muted]);

  const toggleMute = useCallback(() => {
    setMuted(m => {
      if (!m && typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
      return !m;
    });
  }, []);

  return { speak, muted, toggleMute, supported };
}
